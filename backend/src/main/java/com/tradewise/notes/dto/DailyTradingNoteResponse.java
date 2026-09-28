package com.tradewise.notes.dto;

import com.tradewise.notes.entity.DailyTradingNote;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class DailyTradingNoteResponse {

    private Long id;
    private LocalDate noteDate;
    private String content;
    private LocalDateTime createdAt;

    public static DailyTradingNoteResponse from(
            DailyTradingNote note
    ) {

        DailyTradingNoteResponse response =
                new DailyTradingNoteResponse();

        response.id = note.getId();
        response.noteDate = note.getNoteDate();
        response.content = note.getContent();
        response.createdAt = note.getCreatedAt();

        return response;
    }

    public Long getId() {
        return id;
    }

    public LocalDate getNoteDate() {
        return noteDate;
    }

    public String getContent() {
        return content;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}