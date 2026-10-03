package com.tradewise.order.dto;

import java.math.BigDecimal;

public class BuyOrderRequest {

    private Long instrumentId;
    private Integer quantity;
    private BigDecimal stopLoss;
    private BigDecimal targetPrice;

    public BuyOrderRequest() {
    }

    public Long getInstrumentId() {
        return instrumentId;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public BigDecimal getStopLoss() {
        return stopLoss;
    }

    public BigDecimal getTargetPrice() {
        return targetPrice;
    }

    public void setInstrumentId(Long instrumentId) {
        this.instrumentId = instrumentId;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public void setStopLoss(BigDecimal stopLoss) {
        this.stopLoss = stopLoss;
    }

    public void setTargetPrice(BigDecimal targetPrice) {
        this.targetPrice = targetPrice;
    }
}