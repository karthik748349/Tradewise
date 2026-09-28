package com.tradewise.market.service;

import com.tradewise.market.dto.MarketPriceResponse;
import com.tradewise.market.entity.MarketPrice;
import com.tradewise.market.repository.MarketPriceRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class MarketPriceService {

    private final MarketPriceRepository marketPriceRepository;

    public MarketPriceService(
            MarketPriceRepository marketPriceRepository
    ) {
        this.marketPriceRepository = marketPriceRepository;
    }

    @Transactional(readOnly = true)
    public MarketPriceResponse getLatestPrice(Long instrumentId) {

        MarketPrice marketPrice =
                marketPriceRepository
                        .findTopByInstrumentIdOrderByPriceTimeDesc(
                                instrumentId
                        )
                        .orElseThrow(
                                () -> new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Market price not found"
                                )
                        );

        return MarketPriceResponse.from(marketPrice);
    }

    @Transactional(readOnly = true)
    public List<MarketPriceResponse> getPriceHistory(
            Long instrumentId
    ) {

        return marketPriceRepository
                .findByInstrumentIdOrderByPriceTimeDesc(
                        instrumentId
                )
                .stream()
                .map(MarketPriceResponse::from)
                .toList();
    }
}