package com.tradewise.journal.repository;

import com.tradewise.journal.entity.TradeJournal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TradeJournalRepository
        extends JpaRepository<TradeJournal, Long> {

    List<TradeJournal> findByUserIdOrderByCreatedAtDesc(
            Long userId
    );
}