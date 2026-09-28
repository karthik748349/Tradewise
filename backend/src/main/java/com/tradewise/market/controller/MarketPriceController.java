package com.tradewise.market.controller;

import com.tradewise.market.dto.MarketPriceResponse;
import com.tradewise.market.service.MarketPriceService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/market-prices")
public class MarketPriceController {

    private final MarketPriceService marketPriceService;

    public MarketPriceController(
            MarketPriceService marketPriceService
    ) {
        this.marketPriceService = marketPriceService;
    }

    /**
     * Get the latest market price for an instrument.
     *
     * GET /api/market-prices/instrument/1/latest
     */
    @GetMapping("/instrument/{instrumentId}/latest")
    public ResponseEntity<MarketPriceResponse> getLatestPrice(
            @PathVariable Long instrumentId
    ) {

        return ResponseEntity.ok(
                marketPriceService.getLatestPrice(instrumentId)
        );
    }

    /**
     * Get market price history for an instrument.
     *
     * GET /api/market-prices/instrument/1/history
     */
    @GetMapping("/instrument/{instrumentId}/history")
    public ResponseEntity<List<MarketPriceResponse>> getPriceHistory(
            @PathVariable Long instrumentId
    ) {

        return ResponseEntity.ok(
                marketPriceService.getPriceHistory(instrumentId)
        );
    }
}