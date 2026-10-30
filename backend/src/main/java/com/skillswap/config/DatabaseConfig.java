package com.skillswap.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URI;
import java.sql.Connection;

@Configuration
public class DatabaseConfig {

    private static final Logger log = LoggerFactory.getLogger(DatabaseConfig.class);
    private static final String DEFAULT_H2_URL = "jdbc:h2:file:./data/skillswapdb;DB_CLOSE_ON_EXIT=FALSE;DB_CLOSE_DELAY=-1;MODE=PostgreSQL;DATABASE_TO_LOWER=TRUE;AUTO_RECONNECT=TRUE";

    @Value("${spring.profiles.active:default}")
    private String activeProfile;

    @Value("${spring.datasource.url:#{null}}")
    private String springDatasourceUrl;

    @Value("${spring.datasource.username:#{null}}")
    private String springDatasourceUsername;

    @Value("${spring.datasource.password:#{null}}")
    private String springDatasourcePassword;

    @Bean
    @Primary
    public DataSource dataSource() {
        // 1. Check Railway's DATABASE_URL or standard environment variables
        String envDatabaseUrl = System.getenv("DATABASE_URL");
        String envSpringUrl = System.getenv("SPRING_DATASOURCE_URL");
        String envSupabaseUrl = System.getenv("SUPABASE_DB_URL");

        String jdbcUrl = null;
        String username = null;
        String password = null;

        if (envDatabaseUrl != null && !envDatabaseUrl.isBlank()) {
            try {
                // Parse postgres://user:password@host:port/database or postgresql://...
                String cleanedUrl = envDatabaseUrl.trim();
                if (cleanedUrl.startsWith("postgres://")) {
                    cleanedUrl = "postgresql://" + cleanedUrl.substring("postgres://".length());
                }
                URI uri = new URI(cleanedUrl);
                String userInfo = uri.getUserInfo();
                if (userInfo != null) {
                    String[] parts = userInfo.split(":", 2);
                    username = parts[0];
                    if (parts.length > 1) {
                        password = parts[1];
                    }
                }
                int port = uri.getPort() == -1 ? 5432 : uri.getPort();
                String path = uri.getPath();
                if (path != null && path.startsWith("/")) {
                    path = path.substring(1);
                }
                jdbcUrl = "jdbc:postgresql://" + uri.getHost() + ":" + port + "/" + path;
                if (uri.getQuery() != null) {
                    jdbcUrl += "?" + uri.getQuery();
                }
                log.info("Parsed Railway DATABASE_URL for host: {}:{}", uri.getHost(), port);
            } catch (Exception e) {
                log.warn("Failed to parse DATABASE_URL environment variable", e);
            }
        }

        if (jdbcUrl == null && envSpringUrl != null && !envSpringUrl.isBlank()) {
            jdbcUrl = envSpringUrl.trim();
            username = System.getenv("SPRING_DATASOURCE_USERNAME");
            password = System.getenv("SPRING_DATASOURCE_PASSWORD");
        } else if (jdbcUrl == null && envSupabaseUrl != null && !envSupabaseUrl.isBlank()) {
            jdbcUrl = envSupabaseUrl.trim();
            username = System.getenv("SUPABASE_DB_USER");
            password = System.getenv("SUPABASE_DB_PASSWORD");
        } else if (jdbcUrl == null && springDatasourceUrl != null && !springDatasourceUrl.isBlank()) {
            jdbcUrl = springDatasourceUrl.trim();
            username = springDatasourceUsername;
            password = springDatasourcePassword;
        }

        // If a remote/external database is targeted, attempt connection with fail-fast check in production
        if (jdbcUrl != null && !jdbcUrl.contains(":h2:")) {
            log.info("Attempting to connect to primary database: {}", sanitizeUrl(jdbcUrl));
            try {
                HikariConfig config = new HikariConfig();
                config.setJdbcUrl(jdbcUrl);
                if (username != null) config.setUsername(username);
                if (password != null) config.setPassword(password);
                config.setConnectionTimeout(10000); // 10s connection timeout
                config.setMaximumPoolSize(8);
                config.setMinimumIdle(2);
                config.setIdleTimeout(300000);
                config.setMaxLifetime(600000);

                HikariDataSource primaryDs = new HikariDataSource(config);
                // Verify connection works
                try (Connection conn = primaryDs.getConnection()) {
                    log.info("Successfully connected to primary database ({})", conn.getMetaData().getDatabaseProductName());
                    return primaryDs;
                } catch (Exception ex) {
                    log.error("Primary database connection check failed: {}. Closing pool.", ex.getMessage());
                    primaryDs.close();
                    throw ex;
                }
            } catch (Exception e) {
                boolean isProduction = System.getenv("RAILWAY_ENVIRONMENT") != null
                        || System.getenv("RAILWAY_STATIC_URL") != null
                        || "supabase".equalsIgnoreCase(activeProfile)
                        || "prod".equalsIgnoreCase(activeProfile)
                        || "production".equalsIgnoreCase(activeProfile);

                if (isProduction) {
                    log.error("CRITICAL: Failed to connect to primary database in production mode. "
                            + "Failing fast to prevent data loss on ephemeral storage. URL: {}", sanitizeUrl(jdbcUrl), e);
                    throw new IllegalStateException("Production database connection failure for " + sanitizeUrl(jdbcUrl), e);
                }

                log.warn("Could not connect to external database ({}). In dev profile, falling back to local H2.", e.getMessage());
            }
        }

        // Fallback / Default H2 DataSource for local development
        log.info("Initializing local persistent H2 database at ./data/skillswapdb");
        HikariConfig h2Config = new HikariConfig();
        h2Config.setJdbcUrl(DEFAULT_H2_URL);
        h2Config.setUsername("sa");
        h2Config.setPassword("password");
        h2Config.setDriverClassName("org.h2.Driver");
        h2Config.setConnectionTimeout(20000);
        h2Config.setMaximumPoolSize(15);
        h2Config.setMinimumIdle(3);
        return new HikariDataSource(h2Config);
    }

    private String sanitizeUrl(String url) {
        if (url == null) return "";
        return url.replaceAll(":[^/@:]+@", ":***@");
    }
}
