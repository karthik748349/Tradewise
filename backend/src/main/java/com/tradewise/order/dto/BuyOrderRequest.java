package com.tradewise.order.dto;

public class BuyOrderRequest {

    private Long instrumentId;
    private Integer quantity;

    public BuyOrderRequest() {
    }

    public Long getInstrumentId() {
        return instrumentId;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setInstrumentId(Long instrumentId) {
        this.instrumentId = instrumentId;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}