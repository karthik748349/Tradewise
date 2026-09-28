package com.tradewise.analytics.controller;

import com.tradewise.analytics.dto.TradeAnalyticsResponse;
import com.tradewise.analytics.service.TradeAnalyticsService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/analytics")
public class TradeAnalyticsController {

    private final TradeAnalyticsService analyticsService;

    public TradeAnalyticsController(
            TradeAnalyticsService analyticsService
    ) {
        this.analyticsService = analyticsService;
    }

    @GetMapping
    public ResponseEntity<TradeAnalyticsResponse> getAnalytics(
            Principal principal
    ) {
        return ResponseEntity.ok(
                analyticsService.getAnalytics(
                        principal.getName()
                )
        );
    }
}