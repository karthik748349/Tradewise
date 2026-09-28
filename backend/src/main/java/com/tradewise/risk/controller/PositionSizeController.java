package com.tradewise.risk.controller;

import com.tradewise.risk.dto.PositionSizeRequest;
import com.tradewise.risk.dto.PositionSizeResponse;
import com.tradewise.risk.service.PositionSizeService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/risk/position-size")
public class PositionSizeController {

    private final PositionSizeService positionSizeService;

    public PositionSizeController(
            PositionSizeService positionSizeService
    ) {
        this.positionSizeService = positionSizeService;
    }

    @PostMapping("/calculate")
    public ResponseEntity<PositionSizeResponse> calculate(
            @RequestBody PositionSizeRequest request
    ) {
        return ResponseEntity.ok(
                positionSizeService.calculate(request)
        );
    }
}