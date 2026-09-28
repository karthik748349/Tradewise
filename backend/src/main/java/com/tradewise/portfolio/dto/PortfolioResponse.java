package com.tradewise.portfolio.dto;

import com.tradewise.portfolio.entity.Portfolio;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PortfolioResponse {

    private Long id;
    private BigDecimal initialCapital;
    private BigDecimal availableCash;
    private BigDecimal investedAmount;
    private BigDecimal portfolioValue;
    private LocalDateTime createdAt;

    public PortfolioResponse() {
    }

    public PortfolioResponse(
            Long id,
            BigDecimal initialCapital,
            BigDecimal availableCash,
            BigDecimal investedAmount,
            BigDecimal portfolioValue,
            LocalDateTime createdAt
    ) {
        this.id = id;
        this.initialCapital = initialCapital;
        this.availableCash = availableCash;
        this.investedAmount = investedAmount;
        this.portfolioValue = portfolioValue;
        this.createdAt = createdAt;
    }

    public static PortfolioResponse from(Portfolio portfolio) {

        BigDecimal portfolioValue =
                portfolio.getAvailableCash()
                        .add(portfolio.getInvestedAmount());

        return new PortfolioResponse(
                portfolio.getId(),
                portfolio.getInitialCapital(),
                portfolio.getAvailableCash(),
                portfolio.getInvestedAmount(),
                portfolioValue,
                portfolio.getCreatedAt()
        );
    }

    public Long getId() {
        return id;
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

    public BigDecimal getPortfolioValue() {
        return portfolioValue;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}