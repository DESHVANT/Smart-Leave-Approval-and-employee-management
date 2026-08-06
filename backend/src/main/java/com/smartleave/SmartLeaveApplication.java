package com.smartleave;

import com.smartleave.model.Role;
import com.smartleave.model.User;
import com.smartleave.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
@RequiredArgsConstructor
public class SmartLeaveApplication {

    private static final Logger log = LoggerFactory.getLogger(SmartLeaveApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(SmartLeaveApplication.class, args);
    }

    @Bean
    CommandLineRunner seedDemoUsers(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            createUserIfMissing(userRepository, passwordEncoder,
                    "Admin User", "admin@smartleave.test", "Admin123!", Role.ROLE_ADMIN, 0,
                    "Operations", "Leave Administrator", "+1-555-0100");
            createUserIfMissing(userRepository, passwordEncoder,
                    "Ava Employee", "employee@smartleave.test", "Employee123!", Role.ROLE_EMPLOYEE, 12,
                    "Engineering", "Software Engineer", "+1-555-0199");
        };
    }

    private void createUserIfMissing(UserRepository userRepository,
                                     PasswordEncoder passwordEncoder,
                                     String name,
                                     String email,
                                     String password,
                                     Role role,
                                     int leaveBalance,
                                     String department,
                                     String position,
                                     String phone) {
        if (userRepository.existsByEmail(email)) {
            return;
        }

        userRepository.save(User.builder()
                .name(name)
                .email(email)
                .password(passwordEncoder.encode(password))
                .role(role)
                .leaveBalance(leaveBalance)
                .department(department)
                .position(position)
                .phone(phone)
                .active(true)
                .build());

        log.info("Seeded demo user {} with role {}", email, role);
    }
}