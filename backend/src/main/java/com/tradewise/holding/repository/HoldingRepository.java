package com.tradewise.holding.repository;

import com.tradewise.holding.entity.Holding;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface HoldingRepository extends JpaRepository<Holding, Long> {

    Optional<Holding> findByUserIdAndInstrumentId(
            Long userId,
            Long instrumentId
    );

    List<Holding> findByUserIdOrderByCreatedAtDesc(
            Long userId
    );
}