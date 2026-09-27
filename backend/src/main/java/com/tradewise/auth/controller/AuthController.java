package com.tradewise.auth.controller;

import com.tradewise.auth.dto.*;
import com.tradewise.auth.service.AuthService;
import jakarta.validation.Valid;
import java.security.Principal;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthService auth;
    public AuthController(AuthService auth){this.auth=auth;}

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest r){
        return ResponseEntity.status(HttpStatus.CREATED).body(auth.register(r));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest r){
        return ResponseEntity.ok(auth.login(r));
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> me(Principal p){
        return ResponseEntity.ok(auth.me(p.getName()));
    }
}
