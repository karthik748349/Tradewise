package com.tradewise.instrument.service;

import com.tradewise.instrument.entity.Instrument;
import com.tradewise.instrument.repository.InstrumentRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class InstrumentDataSeeder implements CommandLineRunner {

    private final InstrumentRepository instrumentRepository;

    public InstrumentDataSeeder(
            InstrumentRepository instrumentRepository
    ) {
        this.instrumentRepository = instrumentRepository;
    }

    @Override
    public void run(String... args) {

        List<InstrumentSeed> instruments = List.of(

                new InstrumentSeed(
                        "RELIANCE",
                        "Reliance Industries",
                        "NSE",
                        "1412.80"
                ),

                new InstrumentSeed(
                        "TCS",
                        "Tata Consultancy Services",
                        "NSE",
                        "3184.40"
                ),

                new InstrumentSeed(
                        "INFY",
                        "Infosys",
                        "NSE",
                        "1542.10"
                ),

                new InstrumentSeed(
                        "HDFCBANK",
                        "HDFC Bank",
                        "NSE",
                        "1009.35"
                ),

                new InstrumentSeed(
                        "ICICIBANK",
                        "ICICI Bank",
                        "NSE",
                        "1285.60"
                ),

                new InstrumentSeed(
                        "SBIN",
                        "State Bank of India",
                        "NSE",
                        "812.25"
                ),

                new InstrumentSeed(
                        "ITC",
                        "ITC Limited",
                        "NSE",
                        "412.75"
                ),

                new InstrumentSeed(
                        "BHARTIARTL",
                        "Bharti Airtel",
                        "NSE",
                        "1948.30"
                )
        );

        for (InstrumentSeed seed : instruments) {

            boolean exists =
                    instrumentRepository
                            .existsBySymbolIgnoreCaseAndExchange(
                                    seed.symbol(),
                                    seed.exchange()
                            );

            if (!exists) {

                Instrument instrument =
                        new Instrument(
                                seed.symbol(),
                                seed.companyName(),
                                seed.exchange(),
                                new BigDecimal(seed.price())
                        );

                instrumentRepository.save(instrument);
            }
        }
    }

    private record InstrumentSeed(
            String symbol,
            String companyName,
            String exchange,
            String price
    ) {
    }
}