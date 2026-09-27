package com.tradewise.auth.service;

import com.tradewise.auth.dto.*;
import com.tradewise.auth.entity.*;
import com.tradewise.auth.repository.UserRepository;
import com.tradewise.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {
    private final UserRepository users; private final PasswordEncoder encoder; private final JwtService jwt;

    public AuthService(UserRepository users, PasswordEncoder encoder, JwtService jwt){
        this.users=users; this.encoder=encoder; this.jwt=jwt;
    }

    public AuthResponse register(RegisterRequest r){
        String email=r.email().trim().toLowerCase();
        if(users.existsByEmailIgnoreCase(email))
            throw new ResponseStatusException(HttpStatus.CONFLICT,"Email is already registered");
        User u=new User(); u.setName(r.name().trim()); u.setEmail(email);
        u.setPassword(encoder.encode(r.password())); u.setRole(Role.USER);
        u=users.save(u);
        return new AuthResponse(jwt.generateToken(u),UserResponse.from(u));
    }

    public AuthResponse login(LoginRequest r){
        String email=r.email().trim().toLowerCase();
        User u=users.findByEmailIgnoreCase(email).orElseThrow(
            ()->new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Invalid email or password"));
        if(!encoder.matches(r.password(),u.getPassword()))
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Invalid email or password");
        return new AuthResponse(jwt.generateToken(u),UserResponse.from(u));
    }

    public UserResponse me(String email){
        User u=users.findByEmailIgnoreCase(email).orElseThrow(
            ()->new ResponseStatusException(HttpStatus.NOT_FOUND,"User not found"));
        return UserResponse.from(u);
    }
}
