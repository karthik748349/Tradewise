package com.tradewise.analytics.service;

import com.tradewise.analytics.dto.TradeAnalyticsResponse;
import com.tradewise.auth.entity.User;
import com.tradewise.auth.repository.UserRepository;
import com.tradewise.order.entity.Order;
import com.tradewise.order.repository.OrderRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class TradeAnalyticsService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    public TradeAnalyticsService(
            UserRepository userRepository,
            OrderRepository orderRepository
    ) {
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
    }

    public TradeAnalyticsResponse getAnalytics(
            String email
    ) {

        User user =
                userRepository.findByEmailIgnoreCase(email)
                        .orElseThrow(() -> new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "User not found"
                        ));

        List<Order> orders =
                orderRepository.findByUserIdOrderByCreatedAtDesc(
                        user.getId()
                );

        long buys =
                orders.stream()
                        .filter(o ->
                                o.getOrderType() == Order.OrderType.BUY &&
                                o.getStatus() == Order.OrderStatus.FILLED)
                        .count();

        long sells =
                orders.stream()
                        .filter(o ->
                                o.getOrderType() == Order.OrderType.SELL &&
                                o.getStatus() == Order.OrderStatus.FILLED)
                        .count();

        BigDecimal buyValue =
                orders.stream()
                        .filter(o ->
                                o.getOrderType() == Order.OrderType.BUY &&
                                o.getStatus() == Order.OrderStatus.FILLED)
                        .map(Order::getTotalAmount)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal sellValue =
                orders.stream()
                        .filter(o ->
                                o.getOrderType() == Order.OrderType.SELL &&
                                o.getStatus() == Order.OrderStatus.FILLED)
                        .map(Order::getTotalAmount)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);

        /*
         * Calculate realized P&L using the average cost
         * of the shares being sold.
         *
         * Orders are returned newest first, so reverse them
         * to process BUY/SELL transactions chronologically.
         */
        List<Order> chronologicalOrders =
                orders.stream()
                        .filter(o ->
                                o.getStatus() == Order.OrderStatus.FILLED)
                        .sorted((a, b) ->
                                a.getCreatedAt()
                                        .compareTo(b.getCreatedAt()))
                        .toList();

        Map<Long, Integer> quantities = new HashMap<>();
        Map<Long, BigDecimal> averageCosts = new HashMap<>();

        BigDecimal realizedPnl = BigDecimal.ZERO;

        for (Order order : chronologicalOrders) {

            Long instrumentId =
                    order.getInstrument().getId();

            if (order.getOrderType() == Order.OrderType.BUY) {

                int oldQuantity =
                        quantities.getOrDefault(
                                instrumentId,
                                0
                        );

                BigDecimal oldAverageCost =
                        averageCosts.getOrDefault(
                                instrumentId,
                                BigDecimal.ZERO
                        );

                int newQuantity =
                        oldQuantity + order.getQuantity();

                BigDecimal oldCost =
                        oldAverageCost.multiply(
                                BigDecimal.valueOf(oldQuantity)
                        );

                BigDecimal newCost =
                        oldCost.add(
                                order.getTotalAmount()
                        );

                BigDecimal newAverageCost =
                        newCost.divide(
                                BigDecimal.valueOf(newQuantity),
                                4,
                                java.math.RoundingMode.HALF_UP
                        );

                quantities.put(
                        instrumentId,
                        newQuantity
                );

                averageCosts.put(
                        instrumentId,
                        newAverageCost
                );

            } else if (order.getOrderType()
                    == Order.OrderType.SELL) {

                int currentQuantity =
                        quantities.getOrDefault(
                                instrumentId,
                                0
                        );

                BigDecimal averageCost =
                        averageCosts.getOrDefault(
                                instrumentId,
                                BigDecimal.ZERO
                        );

                int sellQuantity =
                        order.getQuantity();

                /*
                 * Realized P&L:
                 *
                 * (Selling Price - Average Buy Price)
                 * × Quantity Sold
                 */
                BigDecimal pnl =
                        order.getExecutionPrice()
                                .subtract(averageCost)
                                .multiply(
                                        BigDecimal.valueOf(
                                                sellQuantity
                                        )
                                );

                realizedPnl =
                        realizedPnl.add(pnl);

                int remainingQuantity =
                        currentQuantity - sellQuantity;

                quantities.put(
                        instrumentId,
                        Math.max(remainingQuantity, 0)
                );

                if (remainingQuantity <= 0) {
                    averageCosts.remove(instrumentId);
                }
            }
        }

        return new TradeAnalyticsResponse(
                buys + sells,
                buys,
                sells,
                buyValue,
                sellValue,
                realizedPnl
        );
    }
}