package com.tradewise.holding.dto;

import com.tradewise.holding.entity.Holding;

import java.math.BigDecimal;

public class HoldingResponse {

    private Long id;
    private String symbol;
    private String companyName;
    private String exchange;

    private Integer quantity;
    private BigDecimal averageBuyPrice;
    private BigDecimal investedAmount;

    private BigDecimal currentPrice;
    private BigDecimal currentValue;
    private BigDecimal unrealizedPnl;

    public HoldingResponse() {
    }

    public HoldingResponse(
            Long id,
            String symbol,
            String companyName,
            String exchange,
            Integer quantity,
            BigDecimal averageBuyPrice,
            BigDecimal investedAmount,
            BigDecimal currentPrice,
            BigDecimal currentValue,
            BigDecimal unrealizedPnl
    ) {
        this.id = id;
        this.symbol = symbol;
        this.companyName = companyName;
        this.exchange = exchange;
        this.quantity = quantity;
        this.averageBuyPrice = averageBuyPrice;
        this.investedAmount = investedAmount;
        this.currentPrice = currentPrice;
        this.currentValue = currentValue;
        this.unrealizedPnl = unrealizedPnl;
    }

    public static HoldingResponse from(
            Holding holding,
            BigDecimal currentPrice
    ) {
        BigDecimal currentValue =
                currentPrice.multiply(
                        BigDecimal.valueOf(holding.getQuantity())
                );

        BigDecimal unrealizedPnl =
                currentValue.subtract(
                        holding.getInvestedAmount()
                );

        return new HoldingResponse(
                holding.getId(),
                holding.getInstrument().getSymbol(),
                holding.getInstrument().getCompanyName(),
                holding.getInstrument().getExchange(),
                holding.getQuantity(),
                holding.getAverageBuyPrice(),
                holding.getInvestedAmount(),
                currentPrice,
                currentValue,
                unrealizedPnl
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

    public Integer getQuantity() {
        return quantity;
    }

    public BigDecimal getAverageBuyPrice() {
        return averageBuyPrice;
    }

    public BigDecimal getInvestedAmount() {
        return investedAmount;
    }

    public BigDecimal getCurrentPrice() {
        return currentPrice;
    }

    public BigDecimal getCurrentValue() {
        return currentValue;
    }

    public BigDecimal getUnrealizedPnl() {
        return unrealizedPnl;
    }
}