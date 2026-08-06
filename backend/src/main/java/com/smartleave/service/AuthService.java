package com.smartleave.service;

import com.smartleave.config.JwtService;
import com.smartleave.dto.AuthRequest;
import com.smartleave.dto.AuthResponse;
import com.smartleave.dto.RegisterRequest;
import com.smartleave.exception.BadRequestException;
import com.smartleave.model.Role;
import com.smartleave.model.User;
import com.smartleave.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail().toLowerCase())) {
            throw new BadRequestException("An account already exists for this email address");
        }

        User user = User.builder()
                .name(request.getName().trim())
                .email(request.getEmail().toLowerCase())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.ROLE_EMPLOYEE)
                .leaveBalance(12)
                .department(request.getDepartment().trim())
                .position(request.getPosition().trim())
                .phone(request.getPhone())
                .active(true)
                .build();

        userRepository.save(user);
        log.info("Registered new employee account for {}", user.getEmail());
        return toAuthResponse(user, jwtService.generateToken(userDetails(user)));
    }

    public AuthResponse authenticate(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().toLowerCase(), request.getPassword()));

        User user = userRepository.findByEmail(request.getEmail().toLowerCase())
                .orElseThrow(() -> new BadRequestException("Account not found"));

        return toAuthResponse(user, jwtService.generateToken(userDetails(user)));
    }

    private AuthResponse toAuthResponse(User user, String token) {
        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .leaveBalance(user.getLeaveBalance())
                .build();
    }

    private UserDetails userDetails(User user) {
        return org.springframework.security.core.userdetails.User.withUsername(user.getEmail())
                .password(user.getPassword())
                .authorities(user.getRole().name())
                .disabled(!user.isActive())
                .build();
    }
}