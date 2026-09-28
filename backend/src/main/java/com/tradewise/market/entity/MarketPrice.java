package com.tradewise.market.entity;

import com.tradewise.instrument.entity.Instrument;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "market_prices",
        indexes = {
                @Index(
                        name = "idx_market_price_instrument_time",
                        columnList = "instrument_id, price_time"
                )
        }
)
public class MarketPrice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "instrument_id",
            nullable = false
    )
    private Instrument instrument;

    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal openPrice;

    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal highPrice;

    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal lowPrice;

    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal closePrice;

    @Column(nullable = false)
    private Long volume;

    @Column(nullable = false)
    private LocalDateTime priceTime;

    public MarketPrice() {
    }

    public MarketPrice(
            Instrument instrument,
            BigDecimal openPrice,
            BigDecimal highPrice,
            BigDecimal lowPrice,
            BigDecimal closePrice,
            Long volume,
            LocalDateTime priceTime
    ) {
        this.instrument = instrument;
        this.openPrice = openPrice;
        this.highPrice = highPrice;
        this.lowPrice = lowPrice;
        this.closePrice = closePrice;
        this.volume = volume;
        this.priceTime = priceTime;
    }

    public Long getId() {
        return id;
    }

    public Instrument getInstrument() {
        return instrument;
    }

    public BigDecimal getOpenPrice() {
        return openPrice;
    }

    public BigDecimal getHighPrice() {
        return highPrice;
    }

    public BigDecimal getLowPrice() {
        return lowPrice;
    }

    public BigDecimal getClosePrice() {
        return closePrice;
    }

    public Long getVolume() {
        return volume;
    }

    public LocalDateTime getPriceTime() {
        return priceTime;
    }

    public void setInstrument(Instrument instrument) {
        this.instrument = instrument;
    }

    public void setOpenPrice(BigDecimal openPrice) {
        this.openPrice = openPrice;
    }

    public void setHighPrice(BigDecimal highPrice) {
        this.highPrice = highPrice;
    }

    public void setLowPrice(BigDecimal lowPrice) {
        this.lowPrice = lowPrice;
    }

    public void setClosePrice(BigDecimal closePrice) {
        this.closePrice = closePrice;
    }

    public void setVolume(Long volume) {
        this.volume = volume;
    }

    public void setPriceTime(LocalDateTime priceTime) {
        this.priceTime = priceTime;
    }
}