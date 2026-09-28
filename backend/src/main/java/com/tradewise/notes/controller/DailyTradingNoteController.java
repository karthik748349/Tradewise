package com.tradewise.notes.controller;

import com.tradewise.notes.dto.DailyTradingNoteRequest;
import com.tradewise.notes.dto.DailyTradingNoteResponse;
import com.tradewise.notes.service.DailyTradingNoteService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/notes")
public class DailyTradingNoteController {

    private final DailyTradingNoteService noteService;

    public DailyTradingNoteController(
            DailyTradingNoteService noteService
    ) {
        this.noteService = noteService;
    }

    @PostMapping
    public ResponseEntity<DailyTradingNoteResponse> create(
            Principal principal,
            @RequestBody DailyTradingNoteRequest request
    ) {
        return ResponseEntity.ok(
                noteService.create(
                        principal.getName(),
                        request
                )
        );
    }

    @GetMapping
    public ResponseEntity<List<DailyTradingNoteResponse>> getAll(
            Principal principal
    ) {
        return ResponseEntity.ok(
                noteService.getAll(
                        principal.getName()
                )
        );
    }
}