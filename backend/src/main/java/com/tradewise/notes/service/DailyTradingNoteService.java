package com.tradewise.notes.service;

import com.tradewise.auth.entity.User;
import com.tradewise.auth.repository.UserRepository;
import com.tradewise.notes.dto.DailyTradingNoteRequest;
import com.tradewise.notes.dto.DailyTradingNoteResponse;
import com.tradewise.notes.entity.DailyTradingNote;
import com.tradewise.notes.repository.DailyTradingNoteRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class DailyTradingNoteService {

    private final DailyTradingNoteRepository noteRepository;
    private final UserRepository userRepository;

    public DailyTradingNoteService(
            DailyTradingNoteRepository noteRepository,
            UserRepository userRepository
    ) {
        this.noteRepository = noteRepository;
        this.userRepository = userRepository;
    }

    public DailyTradingNoteResponse create(
            String email,
            DailyTradingNoteRequest request
    ) {

        User user =
                userRepository.findByEmailIgnoreCase(email)
                        .orElseThrow(() -> new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "User not found"
                        ));

        DailyTradingNote note =
                new DailyTradingNote(
                        user,
                        request.getNoteDate(),
                        request.getContent()
                );

        return DailyTradingNoteResponse.from(
                noteRepository.save(note)
        );
    }

    public List<DailyTradingNoteResponse> getAll(
            String email
    ) {

        User user =
                userRepository.findByEmailIgnoreCase(email)
                        .orElseThrow(() -> new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "User not found"
                        ));

        return noteRepository
                .findByUserIdOrderByNoteDateDesc(user.getId())
                .stream()
                .map(DailyTradingNoteResponse::from)
                .toList();
    }
}