package com.reserveiq.service;

import com.reserveiq.dto.AuthRequest;
import com.reserveiq.dto.AuthResponse;
import com.reserveiq.dto.RegisterRequest;
import com.reserveiq.entity.Role;
import com.reserveiq.entity.User;
import com.reserveiq.exception.BadRequestException;
import com.reserveiq.repository.UserRepository;
import com.reserveiq.security.CustomUserDetails;
import com.reserveiq.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Implementation of AuthService.
 * Implements constructor injection and strict business transaction rules.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @Override
    @Transactional
    public AuthResponse login(AuthRequest request) {
        log.info("Authenticating login request for email: {}", request.getEmail());
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        String token = jwtUtil.generateToken(userDetails);

        return AuthResponse.builder()
                .id(userDetails.getId())
                .fullName(userDetails.getFullName())
                .email(userDetails.getUsername())
                .role(userDetails.getRole())
                .phone(userRepository.findById(userDetails.getId()).map(User::getPhone).orElse(""))
                .token(token)
                .build();
    }

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        log.info("Registering new user with email: {}", request.getEmail());
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered in the platform");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.CUSTOMER) // Default role for open sign-ups
                .phone(request.getPhone() != null ? request.getPhone() : "")
                .build();

        User savedUser = userRepository.save(user);

        CustomUserDetails userDetails = CustomUserDetails.build(savedUser);
        String token = jwtUtil.generateToken(userDetails);

        return AuthResponse.builder()
                .id(savedUser.getId())
                .fullName(savedUser.getFullName())
                .email(savedUser.getEmail())
                .role(savedUser.getRole())
                .phone(savedUser.getPhone())
                .token(token)
                .build();
    }
}
