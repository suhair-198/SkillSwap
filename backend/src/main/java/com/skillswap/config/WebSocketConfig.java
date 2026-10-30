package com.skillswap.config;

import com.skillswap.security.CustomUserDetailsService;
import com.skillswap.security.JwtTokenProvider;
import com.skillswap.security.UserPrincipal;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.util.StringUtils;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Configuration
@EnableWebSocketMessageBroker
@Order(Ordered.HIGHEST_PRECEDENCE + 99)
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private static final Logger log = LoggerFactory.getLogger(WebSocketConfig.class);

    private final JwtTokenProvider tokenProvider;
    private final CustomUserDetailsService userDetailsService;

    @Value("${app.cors.allowed-origins:http://localhost:3000,http://localhost:5173,https://skillswap.vercel.app}")
    private String allowedOrigins;

    @Autowired
    public WebSocketConfig(JwtTokenProvider tokenProvider, CustomUserDetailsService userDetailsService) {
        this.tokenProvider = tokenProvider;
        this.userDetailsService = userDetailsService;
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        List<String> origins = Arrays.stream(allowedOrigins.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());

        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns(origins.toArray(new String[0]))
                .withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic", "/queue");
        config.setApplicationDestinationPrefixes("/app");
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
                if (accessor == null) {
                    return message;
                }

                if (StompCommand.CONNECT.equals(accessor.getCommand())) {
                    String authHeader = accessor.getFirstNativeHeader("Authorization");
                    if (StringUtils.hasText(authHeader) && authHeader.startsWith("Bearer ")) {
                        String jwt = authHeader.substring(7);
                        if (tokenProvider.validateToken(jwt)) {
                            UUID userId = tokenProvider.getUserIdFromJWT(jwt);
                            UserDetails userDetails = userDetailsService.loadUserById(userId);
                            UsernamePasswordAuthenticationToken authentication =
                                    new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                            accessor.setUser(authentication);
                            log.debug("STOMP authenticated user: {}", userDetails.getUsername());
                        } else {
                            throw new AccessDeniedException("Invalid JWT token for WebSocket connection");
                        }
                    } else {
                        throw new AccessDeniedException("Missing Authorization header in STOMP CONNECT");
                    }
                } else if (StompCommand.SUBSCRIBE.equals(accessor.getCommand())) {
                    String destination = accessor.getDestination();
                    if (destination != null && destination.startsWith("/topic/user.")) {
                        String userPart = destination.substring("/topic/user.".length());
                        if (userPart.endsWith(".typing")) {
                            userPart = userPart.substring(0, userPart.length() - ".typing".length());
                        }
                        if (accessor.getUser() instanceof UsernamePasswordAuthenticationToken) {
                            UsernamePasswordAuthenticationToken auth = (UsernamePasswordAuthenticationToken) accessor.getUser();
                            if (auth.getPrincipal() instanceof UserPrincipal) {
                                UserPrincipal principal = (UserPrincipal) auth.getPrincipal();
                                if (!principal.getId().toString().equalsIgnoreCase(userPart)) {
                                    log.warn("User {} attempted to subscribe to unauthorized topic: {}", principal.getId(), destination);
                                    throw new AccessDeniedException("Unauthorized subscription to topic: " + destination);
                                }
                            }
                        } else {
                            throw new AccessDeniedException("Unauthenticated subscription");
                        }
                    }
                }
                return message;
            }
        });
    }
}
