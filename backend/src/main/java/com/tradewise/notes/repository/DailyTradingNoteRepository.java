package com.tradewise.notes.repository;

import com.tradewise.notes.entity.DailyTradingNote;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DailyTradingNoteRepository
        extends JpaRepository<DailyTradingNote, Long> {

    List<DailyTradingNote> findByUserIdOrderByNoteDateDesc(
            Long userId
    );
}