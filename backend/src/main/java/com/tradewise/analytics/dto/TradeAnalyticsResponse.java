package com.tradewise.analytics.dto;

import java.math.BigDecimal;

public class TradeAnalyticsResponse {

    private long totalOrders;
    private long buyOrders;
    private long sellOrders;
    private BigDecimal totalBuyValue;
    private BigDecimal totalSellValue;
    private BigDecimal realizedPnl;

    public TradeAnalyticsResponse(
            long totalOrders,
            long buyOrders,
            long sellOrders,
            BigDecimal totalBuyValue,
            BigDecimal totalSellValue,
            BigDecimal realizedPnl
    ) {
        this.totalOrders = totalOrders;
        this.buyOrders = buyOrders;
        this.sellOrders = sellOrders;
        this.totalBuyValue = totalBuyValue;
        this.totalSellValue = totalSellValue;
        this.realizedPnl = realizedPnl;
    }

    public long getTotalOrders() {
        return totalOrders;
    }

    public long getBuyOrders() {
        return buyOrders;
    }

    public long getSellOrders() {
        return sellOrders;
    }

    public BigDecimal getTotalBuyValue() {
        return totalBuyValue;
    }

    public BigDecimal getTotalSellValue() {
        return totalSellValue;
    }

    public BigDecimal getRealizedPnl() {
        return realizedPnl;
    }
}