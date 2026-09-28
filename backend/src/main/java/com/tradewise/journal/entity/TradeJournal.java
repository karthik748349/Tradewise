package com.tradewise.journal.entity;

import com.tradewise.auth.entity.User;
import com.tradewise.instrument.entity.Instrument;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "trade_journals")
public class TradeJournal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Instrument instrument;

    @Column(nullable = false, length = 1000)
    private String reason;

    @Column(length = 100)
    private String strategyTag;

    @Column(length = 2000)
    private String notes;

    @Column
    private BigDecimal entryPrice;

    @Column
    private BigDecimal stopLoss;

    @Column
    private BigDecimal targetPrice;

    @Column(length = 500)
    private String screenshotUrl;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    public TradeJournal() {
    }

    public TradeJournal(
            User user,
            Instrument instrument,
            String reason,
            String strategyTag,
            String notes,
            BigDecimal entryPrice,
            BigDecimal stopLoss,
            BigDecimal targetPrice,
            String screenshotUrl
    ) {
        this.user = user;
        this.instrument = instrument;
        this.reason = reason;
        this.strategyTag = strategyTag;
        this.notes = notes;
        this.entryPrice = entryPrice;
        this.stopLoss = stopLoss;
        this.targetPrice = targetPrice;
        this.screenshotUrl = screenshotUrl;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public Instrument getInstrument() {
        return instrument;
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