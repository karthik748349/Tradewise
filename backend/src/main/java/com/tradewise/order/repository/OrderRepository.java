package com.tradewise.order.repository;

import com.tradewise.order.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository
        extends JpaRepository<Order, Long> {

    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Order> findByUserIdOrderByCreatedAtAsc(Long userId);

    List<Order> findByUserIdAndInstrumentIdOrderByCreatedAtDesc(
            Long userId,
            Long instrumentId
    );
}