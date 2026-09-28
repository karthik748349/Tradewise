package com.tradewise.notes.dto;

import java.time.LocalDate;

public class DailyTradingNoteRequest {

    private LocalDate noteDate;
    private String content;

    public DailyTradingNoteRequest() {
    }

    public LocalDate getNoteDate() {
        return noteDate;
    }

    public String getContent() {
        return content;
    }

    public void setNoteDate(LocalDate noteDate) {
        this.noteDate = noteDate;
    }

    public void setContent(String content) {
        this.content = content;
    }
}