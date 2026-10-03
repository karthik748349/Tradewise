package com.tradewise.calendar.service;

import com.tradewise.calendar.dto.TradingCalendarResponse;
import com.tradewise.auth.entity.User;
import com.tradewise.auth.repository.UserRepository;
import com.tradewise.order.entity.Order;
import com.tradewise.order.repository.OrderRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class TradingCalendarService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    public TradingCalendarService(
            OrderRepository orderRepository,
            UserRepository userRepository
    ) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<TradingCalendarResponse> getCalendar(String email) {

        User user = userRepository
                .findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User not found"
                ));

        List<Order> orders =
                orderRepository.findByUserIdOrderByCreatedAtAsc(
                        user.getId()
                );

        Map<LocalDate, DailyData> dailyDataMap =
                new LinkedHashMap<>();

        for (Order order : orders) {

            LocalDate date =
                    order.getCreatedAt().toLocalDate();

            DailyData data =
                    dailyDataMap.computeIfAbsent(
                            date,
                            key -> new DailyData()
                    );

            data.totalTrades++;

            /*
             * BUY orders do not represent realized profit/loss.
             * SELL orders calculate P&L using the order's
             * execution amount versus the average entry cost.
             *
             * The current Order entity does not directly store
             * realized P&L, so the calendar uses SELL order
             * information together with the order history.
             */
            if (order.getOrderType() == Order.OrderType.SELL) {
                data.sellOrders.add(order);
            }
        }

        /*
         * Calculate realized P&L chronologically using
         * average-cost tracking for each instrument.
         */
        Map<Long, PositionData> positions =
                new LinkedHashMap<>();

        for (Order order : orders) {

            Long instrumentId =
                    order.getInstrument().getId();

            PositionData position =
                    positions.computeIfAbsent(
                            instrumentId,
                            key -> new PositionData()
                    );

            LocalDate date =
                    order.getCreatedAt().toLocalDate();

            DailyData dailyData =
                    dailyDataMap.get(date);

            if (order.getOrderType() == Order.OrderType.BUY) {

                BigDecimal buyAmount =
                        order.getExecutionPrice()
                                .multiply(
                                        BigDecimal.valueOf(
                                                order.getQuantity()
                                        )
                                );

                position.totalQuantity +=
                        order.getQuantity();

                position.totalInvested =
                        position.totalInvested.add(buyAmount);

            } else if (order.getOrderType() == Order.OrderType.SELL) {

                if (position.totalQuantity <= 0) {
                    continue;
                }

                int soldQuantity =
                        Math.min(
                                order.getQuantity(),
                                position.totalQuantity
                        );

                BigDecimal averageBuyPrice =
                        position.totalInvested.divide(
                                BigDecimal.valueOf(
                                        position.totalQuantity
                                ),
                                4,
                                java.math.RoundingMode.HALF_UP
                        );

                BigDecimal costOfSoldShares =
                        averageBuyPrice.multiply(
                                BigDecimal.valueOf(
                                        soldQuantity
                                )
                        );

                BigDecimal sellAmount =
                        order.getExecutionPrice()
                                .multiply(
                                        BigDecimal.valueOf(
                                                soldQuantity
                                        )
                                );

                BigDecimal pnl =
                        sellAmount.subtract(
                                costOfSoldShares
                        );

                dailyData.dailyPnl =
                        dailyData.dailyPnl.add(pnl);

                if (pnl.compareTo(BigDecimal.ZERO) > 0) {
                    dailyData.winningTrades++;
                } else if (pnl.compareTo(BigDecimal.ZERO) < 0) {
                    dailyData.losingTrades++;
                }

                position.totalQuantity -= soldQuantity;

                position.totalInvested =
                        position.totalInvested
                                .subtract(costOfSoldShares);

                if (position.totalQuantity == 0) {
                    position.totalInvested =
                            BigDecimal.ZERO;
                }
            }
        }

        List<TradingCalendarResponse> response =
                new ArrayList<>();

        for (Map.Entry<LocalDate, DailyData> entry :
                dailyDataMap.entrySet()) {

            DailyData data = entry.getValue();

            response.add(
                    new TradingCalendarResponse(
                            entry.getKey(),
                            data.totalTrades,
                            data.winningTrades,
                            data.losingTrades,
                            data.dailyPnl
                    )
            );
        }

        return response;
    }

    private static class DailyData {

        private int totalTrades;

        private int winningTrades;

        private int losingTrades;

        private BigDecimal dailyPnl =
                BigDecimal.ZERO;

        private List<Order> sellOrders =
                new ArrayList<>();
    }

    private static class PositionData {

        private int totalQuantity;

        private BigDecimal totalInvested =
                BigDecimal.ZERO;
    }
}