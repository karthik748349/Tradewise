package com.tradewise.instrument.dto;

import com.tradewise.instrument.entity.Instrument;

import java.math.BigDecimal;

public class InstrumentResponse {

    private Long id;
    private String symbol;
    private String companyName;
    private String exchange;
    private BigDecimal currentPrice;
    private boolean active;

    public InstrumentResponse() {
    }

    public InstrumentResponse(
            Long id,
            String symbol,
            String companyName,
            String exchange,
            BigDecimal currentPrice,
            boolean active
    ) {
        this.id = id;
        this.symbol = symbol;
        this.companyName = companyName;
        this.exchange = exchange;
        this.currentPrice = currentPrice;
        this.active = active;
    }

    public static InstrumentResponse from(
            Instrument instrument
    ) {
        return new InstrumentResponse(
                instrument.getId(),
                instrument.getSymbol(),
                instrument.getCompanyName(),
                instrument.getExchange(),
                instrument.getCurrentPrice(),
                instrument.isActive()
        );
    }

    public Long getId() {
        return id;
    }

    public String getSymbol() {
        return symbol;
    }

    public String getCompanyName() {
        return companyName;
    }

    public String getExchange() {
        return exchange;
    }

    public BigDecimal getCurrentPrice() {
        return currentPrice;
    }

    public boolean isActive() {
        return active;
    }
}