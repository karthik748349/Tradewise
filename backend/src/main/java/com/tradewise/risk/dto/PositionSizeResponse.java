package com.tradewise.risk.dto;

import java.math.BigDecimal;

public class PositionSizeResponse {

    private BigDecimal maximumRiskAmount;
    private BigDecimal riskPerShare;
    private Integer quantity;

    public PositionSizeResponse(
            BigDecimal maximumRiskAmount,
            BigDecimal riskPerShare,
            Integer quantity
    ) {
        this.maximumRiskAmount = maximumRiskAmount;
        this.riskPerShare = riskPerShare;
        this.quantity = quantity;
    }

    public BigDecimal getMaximumRiskAmount() {
        return maximumRiskAmount;
    }

    public BigDecimal getRiskPerShare() {
        return riskPerShare;
    }

    public Integer getQuantity() {
        return quantity;
    }
}