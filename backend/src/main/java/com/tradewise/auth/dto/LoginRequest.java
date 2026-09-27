package com.tradewise.auth.dto;

public class LoginRequest {

    private String email;
    private String password;
    private String turnstileToken;

    public LoginRequest() {
    }

    public LoginRequest(String email, String password, String turnstileToken) {
        this.email = email;
        this.password = password;
        this.turnstileToken = turnstileToken;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getTurnstileToken() {
        return turnstileToken;
    }

    public void setTurnstileToken(String turnstileToken) {
        this.turnstileToken = turnstileToken;
    }
}