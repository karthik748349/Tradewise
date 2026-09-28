package com.tradewise.risk.dto;

import java.math.BigDecimal;

public class RiskRewardResponse {

    private BigDecimal entryPrice;
    private BigDecimal stopLoss;
    private BigDecimal targetPrice;
    private Integer quantity;

    private BigDecimal riskPerShare;
    private BigDecimal rewardPerShare;

    private BigDecimal totalRisk;
    private BigDecimal totalReward;

    private BigDecimal riskRewardRatio;

    public RiskRewardResponse() {
    }

    public RiskRewardResponse(
            BigDecimal entryPrice,
            BigDecimal stopLoss,
            BigDecimal targetPrice,
            Integer quantity,
            BigDecimal riskPerShare,
            BigDecimal rewardPerShare,
            BigDecimal totalRisk,
            BigDecimal totalReward,
            BigDecimal riskRewardRatio
    ) {
        this.entryPrice = entryPrice;
        this.stopLoss = stopLoss;
        this.targetPrice = targetPrice;
        this.quantity = quantity;
        this.riskPerShare = riskPerShare;
        this.rewardPerShare = rewardPerShare;
        this.totalRisk = totalRisk;
        this.totalReward = totalReward;
        this.riskRewardRatio = riskRewardRatio;
    }

    public BigDecimal getEntryPrice() {
        return entryPrice;
    }

    public BigDecimal getStopLoss() {
        return stopLoss;
    }

    public BigDecimal getTargetPrice() {
        return targetPrice;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public BigDecimal getRiskPerShare() {
        return riskPerShare;
    }

    public BigDecimal getRewardPerShare() {
        return rewardPerShare;
    }

    public BigDecimal getTotalRisk() {
        return totalRisk;
    }

    public BigDecimal getTotalReward() {
        return totalReward;
    }

    public BigDecimal getRiskRewardRatio() {
        return riskRewardRatio;
    }
}