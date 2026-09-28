package com.tradewise.instrument.controller;

import com.tradewise.instrument.dto.InstrumentResponse;
import com.tradewise.instrument.service.InstrumentService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/instruments")
public class InstrumentController {

    private final InstrumentService instrumentService;

    public InstrumentController(
            InstrumentService instrumentService
    ) {
        this.instrumentService = instrumentService;
    }

    /**
     * Get all active instruments.
     *
     * GET /api/instruments
     */
    @GetMapping
    public ResponseEntity<List<InstrumentResponse>> getActiveInstruments() {

        return ResponseEntity.ok(
                instrumentService.getActiveInstruments()
        );
    }

    /**
     * Get an instrument by symbol and exchange.
     *
     * GET /api/instruments/{symbol}?exchange=NSE
     */
    @GetMapping("/{symbol}")
    public ResponseEntity<InstrumentResponse> getInstrument(
            @PathVariable String symbol,
            @RequestParam(defaultValue = "NSE") String exchange
    ) {

        return ResponseEntity.ok(
                instrumentService.getInstrument(
                        symbol,
                        exchange
                )
        );
    }
}