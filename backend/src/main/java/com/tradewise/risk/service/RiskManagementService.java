package com.tradewise.risk.service;

import com.tradewise.risk.dto.RiskRewardRequest;
import com.tradewise.risk.dto.RiskRewardResponse;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class RiskManagementService {

    public RiskRewardResponse calculate(RiskRewardRequest request) {

        if (request.getEntryPrice() == null ||
                request.getStopLoss() == null ||
                request.getTargetPrice() == null ||
                request.getQuantity() == null) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Entry price, stop loss, target price and quantity are required"
            );
        }

        if (request.getEntryPrice().compareTo(BigDecimal.ZERO) <= 0 ||
                request.getStopLoss().compareTo(BigDecimal.ZERO) <= 0 ||
                request.getTargetPrice().compareTo(BigDecimal.ZERO) <= 0) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Prices must be greater than zero"
            );
        }

        if (request.getQuantity() <= 0) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Quantity must be greater than zero"
            );
        }

        BigDecimal entryPrice = request.getEntryPrice();
        BigDecimal stopLoss = request.getStopLoss();
        BigDecimal targetPrice = request.getTargetPrice();

        // Current calculator supports BUY / LONG trades.
        if (stopLoss.compareTo(entryPrice) >= 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "For a BUY trade, stop loss must be below entry price"
            );
        }

        if (targetPrice.compareTo(entryPrice) <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "For a BUY trade, target price must be above entry price"
            );
        }

        BigDecimal riskPerShare =
                entryPrice
                        .subtract(stopLoss)
                        .setScale(4, RoundingMode.HALF_UP);

        BigDecimal rewardPerShare =
                targetPrice
                        .subtract(entryPrice)
                        .setScale(4, RoundingMode.HALF_UP);

        BigDecimal quantity =
                BigDecimal.valueOf(request.getQuantity());

        BigDecimal totalRisk =
                riskPerShare
                        .multiply(quantity)
                        .setScale(2, RoundingMode.HALF_UP);

        BigDecimal totalReward =
                rewardPerShare
                        .multiply(quantity)
                        .setScale(2, RoundingMode.HALF_UP);

        BigDecimal riskRewardRatio =
                rewardPerShare.divide(
                        riskPerShare,
                        2,
                        RoundingMode.HALF_UP
                );

        return new RiskRewardResponse(
                entryPrice,
                stopLoss,
                targetPrice,
                request.getQuantity(),
                riskPerShare,
                rewardPerShare,
                totalRisk,
                totalReward,
                riskRewardRatio
        );
    }
}