package com.tradewise.calendar.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class TradingCalendarResponse {

    private LocalDate date;
    private Integer totalTrades;
    private Integer winningTrades;
    private Integer losingTrades;
    private BigDecimal dailyPnl;

    public TradingCalendarResponse() {
    }

    public TradingCalendarResponse(
            LocalDate date,
            Integer totalTrades,
            Integer winningTrades,
            Integer losingTrades,
            BigDecimal dailyPnl
    ) {
        this.date = date;
        this.totalTrades = totalTrades;
        this.winningTrades = winningTrades;
        this.losingTrades = losingTrades;
        this.dailyPnl = dailyPnl;
    }

    public LocalDate getDate() {
        return date;
    }

    public Integer getTotalTrades() {
        return totalTrades;
    }

    public Integer getWinningTrades() {
        return winningTrades;
    }

    public Integer getLosingTrades() {
        return losingTrades;
    }

    public BigDecimal getDailyPnl() {
        return dailyPnl;
    }
}