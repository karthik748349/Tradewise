package com.tradewise.holding.controller;

import com.tradewise.holding.dto.HoldingResponse;
import com.tradewise.holding.service.HoldingService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/holdings")
public class HoldingController {

    private final HoldingService holdingService;

    public HoldingController(
            HoldingService holdingService
    ) {
        this.holdingService = holdingService;
    }

    @GetMapping
    public ResponseEntity<List<HoldingResponse>> getHoldings(
            Principal principal
    ) {
        return ResponseEntity.ok(
                holdingService.getHoldings(
                        principal.getName()
                )
        );
    }
}