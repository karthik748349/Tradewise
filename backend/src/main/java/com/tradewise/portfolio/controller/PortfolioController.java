package com.tradewise.portfolio.controller;

import com.tradewise.portfolio.dto.PortfolioResponse;
import com.tradewise.portfolio.service.PortfolioService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/portfolio")
public class PortfolioController {

    private final PortfolioService portfolioService;

    public PortfolioController(
            PortfolioService portfolioService
    ) {
        this.portfolioService = portfolioService;
    }

    @GetMapping
    public ResponseEntity<PortfolioResponse> getPortfolio(
            Principal principal
    ) {

        return ResponseEntity.ok(
                portfolioService.getOrCreatePortfolio(
                        principal.getName()
                )
        );
    }
}