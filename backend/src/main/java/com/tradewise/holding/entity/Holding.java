package com.tradewise.holding.entity;

import com.tradewise.auth.entity.User;
import com.tradewise.instrument.entity.Instrument;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "holdings",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {"user_id", "instrument_id"}
                )
        },
        indexes = {
                @Index(
                        name = "idx_holding_user",
                        columnList = "user_id"
                ),
                @Index(
                        name = "idx_holding_instrument",
                        columnList = "instrument_id"
                )
        }
)
public class Holding {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "user_id",
            nullable = false
    )
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "instrument_id",
            nullable = false
    )
    private Instrument instrument;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal averageBuyPrice;

    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal investedAmount;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public Holding() {
    }

    public Holding(
            User user,
            Instrument instrument,
            Integer quantity,
            BigDecimal averageBuyPrice,
            BigDecimal investedAmount
    ) {
        this.user = user;
        this.instrument = instrument;
        this.quantity = quantity;
        this.averageBuyPrice = averageBuyPrice;
        this.investedAmount = investedAmount;
    }

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
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

    public Integer getQuantity() {
        return quantity;
    }

    public BigDecimal getAverageBuyPrice() {
        return averageBuyPrice;
    }

    public BigDecimal getInvestedAmount() {
        return investedAmount;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setInstrument(Instrument instrument) {
        this.instrument = instrument;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public void setAverageBuyPrice(
            BigDecimal averageBuyPrice
    ) {
        this.averageBuyPrice = averageBuyPrice;
    }

    public void setInvestedAmount(
            BigDecimal investedAmount
    ) {
        this.investedAmount = investedAmount;
    }
}