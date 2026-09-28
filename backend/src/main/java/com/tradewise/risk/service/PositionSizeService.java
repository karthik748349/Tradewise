package com.tradewise.risk.service;

import com.tradewise.risk.dto.PositionSizeRequest;
import com.tradewise.risk.dto.PositionSizeResponse;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class PositionSizeService {

    public PositionSizeResponse calculate(PositionSizeRequest request) {

        if (request.getCapital() == null ||
                request.getRiskPercentage() == null ||
                request.getEntryPrice() == null ||
                request.getStopLoss() == null) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Capital, risk percentage, entry price and stop loss are required"
            );
        }

        if (request.getCapital().compareTo(BigDecimal.ZERO) <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Capital must be greater than zero"
            );
        }

        if (request.getRiskPercentage().compareTo(BigDecimal.ZERO) <= 0 ||
                request.getRiskPercentage().compareTo(BigDecimal.valueOf(100)) > 0) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Risk percentage must be greater than 0 and at most 100"
            );
        }

        if (request.getEntryPrice().compareTo(BigDecimal.ZERO) <= 0 ||
                request.getStopLoss().compareTo(BigDecimal.ZERO) <= 0) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Entry price and stop loss must be greater than zero"
            );
        }

        if (request.getStopLoss().compareTo(request.getEntryPrice()) >= 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "For a BUY trade, stop loss must be below entry price"
            );
        }

        BigDecimal maximumRiskAmount =
                request.getCapital()
                        .multiply(request.getRiskPercentage())
                        .divide(
                                BigDecimal.valueOf(100),
                                2,
                                RoundingMode.HALF_UP
                        );

        BigDecimal riskPerShare =
                request.getEntryPrice()
                        .subtract(request.getStopLoss())
                        .setScale(2, RoundingMode.HALF_UP);

        int quantity =
                maximumRiskAmount
                        .divide(
                                riskPerShare,
                                0,
                                RoundingMode.DOWN
                        )
                        .intValue();

        return new PositionSizeResponse(
                maximumRiskAmount,
                riskPerShare,
                quantity
        );
    }
}