package com.tradewise.journal.controller;

import com.tradewise.journal.dto.TradeJournalRequest;
import com.tradewise.journal.dto.TradeJournalResponse;
import com.tradewise.journal.service.TradeJournalService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/journal")
public class TradeJournalController {

    private final TradeJournalService journalService;

    public TradeJournalController(
            TradeJournalService journalService
    ) {
        this.journalService = journalService;
    }

    @PostMapping
    public ResponseEntity<TradeJournalResponse> create(
            Principal principal,
            @RequestBody TradeJournalRequest request
    ) {
        return ResponseEntity.ok(
                journalService.create(
                        principal.getName(),
                        request
                )
        );
    }

    @GetMapping
    public ResponseEntity<List<TradeJournalResponse>> getAll(
            Principal principal
    ) {
        return ResponseEntity.ok(
                journalService.getAll(
                        principal.getName()
                )
        );
    }
}