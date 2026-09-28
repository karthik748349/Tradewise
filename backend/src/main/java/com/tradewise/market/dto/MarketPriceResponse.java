package com.tradewise.market.dto;

import com.tradewise.market.entity.MarketPrice;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class MarketPriceResponse {

    private Long id;
    private String symbol;
    private String companyName;
    private String exchange;

    private BigDecimal openPrice;
    private BigDecimal highPrice;
    private BigDecimal lowPrice;
    private BigDecimal closePrice;

    private Long volume;
    private LocalDateTime priceTime;

    public MarketPriceResponse() {
    }

    public MarketPriceResponse(
            Long id,
            String symbol,
            String companyName,
            String exchange,
            BigDecimal openPrice,
            BigDecimal highPrice,
            BigDecimal lowPrice,
            BigDecimal closePrice,
            Long volume,
            LocalDateTime priceTime
    ) {
        this.id = id;
        this.symbol = symbol;
        this.companyName = companyName;
        this.exchange = exchange;
        this.openPrice = openPrice;
        this.highPrice = highPrice;
        this.lowPrice = lowPrice;
        this.closePrice = closePrice;
        this.volume = volume;
        this.priceTime = priceTime;
    }

    public static MarketPriceResponse from(
            MarketPrice marketPrice
    ) {

        return new MarketPriceResponse(
                marketPrice.getId(),
                marketPrice.getInstrument().getSymbol(),
                marketPrice.getInstrument().getCompanyName(),
                marketPrice.getInstrument().getExchange(),
                marketPrice.getOpenPrice(),
                marketPrice.getHighPrice(),
                marketPrice.getLowPrice(),
                marketPrice.getClosePrice(),
                marketPrice.getVolume(),
                marketPrice.getPriceTime()
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

    public BigDecimal getOpenPrice() {
        return openPrice;
    }

    public BigDecimal getHighPrice() {
        return highPrice;
    }

    public BigDecimal getLowPrice() {
        return lowPrice;
    }

    public BigDecimal getClosePrice() {
        return closePrice;
    }

    public Long getVolume() {
        return volume;
    }

    public LocalDateTime getPriceTime() {
        return priceTime;
    }
}