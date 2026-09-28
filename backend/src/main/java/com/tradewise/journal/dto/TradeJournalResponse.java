package com.tradewise.journal.dto;

import com.tradewise.journal.entity.TradeJournal;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class TradeJournalResponse {

    private Long id;
    private String symbol;
    private String reason;
    private String strategyTag;
    private String notes;
    private BigDecimal entryPrice;
    private BigDecimal stopLoss;
    private BigDecimal targetPrice;
    private String screenshotUrl;
    private LocalDateTime createdAt;

    public static TradeJournalResponse from(
            TradeJournal journal
    ) {

        TradeJournalResponse response =
                new TradeJournalResponse();

        response.id = journal.getId();
        response.symbol =
                journal.getInstrument().getSymbol();
        response.reason = journal.getReason();
        response.strategyTag =
                journal.getStrategyTag();
        response.notes = journal.getNotes();
        response.entryPrice =
                journal.getEntryPrice();
        response.stopLoss =
                journal.getStopLoss();
        response.targetPrice =
                journal.getTargetPrice();
        response.screenshotUrl =
                journal.getScreenshotUrl();
        response.createdAt =
                journal.getCreatedAt();

        return response;
    }

    public Long getId() {
        return id;
    }

    public String getSymbol() {
        return symbol;
    }

    public String getReason() {
        return reason;
    }

    public String getStrategyTag() {
        return strategyTag;
    }

    public String getNotes() {
        return notes;
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

    public String getScreenshotUrl() {
        return screenshotUrl;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}