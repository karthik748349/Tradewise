package com.tradewise.risk.controller;

import com.tradewise.risk.dto.RiskRewardRequest;
import com.tradewise.risk.dto.RiskRewardResponse;
import com.tradewise.risk.service.RiskManagementService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/risk")
public class RiskManagementController {

    private final RiskManagementService riskManagementService;

    public RiskManagementController(
            RiskManagementService riskManagementService
    ) {
        this.riskManagementService = riskManagementService;
    }

    @PostMapping("/calculate")
    public ResponseEntity<RiskRewardResponse> calculate(
            @RequestBody RiskRewardRequest request
    ) {
        return ResponseEntity.ok(
                riskManagementService.calculate(request)
        );
    }
}