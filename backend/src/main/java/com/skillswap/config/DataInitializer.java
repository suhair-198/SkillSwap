package com.skillswap.config;

import com.skillswap.model.Role;
import com.skillswap.model.Skill;
import com.skillswap.repository.RoleRepository;
import com.skillswap.repository.SkillRepository;
import com.skillswap.repository.UserRepository;
import com.skillswap.repository.UserSkillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final SkillRepository skillRepository;
    private final UserRepository userRepository;
    private final UserSkillRepository userSkillRepository;

    @Autowired
    public DataInitializer(RoleRepository roleRepository,
                           SkillRepository skillRepository,
                           UserRepository userRepository,
                           UserSkillRepository userSkillRepository) {
        this.roleRepository = roleRepository;
        this.skillRepository = skillRepository;
        this.userRepository = userRepository;
        this.userSkillRepository = userSkillRepository;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // 1. Seed Essential System Roles
        seedRole("ROLE_STUDENT");
        seedRole("ROLE_ADMIN");
        seedRole("ROLE_MODERATOR");

        // 2. Seed Standard Catalog Skills so users can select and swap skills immediately
        seedSkill("Java", "Programming");
        seedSkill("React", "Web Development");
        seedSkill("Python", "Data Science");
        seedSkill("SQL", "Databases");
        seedSkill("Figma", "Design");
        seedSkill("Spanish", "Languages");
        seedSkill("Public Speaking", "Soft Skills");
        seedSkill("Machine Learning", "Data Science");
        seedSkill("TypeScript", "Web Development");
        seedSkill("Node.js", "Backend Development");
        seedSkill("Spring Boot", "Backend Development");
        seedSkill("Docker", "DevOps");
        seedSkill("UI/UX Design", "Design");
        seedSkill("Data Structures", "Computer Science");
        seedSkill("Rust Programming", "Programming");
        seedSkill("Go Language", "Programming");
        seedSkill("Kotlin Mobile Development", "Programming");

        // 3. Purge all legacy dummy accounts from the database
        List<String> dummyEmails = Arrays.asList(
                "alice@skillswap.com",
                "bob@skillswap.com",
                "charlie@skillswap.com"
        );

        for (String dummyEmail : dummyEmails) {
            userRepository.findByEmail(dummyEmail).ifPresent(user -> {
                userSkillRepository.findByUserId(user.getId()).forEach(userSkillRepository::delete);
                userRepository.delete(user);
                System.out.println("Removed legacy dummy account: " + dummyEmail);
            });
        }

        System.out.println("Database initialization complete: System roles and skills ready. No dummy accounts.");
    }

    private Role seedRole(String name) {
        return roleRepository.findByName(name)
                .orElseGet(() -> roleRepository.save(new Role(null, name)));
    }

    private Skill seedSkill(String name, String category) {
        return skillRepository.findByNameIgnoreCase(name)
                .orElseGet(() -> skillRepository.save(
                        Skill.builder()
                                .name(name)
                                .category(category)
                                .build()
                ));
    }
}
