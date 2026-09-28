package com.tradewise.instrument.repository;

import com.tradewise.instrument.entity.Instrument;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InstrumentRepository
        extends JpaRepository<Instrument, Long> {

    Optional<Instrument> findBySymbolIgnoreCaseAndExchange(
            String symbol,
            String exchange
    );

    List<Instrument> findByActiveTrueOrderBySymbolAsc();

    boolean existsBySymbolIgnoreCaseAndExchange(
            String symbol,
            String exchange
    );
}