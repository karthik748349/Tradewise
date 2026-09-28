package com.tradewise.risk.dto;

import java.math.BigDecimal;

public class PositionSizeRequest {

    private BigDecimal capital;
    private BigDecimal riskPercentage;
    private BigDecimal entryPrice;
    private BigDecimal stopLoss;

    public PositionSizeRequest() {
    }

    public BigDecimal getCapital() {
        return capital;
    }

    public BigDecimal getRiskPercentage() {
        return riskPercentage;
    }

    public BigDecimal getEntryPrice() {
        return entryPrice;
    }

    public BigDecimal getStopLoss() {
        return stopLoss;
    }

    public void setCapital(BigDecimal capital) {
        this.capital = capital;
    }

    public void setRiskPercentage(BigDecimal riskPercentage) {
        this.riskPercentage = riskPercentage;
    }

    public void setEntryPrice(BigDecimal entryPrice) {
        this.entryPrice = entryPrice;
    }

    public void setStopLoss(BigDecimal stopLoss) {
        this.stopLoss = stopLoss;
    }
}