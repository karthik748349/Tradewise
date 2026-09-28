package com.tradewise.portfolio.entity;

import com.tradewise.auth.entity.User;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "portfolios",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "user_id")
        }
)
public class Portfolio {

    private static final BigDecimal DEFAULT_INITIAL_CAPITAL =
            new BigDecimal("1000000.00");

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "user_id",
            nullable = false,
            unique = true
    )
    private User user;

    @Column(
            nullable = false,
            precision = 19,
            scale = 2
    )
    private BigDecimal initialCapital;

    @Column(
            nullable = false,
            precision = 19,
            scale = 2
    )
    private BigDecimal availableCash;

    @Column(
            nullable = false,
            precision = 19,
            scale = 2
    )
    private BigDecimal investedAmount;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

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

    public Portfolio() {
    }

    public Portfolio(User user) {

        this.user = user;

        this.initialCapital = DEFAULT_INITIAL_CAPITAL;
        this.availableCash = DEFAULT_INITIAL_CAPITAL;
        this.investedAmount = BigDecimal.ZERO;
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public BigDecimal getInitialCapital() {
        return initialCapital;
    }

    public BigDecimal getAvailableCash() {
        return availableCash;
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

    public void setInitialCapital(BigDecimal initialCapital) {
        this.initialCapital = initialCapital;
    }

    public void setAvailableCash(BigDecimal availableCash) {
        this.availableCash = availableCash;
    }

    public void setInvestedAmount(BigDecimal investedAmount) {
        this.investedAmount = investedAmount;
    }
}