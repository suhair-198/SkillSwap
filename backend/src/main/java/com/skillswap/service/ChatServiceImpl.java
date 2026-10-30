package com.skillswap.service;

import com.skillswap.dto.MessageDTO;
import com.skillswap.exception.BadRequestException;
import com.skillswap.exception.ResourceNotFoundException;
import com.skillswap.model.Connection;
import com.skillswap.model.ConnectionStatus;
import com.skillswap.model.Group;
import com.skillswap.model.Message;
import com.skillswap.model.User;
import com.skillswap.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Service
public class ChatServiceImpl implements ChatService {

    private static final int MAX_DAILY_CHAT_XP = 20;
    private static final long CHAT_XP_COOLDOWN_MS = 30_000; // 30 seconds cooldown between XP grants

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final GroupRepository groupRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final ConnectionRepository connectionRepository;

    private final ConcurrentHashMap<UUID, Long> lastXpAwardTime = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<UUID, AtomicInteger> dailyXpCounter = new ConcurrentHashMap<>();
    private volatile LocalDate lastResetDate = LocalDate.now();

    @Autowired
    public ChatServiceImpl(MessageRepository messageRepository,
                           UserRepository userRepository,
                           GroupRepository groupRepository,
                           GroupMemberRepository groupMemberRepository,
                           ConnectionRepository connectionRepository) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.groupRepository = groupRepository;
        this.groupMemberRepository = groupMemberRepository;
        this.connectionRepository = connectionRepository;
    }

    private void awardChatXpIfEligible(User sender) {
        LocalDate today = LocalDate.now();
        if (!today.equals(lastResetDate)) {
            dailyXpCounter.clear();
            lastResetDate = today;
        }

        UUID userId = sender.getId();
        long now = System.currentTimeMillis();
        Long lastTime = lastXpAwardTime.get(userId);

        if (lastTime != null && (now - lastTime) < CHAT_XP_COOLDOWN_MS) {
            return; // Cooldown not yet elapsed
        }

        AtomicInteger counter = dailyXpCounter.computeIfAbsent(userId, k -> new AtomicInteger(0));
        if (counter.get() < MAX_DAILY_CHAT_XP) {
            counter.incrementAndGet();
            lastXpAwardTime.put(userId, now);
            sender.setXp(sender.getXp() + 1);
            userRepository.save(sender);
        }
    }

    @Override
    @Transactional
    public MessageDTO savePrivateMessage(UUID senderId, UUID recipientId, String content, String mediaUrl) {
        if (senderId.equals(recipientId)) {
            throw new BadRequestException("You cannot send messages to yourself.");
        }

        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new ResourceNotFoundException("Sender not found"));
        User recipient = userRepository.findById(recipientId)
                .orElseThrow(() -> new ResourceNotFoundException("Recipient not found"));

        // Verify active ACCEPTED connection
        Connection connection = connectionRepository.findConnectionBetween(senderId, recipientId)
                .orElseThrow(() -> new BadRequestException("You can only message users you are connected with."));

        if (!ConnectionStatus.ACCEPTED.equals(connection.getStatus())) {
            throw new BadRequestException("Cannot send message: connection is not accepted.");
        }

        Message message = Message.builder()
                .sender(sender)
                .recipient(recipient)
                .content(content)
                .mediaUrl(mediaUrl)
                .read(false)
                .build();

        Message saved = messageRepository.save(message);

        // Gamification: Reward user with bounded XP (+1) subject to daily cap and cooldown
        awardChatXpIfEligible(sender);

        return MessageDTO.fromMessage(saved);
    }

    @Override
    @Transactional
    public MessageDTO saveGroupMessage(UUID senderId, UUID groupId, String content, String mediaUrl) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new ResourceNotFoundException("Sender not found"));
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Group not found"));

        // Verify sender is in group
        if (!groupMemberRepository.existsByGroupIdAndUserId(groupId, senderId)) {
            throw new BadRequestException("You are not a member of this learning group!");
        }

        Message message = Message.builder()
                .sender(sender)
                .group(group)
                .content(content)
                .mediaUrl(mediaUrl)
                .read(false)
                .build();

        Message saved = messageRepository.save(message);

        // Reward user XP (+1) subject to daily cap and cooldown
        awardChatXpIfEligible(sender);

        return MessageDTO.fromMessage(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MessageDTO> getPrivateChatHistory(UUID userA, UUID userB) {
        if (!userRepository.existsById(userA) || !userRepository.existsById(userB)) {
            throw new ResourceNotFoundException("User not found");
        }

        boolean isConnected = connectionRepository.findConnectionBetween(userA, userB)
                .map(c -> ConnectionStatus.ACCEPTED.equals(c.getStatus()))
                .orElse(false);

        if (!isConnected) {
            throw new BadRequestException("Cannot access private chat history without an accepted connection.");
        }

        return messageRepository.findDirectMessages(userA, userB).stream()
                .map(MessageDTO::fromMessage)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<MessageDTO> getGroupChatHistory(UUID groupId) {
        if (!groupRepository.existsById(groupId)) {
            throw new ResourceNotFoundException("Group not found");
        }
        return messageRepository.findByGroupIdOrderByCreatedAtAsc(groupId).stream()
                .map(MessageDTO::fromMessage)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void markMessagesAsRead(UUID recipientId, UUID senderId) {
        List<Message> unread = messageRepository.findUnreadMessagesForRecipient(recipientId).stream()
                .filter(m -> m.getSender().getId().equals(senderId))
                .collect(Collectors.toList());
        
        for (Message m : unread) {
            m.setRead(true);
        }
        messageRepository.saveAll(unread);
    }

    @Override
    @Transactional(readOnly = true)
    public long getUnreadCount(UUID recipientId, UUID senderId) {
        return messageRepository.countUnreadMessagesFromSender(recipientId, senderId);
    }
}
