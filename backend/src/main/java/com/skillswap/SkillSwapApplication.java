package com.skillswap;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class SkillSwapApplication {
    public static void main(String[] args) {
        SpringApplication.run(SkillSwapApplication.class, args);
    }
}
