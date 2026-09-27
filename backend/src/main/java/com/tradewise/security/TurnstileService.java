package com.tradewise.security;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;

import java.util.List;

@Service
public class TurnstileService {

    private static final String VERIFY_URL =
            "https://challenges.cloudflare.com/turnstile/v0/siteverify";

    private final RestClient restClient;
    private final String secretKey;

    public TurnstileService(
            @Value("${turnstile.secret-key}") String secretKey
    ) {
        this.secretKey = secretKey;
        this.restClient = RestClient.create();
    }

    public boolean verify(String token) {

        if (token == null || token.isBlank()) {
            return false;
        }

        MultiValueMap<String, String> formData =
                new LinkedMultiValueMap<>();

        formData.add("secret", secretKey);
        formData.add("response", token);

        try {

            TurnstileResponse response =
                    restClient
                            .post()
                            .uri(VERIFY_URL)
                            .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                            .body(formData)
                            .retrieve()
                            .body(TurnstileResponse.class);

            return response != null && response.success();

        } catch (Exception e) {

            return false;
        }
    }

    private record TurnstileResponse(
            boolean success,

            @JsonProperty("challenge_ts")
            String challengeTs,

            String hostname,

            @JsonProperty("error-codes")
            List<String> errorCodes
    ) {
    }
}