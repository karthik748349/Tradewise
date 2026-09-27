package com.tradewise.auth.service;

import com.tradewise.auth.dto.AuthResponse;
import com.tradewise.auth.dto.LoginRequest;
import com.tradewise.auth.dto.RegisterRequest;
import com.tradewise.auth.dto.UserResponse;
import com.tradewise.auth.entity.Role;
import com.tradewise.auth.entity.User;
import com.tradewise.auth.repository.UserRepository;
import com.tradewise.security.JwtService;
import com.tradewise.security.TurnstileService;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final JwtService jwt;
    private final TurnstileService turnstileService;

    public AuthService(
            UserRepository users,
            PasswordEncoder encoder,
            JwtService jwt,
            TurnstileService turnstileService
    ) {
        this.users = users;
        this.encoder = encoder;
        this.jwt = jwt;
        this.turnstileService = turnstileService;
    }

    // =========================================================
    // REGISTER
    // =========================================================

    public AuthResponse register(RegisterRequest r) {

        String email = r.email().trim().toLowerCase();

        if (users.existsByEmailIgnoreCase(email)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Email is already registered"
            );
        }

        User u = new User();

        u.setName(r.name().trim());
        u.setEmail(email);
        u.setPassword(encoder.encode(r.password()));
        u.setRole(Role.USER);

        u = users.save(u);

        return new AuthResponse(
                jwt.generateToken(u),
                UserResponse.from(u)
        );
    }

    // =========================================================
    // LOGIN
    // =========================================================

    public AuthResponse login(LoginRequest r) {

        // -----------------------------------------------------
        // 1. Check Turnstile token
        // -----------------------------------------------------

        if (r.getTurnstileToken() == null ||
                r.getTurnstileToken().isBlank()) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Please complete the security verification"
            );
        }

        // -----------------------------------------------------
        // 2. Verify Turnstile with Cloudflare
        // -----------------------------------------------------

        boolean turnstileValid =
                turnstileService.verify(
                        r.getTurnstileToken()
                );

        if (!turnstileValid) {

            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Security verification failed. Please try again."
            );
        }

        // -----------------------------------------------------
        // 3. Get email
        // -----------------------------------------------------

        String email = r.getEmail()
                .trim()
                .toLowerCase();

        // -----------------------------------------------------
        // 4. Find user
        // -----------------------------------------------------

        User u = users
                .findByEmailIgnoreCase(email)
                .orElseThrow(
                        () -> new ResponseStatusException(
                                HttpStatus.UNAUTHORIZED,
                                "Invalid email or password"
                        )
                );

        // -----------------------------------------------------
        // 5. Check password
        // -----------------------------------------------------

        if (!encoder.matches(
                r.getPassword(),
                u.getPassword()
        )) {

            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid email or password"
            );
        }

        // -----------------------------------------------------
        // 6. Generate JWT
        // -----------------------------------------------------

        return new AuthResponse(
                jwt.generateToken(u),
                UserResponse.from(u)
        );
    }

    // =========================================================
    // CURRENT USER
    // =========================================================

    public UserResponse me(String email) {

        User u = users
                .findByEmailIgnoreCase(email)
                .orElseThrow(
                        () -> new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "User not found"
                        )
                );

        return UserResponse.from(u);
    }
}