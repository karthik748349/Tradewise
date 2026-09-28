package com.tradewise.journal.service;

import com.tradewise.auth.entity.User;
import com.tradewise.auth.repository.UserRepository;
import com.tradewise.instrument.entity.Instrument;
import com.tradewise.instrument.repository.InstrumentRepository;
import com.tradewise.journal.dto.TradeJournalRequest;
import com.tradewise.journal.dto.TradeJournalResponse;
import com.tradewise.journal.entity.TradeJournal;
import com.tradewise.journal.repository.TradeJournalRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class TradeJournalService {

    private final TradeJournalRepository journalRepository;
    private final UserRepository userRepository;
    private final InstrumentRepository instrumentRepository;

    public TradeJournalService(
            TradeJournalRepository journalRepository,
            UserRepository userRepository,
            InstrumentRepository instrumentRepository
    ) {
        this.journalRepository = journalRepository;
        this.userRepository = userRepository;
        this.instrumentRepository = instrumentRepository;
    }

    @Transactional
    public TradeJournalResponse create(
            String email,
            TradeJournalRequest request
    ) {

        User user =
                userRepository.findByEmailIgnoreCase(email)
                        .orElseThrow(() -> new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "User not found"
                        ));

        Instrument instrument =
                instrumentRepository.findById(
                        request.getInstrumentId()
                ).orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Instrument not found"
                ));

        TradeJournal journal =
                new TradeJournal(
                        user,
                        instrument,
                        request.getReason(),
                        request.getStrategyTag(),
                        request.getNotes(),
                        request.getEntryPrice(),
                        request.getStopLoss(),
                        request.getTargetPrice(),
                        request.getScreenshotUrl()
                );

        return TradeJournalResponse.from(
                journalRepository.save(journal)
        );
    }

    @Transactional(readOnly = true)
    public List<TradeJournalResponse> getAll(
            String email
    ) {

        User user =
                userRepository.findByEmailIgnoreCase(email)
                        .orElseThrow(() -> new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "User not found"
                        ));

        return journalRepository
                .findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(TradeJournalResponse::from)
                .toList();
    }
}