package com.tradewise.holding.service;

import com.tradewise.auth.entity.User;
import com.tradewise.auth.repository.UserRepository;
import com.tradewise.holding.dto.HoldingResponse;

import com.tradewise.holding.repository.HoldingRepository;
import com.tradewise.market.entity.MarketPrice;
import com.tradewise.market.repository.MarketPriceRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class HoldingService {

    private final HoldingRepository holdingRepository;
    private final UserRepository userRepository;
    private final MarketPriceRepository marketPriceRepository;

    public HoldingService(
            HoldingRepository holdingRepository,
            UserRepository userRepository,
            MarketPriceRepository marketPriceRepository
    ) {
        this.holdingRepository = holdingRepository;
        this.userRepository = userRepository;
        this.marketPriceRepository = marketPriceRepository;
    }

    @Transactional(readOnly = true)
    public List<HoldingResponse> getHoldings(String email) {

        User user =
                userRepository
                        .findByEmailIgnoreCase(email)
                        .orElseThrow(
                                () -> new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "User not found"
                                )
                        );

        return holdingRepository
                .findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(holding -> {

                    MarketPrice marketPrice =
                            marketPriceRepository
                                    .findTopByInstrumentIdOrderByPriceTimeDesc(
                                            holding.getInstrument().getId()
                                    )
                                    .orElseThrow(
                                            () -> new ResponseStatusException(
                                                    HttpStatus.NOT_FOUND,
                                                    "Market price not available"
                                            )
                                    );

                    return HoldingResponse.from(
                            holding,
                            marketPrice.getClosePrice()
                    );
                })
                .toList();
    }
}