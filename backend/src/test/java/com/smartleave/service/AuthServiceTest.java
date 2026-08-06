package com.smartleave.service;

import com.smartleave.config.JwtService;
import com.smartleave.dto.AuthRequest;
import com.smartleave.dto.AuthResponse;
import com.smartleave.dto.RegisterRequest;
import com.smartleave.model.Role;
import com.smartleave.model.User;
import com.smartleave.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private AuthenticationManager authenticationManager;
    @Mock private JwtService jwtService;

    @InjectMocks private AuthService authService;

    @BeforeEach
    void setUp() {
        when(jwtService.generateToken(any(UserDetails.class))).thenReturn("signed-token");
    }

    @Test
    void registerCreatesEmployeeAccountWithDefaultBalance() {
        RegisterRequest request = new RegisterRequest();
        request.setName("Ava Employee");
        request.setEmail("Employee@SmartLeave.test");
        request.setPassword("Employee123!");
        request.setDepartment("Engineering");
        request.setPosition("Software Engineer");

        when(userRepository.existsByEmail("employee@smartleave.test")).thenReturn(false);
        when(passwordEncoder.encode("Employee123!")).thenReturn("encoded-password");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User saved = invocation.getArgument(0);
            saved.setId(42L);
            return saved;
        });

        AuthResponse response = authService.register(request);

        assertThat(response.getToken()).isEqualTo("signed-token");
        assertThat(response.getRole()).isEqualTo(Role.ROLE_EMPLOYEE);
        assertThat(response.getLeaveBalance()).isEqualTo(12);
        assertThat(response.getEmail()).isEqualTo("employee@smartleave.test");
    }

    @Test
    void authenticateReturnsTokenForValidCredentials() {
        AuthRequest request = new AuthRequest();
        request.setEmail("admin@smartleave.test");
        request.setPassword("Admin123!");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(new UsernamePasswordAuthenticationToken("admin@smartleave.test", "Admin123!"));
        when(userRepository.findByEmail("admin@smartleave.test")).thenReturn(Optional.of(User.builder()
                .id(1L)
                .name("Admin User")
                .email("admin@smartleave.test")
                .password("encoded")
                .role(Role.ROLE_ADMIN)
                .leaveBalance(0)
                .department("Operations")
                .position("Administrator")
                .active(true)
                .build()));

        AuthResponse response = authService.authenticate(request);

        assertThat(response.getToken()).isEqualTo("signed-token");
        assertThat(response.getRole()).isEqualTo(Role.ROLE_ADMIN);
        assertThat(response.getName()).isEqualTo("Admin User");
    }
}