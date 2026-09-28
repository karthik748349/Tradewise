package com.tradewise.journal.dto;

import java.math.BigDecimal;

public class TradeJournalRequest {

    private Long instrumentId;
    private String reason;
    private String strategyTag;
    private String notes;
    private BigDecimal entryPrice;
    private BigDecimal stopLoss;
    private BigDecimal targetPrice;
    private String screenshotUrl;

    public TradeJournalRequest() {
    }

    public Long getInstrumentId() {
        return instrumentId;
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

    public void setInstrumentId(Long instrumentId) {
        this.instrumentId = instrumentId;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public void setStrategyTag(String strategyTag) {
        this.strategyTag = strategyTag;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public void setEntryPrice(BigDecimal entryPrice) {
        this.entryPrice = entryPrice;
    }

    public void setStopLoss(BigDecimal stopLoss) {
        this.stopLoss = stopLoss;
    }

    public void setTargetPrice(BigDecimal targetPrice) {
        this.targetPrice = targetPrice;
    }

    public void setScreenshotUrl(String screenshotUrl) {
        this.screenshotUrl = screenshotUrl;
    }
}