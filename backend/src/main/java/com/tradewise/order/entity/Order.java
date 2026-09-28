package com.tradewise.order.entity;

import com.tradewise.auth.entity.User;
import com.tradewise.instrument.entity.Instrument;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "trade_orders",
        indexes = {
                @Index(
                        name = "idx_order_user",
                        columnList = "user_id"
                ),
                @Index(
                        name = "idx_order_instrument",
                        columnList = "instrument_id"
                )
        }
)
public class Order {

    public enum OrderType {
        BUY,
        SELL
    }

    public enum OrderStatus {
        FILLED,
        CANCELLED
    }

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

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private OrderType orderType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 15)
    private OrderStatus status;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal executionPrice;

    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal totalAmount;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    public Order() {
    }

    public Order(
            User user,
            Instrument instrument,
            OrderType orderType,
            Integer quantity,
            BigDecimal executionPrice,
            BigDecimal totalAmount
    ) {
        this.user = user;
        this.instrument = instrument;
        this.orderType = orderType;
        this.status = OrderStatus.FILLED;
        this.quantity = quantity;
        this.executionPrice = executionPrice;
        this.totalAmount = totalAmount;
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

    public OrderType getOrderType() {
        return orderType;
    }

    public OrderStatus getStatus() {
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setInstrument(Instrument instrument) {
        this.instrument = instrument;
    }

    public void setOrderType(OrderType orderType) {
        this.orderType = orderType;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public void setExecutionPrice(BigDecimal executionPrice) {
        this.executionPrice = executionPrice;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }
}