package com.tradewise.instrument.service;

import com.tradewise.instrument.dto.InstrumentResponse;
import com.tradewise.instrument.entity.Instrument;
import com.tradewise.instrument.repository.InstrumentRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class InstrumentService {

    private final InstrumentRepository instrumentRepository;

    public InstrumentService(
            InstrumentRepository instrumentRepository
    ) {
        this.instrumentRepository = instrumentRepository;
    }

    /**
     * Get all active instruments.
     */
    public List<InstrumentResponse> getActiveInstruments() {

        return instrumentRepository
                .findByActiveTrueOrderBySymbolAsc()
                .stream()
                .map(InstrumentResponse::from)
                .toList();
    }

    /**
     * Get an instrument by symbol and exchange.
     */
    public InstrumentResponse getInstrument(
            String symbol,
            String exchange
    ) {

        Instrument instrument =
                instrumentRepository
                        .findBySymbolIgnoreCaseAndExchange(
                                symbol,
                                exchange
                        )
                        .orElseThrow(
                                () -> new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Instrument not found"
                                )
                        );

        return InstrumentResponse.from(instrument);
    }
}