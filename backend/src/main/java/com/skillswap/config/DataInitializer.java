package com.skillswap.config;

import com.skillswap.model.Role;
import com.skillswap.model.Skill;
import com.skillswap.model.User;
import com.skillswap.model.UserSkill;
import com.skillswap.repository.RoleRepository;
import com.skillswap.repository.SkillRepository;
import com.skillswap.repository.UserRepository;
import com.skillswap.repository.UserSkillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final SkillRepository skillRepository;
    private final UserRepository userRepository;
    private final UserSkillRepository userSkillRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public DataInitializer(RoleRepository roleRepository,
                           SkillRepository skillRepository,
                           UserRepository userRepository,
                           UserSkillRepository userSkillRepository,
                           PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.skillRepository = skillRepository;
        this.userRepository = userRepository;
        this.userSkillRepository = userSkillRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // 1. Seed Roles
        Role studentRole = seedRole("ROLE_STUDENT");
        seedRole("ROLE_ADMIN");
        seedRole("ROLE_MODERATOR");

        // 2. Check if users already exist
        if (userRepository.count() > 0) {
            System.out.println("Database already contains data. Skipping seeding.");
            return;
        }

        System.out.println("Seeding initial mock data...");

        // 3. Seed Skills
        Skill java = seedSkill("Java", "Programming");
        Skill react = seedSkill("React", "Web Development");
        Skill python = seedSkill("Python", "Data Science");
        Skill sql = seedSkill("SQL", "Databases");
        Skill figma = seedSkill("Figma", "Design");
        Skill spanish = seedSkill("Spanish", "Languages");
        Skill publicSpeaking = seedSkill("Public Speaking", "Soft Skills");
        Skill machineLearning = seedSkill("Machine Learning", "Data Science");

        // 4. Seed Mock Users
        Set<Role> roles = new HashSet<>(Collections.singletonList(studentRole));

        User alice = User.builder()
                .email("alice@skillswap.com")
                .password(passwordEncoder.encode("password"))
                .fullName("Alice Smith")
                .bio("Computer Science major at MIT. I love building web apps and learning languages.")
                .college("Massachusetts Institute of Technology")
                .department("Computer Science")
                .xp(1200)
                .level(3)
                .reputation(95)
                .currentStreak(5)
                .roles(roles)
                .build();
        userRepository.save(alice);

        User bob = User.builder()
                .email("bob@skillswap.com")
                .password(passwordEncoder.encode("password"))
                .fullName("Bob Jones")
                .bio("Language enthusiast and UX/UI Designer. Always looking to code my designs.")
                .college("Harvard University")
                .department("Visual Arts")
                .xp(850)
                .level(2)
                .reputation(80)
                .currentStreak(2)
                .roles(roles)
                .build();
        userRepository.save(bob);

        User charlie = User.builder()
                .email("charlie@skillswap.com")
                .password(passwordEncoder.encode("password"))
                .fullName("Charlie Brown")
                .bio("Mathematics major interested in data science and public presentation.")
                .college("Stanford University")
                .department("Mathematics")
                .xp(450)
                .level(1)
                .reputation(70)
                .currentStreak(0)
                .roles(roles)
                .build();
        userRepository.save(charlie);

        // 5. Seed User Skills (Teach = true, Learn = false)
        // Alice teaches Java & React; wants Spanish & Figma
        addUserSkill(alice, java, "EXPERT", true);
        addUserSkill(alice, react, "INTERMEDIATE", true);
        addUserSkill(alice, spanish, "BEGINNER", false);
        addUserSkill(alice, figma, "BEGINNER", false);

        // Bob teaches Spanish & Figma; wants Java & Python
        addUserSkill(bob, spanish, "EXPERT", true);
        addUserSkill(bob, figma, "ADVANCED", true);
        addUserSkill(bob, java, "BEGINNER", false);
        addUserSkill(bob, python, "INTERMEDIATE", false);

        // Charlie teaches Python & SQL; wants React & Public Speaking
        addUserSkill(charlie, python, "EXPERT", true);
        addUserSkill(charlie, sql, "ADVANCED", true);
        addUserSkill(charlie, react, "BEGINNER", false);
        addUserSkill(charlie, publicSpeaking, "INTERMEDIATE", false);

        System.out.println("Data seeding complete!");
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

    private void addUserSkill(User user, Skill skill, String proficiency, boolean isKnown) {
        userSkillRepository.save(
                UserSkill.builder()
                        .user(user)
                        .skill(skill)
                        .proficiencyLevel(proficiency)
                        .isKnown(isKnown)
                        .build()
        );
    }
}
