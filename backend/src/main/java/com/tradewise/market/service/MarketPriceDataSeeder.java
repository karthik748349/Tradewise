package com.tradewise.market.service;

import com.tradewise.instrument.entity.Instrument;
import com.tradewise.instrument.repository.InstrumentRepository;
import com.tradewise.market.entity.MarketPrice;
import com.tradewise.market.repository.MarketPriceRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;


@Component
public class MarketPriceDataSeeder implements CommandLineRunner {

    private final InstrumentRepository instrumentRepository;
    private final MarketPriceRepository marketPriceRepository;

    public MarketPriceDataSeeder(
            InstrumentRepository instrumentRepository,
            MarketPriceRepository marketPriceRepository
    ) {
        this.instrumentRepository = instrumentRepository;
        this.marketPriceRepository = marketPriceRepository;
    }

    @Override
    public void run(String... args) {

        seedPrice(
                "RELIANCE",
                "1410.00",
                "1420.00",
                "1405.00",
                "1412.80",
                1250000L
        );

        seedPrice(
                "TCS",
                "3175.00",
                "3195.00",
                "3160.00",
                "3184.40",
                850000L
        );

        seedPrice(
                "INFY",
                "1535.00",
                "1550.00",
                "1528.00",
                "1542.10",
                1100000L
        );

        seedPrice(
                "HDFCBANK",
                "1002.00",
                "1015.00",
                "998.00",
                "1009.35",
                1450000L
        );

        seedPrice(
                "ICICIBANK",
                "1278.00",
                "1292.00",
                "1270.00",
                "1285.60",
                1350000L
        );

        seedPrice(
                "SBIN",
                "805.00",
                "818.00",
                "800.00",
                "812.25",
                1750000L
        );

        seedPrice(
                "ITC",
                "410.00",
                "416.00",
                "407.00",
                "412.75",
                2100000L
        );

        seedPrice(
                "BHARTIARTL",
                "1935.00",
                "1960.00",
                "1925.00",
                "1948.30",
                980000L
        );
    }

    private void seedPrice(
            String symbol,
            String open,
            String high,
            String low,
            String close,
            Long volume
    ) {

        Instrument instrument =
                instrumentRepository
                        .findBySymbolIgnoreCaseAndExchange(
                                symbol,
                                "NSE"
                        )
                        .orElse(null);

        if (instrument == null) {
            return;
        }

        boolean alreadyExists =
                marketPriceRepository
                        .findTopByInstrumentIdOrderByPriceTimeDesc(
                                instrument.getId()
                        )
                        .isPresent();

        if (alreadyExists) {
            return;
        }

        MarketPrice marketPrice =
                new MarketPrice(
                        instrument,
                        new BigDecimal(open),
                        new BigDecimal(high),
                        new BigDecimal(low),
                        new BigDecimal(close),
                        volume,
                        LocalDateTime.now()
                );

        marketPriceRepository.save(marketPrice);
    }
}