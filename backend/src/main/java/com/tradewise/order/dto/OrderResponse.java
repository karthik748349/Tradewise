package com.tradewise.order.dto;

import com.tradewise.order.entity.Order;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class OrderResponse {

    private Long id;
    private String symbol;
    private String companyName;
    private String exchange;

    private String orderType;
    private String status;

    private Integer quantity;

    private BigDecimal executionPrice;
    private BigDecimal totalAmount;

    private BigDecimal stopLoss;
    private BigDecimal targetPrice;

    private LocalDateTime createdAt;

    public OrderResponse() {
    }

    public OrderResponse(
            Long id,
            String symbol,
            String companyName,
            String exchange,
            String orderType,
            String status,
            Integer quantity,
            BigDecimal executionPrice,
            BigDecimal totalAmount,
            BigDecimal stopLoss,
            BigDecimal targetPrice,
            LocalDateTime createdAt
    ) {
        this.id = id;
        this.symbol = symbol;
        this.companyName = companyName;
        this.exchange = exchange;
        this.orderType = orderType;
        this.status = status;
        this.quantity = quantity;
        this.executionPrice = executionPrice;
        this.totalAmount = totalAmount;
        this.stopLoss = stopLoss;
        this.targetPrice = targetPrice;
        this.createdAt = createdAt;
    }

    public static OrderResponse from(Order order) {

        return new OrderResponse(
                order.getId(),
                order.getInstrument().getSymbol(),
                order.getInstrument().getCompanyName(),
                order.getInstrument().getExchange(),
                order.getOrderType().name(),
                order.getStatus().name(),
                order.getQuantity(),
                order.getExecutionPrice(),
                order.getTotalAmount(),
                order.getStopLoss(),
                order.getTargetPrice(),
                order.getCreatedAt()
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

    public String getOrderType() {
        return orderType;
    }

    public String getStatus() {
        return status;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public BigDecimal getExecutionPrice() {
        return executionPrice;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public BigDecimal getStopLoss() {
        return stopLoss;
    }

    public BigDecimal getTargetPrice() {
        return targetPrice;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}