package com.tradewise.order.service;

import com.tradewise.auth.entity.User;
import com.tradewise.auth.repository.UserRepository;
import com.tradewise.holding.entity.Holding;
import com.tradewise.holding.repository.HoldingRepository;
import com.tradewise.instrument.entity.Instrument;
import com.tradewise.instrument.repository.InstrumentRepository;
import com.tradewise.market.entity.MarketPrice;
import com.tradewise.market.repository.MarketPriceRepository;
import com.tradewise.order.dto.BuyOrderRequest;
import com.tradewise.order.dto.OrderResponse;
import com.tradewise.order.dto.SellOrderRequest;
import com.tradewise.order.entity.Order;
import com.tradewise.order.repository.OrderRepository;
import com.tradewise.portfolio.entity.Portfolio;
import com.tradewise.portfolio.repository.PortfolioRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final InstrumentRepository instrumentRepository;
    private final MarketPriceRepository marketPriceRepository;
    private final PortfolioRepository portfolioRepository;
    private final HoldingRepository holdingRepository;

    public OrderService(
            OrderRepository orderRepository,
            UserRepository userRepository,
            InstrumentRepository instrumentRepository,
            MarketPriceRepository marketPriceRepository,
            PortfolioRepository portfolioRepository,
            HoldingRepository holdingRepository
    ) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.instrumentRepository = instrumentRepository;
        this.marketPriceRepository = marketPriceRepository;
        this.portfolioRepository = portfolioRepository;
        this.holdingRepository = holdingRepository;
    }

    @Transactional
    public OrderResponse buy(
            String email,
            BuyOrderRequest request
    ) {

        validateQuantity(request.getQuantity());

        User user = getUser(email);

        Instrument instrument =
                instrumentRepository.findById(request.getInstrumentId())
                        .orElseThrow(() -> new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Instrument not found"
                        ));

        if (!instrument.isActive()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Instrument is not active"
            );
        }

        MarketPrice marketPrice = getLatestPrice(instrument.getId());

        BigDecimal executionPrice = marketPrice.getClosePrice();

        BigDecimal totalAmount =
                executionPrice.multiply(
                        BigDecimal.valueOf(request.getQuantity())
                );

        Portfolio portfolio =
                portfolioRepository.findByUserId(user.getId())
                        .orElseThrow(() -> new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Portfolio not found"
                        ));

        if (portfolio.getAvailableCash().compareTo(totalAmount) < 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Insufficient available cash"
            );
        }

        portfolio.setAvailableCash(
                portfolio.getAvailableCash().subtract(totalAmount)
        );

        portfolio.setInvestedAmount(
                portfolio.getInvestedAmount().add(totalAmount)
        );

        Holding holding =
                holdingRepository
                        .findByUserIdAndInstrumentId(
                                user.getId(),
                                instrument.getId()
                        )
                        .orElse(null);

        if (holding == null) {

            holding = new Holding(
                    user,
                    instrument,
                    request.getQuantity(),
                    executionPrice,
                    totalAmount
            );

        } else {

            int oldQuantity = holding.getQuantity();
            int newQuantity = oldQuantity + request.getQuantity();

            BigDecimal newInvestedAmount =
                    holding.getInvestedAmount()
                            .add(totalAmount);

            BigDecimal newAveragePrice =
                    newInvestedAmount.divide(
                            BigDecimal.valueOf(newQuantity),
                            4,
                            java.math.RoundingMode.HALF_UP
                    );

            holding.setQuantity(newQuantity);
            holding.setInvestedAmount(newInvestedAmount);
            holding.setAverageBuyPrice(newAveragePrice);
        }

        holdingRepository.save(holding);

        Order order =
                new Order(
                        user,
                        instrument,
                        Order.OrderType.BUY,
                        request.getQuantity(),
                        executionPrice,
                        totalAmount
                );

        Order savedOrder = orderRepository.save(order);

        portfolioRepository.save(portfolio);

        return OrderResponse.from(savedOrder);
    }

    @Transactional
    public OrderResponse sell(
            String email,
            SellOrderRequest request
    ) {

        validateQuantity(request.getQuantity());

        User user = getUser(email);

        Instrument instrument =
                instrumentRepository.findById(request.getInstrumentId())
                        .orElseThrow(() -> new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Instrument not found"
                        ));

        MarketPrice marketPrice =
                getLatestPrice(instrument.getId());

        BigDecimal executionPrice =
                marketPrice.getClosePrice();

        Holding holding =
                holdingRepository
                        .findByUserIdAndInstrumentId(
                                user.getId(),
                                instrument.getId()
                        )
                        .orElseThrow(() -> new ResponseStatusException(
                                HttpStatus.BAD_REQUEST,
                                "You do not own this instrument"
                        ));

        if (holding.getQuantity() < request.getQuantity()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Insufficient holding quantity"
            );
        }

        BigDecimal totalAmount =
                executionPrice.multiply(
                        BigDecimal.valueOf(request.getQuantity())
                );

        BigDecimal costOfSoldShares =
                holding.getAverageBuyPrice()
                        .multiply(
                                BigDecimal.valueOf(
                                        request.getQuantity()
                                )
                        );

        BigDecimal realizedPnl =
                totalAmount.subtract(costOfSoldShares);

        Portfolio portfolio =
                portfolioRepository.findByUserId(user.getId())
                        .orElseThrow(() -> new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Portfolio not found"
                        ));

        portfolio.setAvailableCash(
                portfolio.getAvailableCash().add(totalAmount)
        );

        portfolio.setInvestedAmount(
                portfolio.getInvestedAmount()
                        .subtract(costOfSoldShares)
        );

        if (portfolio.getInvestedAmount().compareTo(BigDecimal.ZERO) < 0) {
            portfolio.setInvestedAmount(BigDecimal.ZERO);
        }

        int remainingQuantity =
                holding.getQuantity() - request.getQuantity();

        if (remainingQuantity == 0) {

            holdingRepository.delete(holding);

        } else {

            BigDecimal remainingInvestedAmount =
                    holding.getAverageBuyPrice()
                            .multiply(
                                    BigDecimal.valueOf(
                                            remainingQuantity
                                    )
                            );

            holding.setQuantity(remainingQuantity);
            holding.setInvestedAmount(remainingInvestedAmount);

            holdingRepository.save(holding);
        }

        Order order =
                new Order(
                        user,
                        instrument,
                        Order.OrderType.SELL,
                        request.getQuantity(),
                        executionPrice,
                        totalAmount
                );

        Order savedOrder =
                orderRepository.save(order);

        portfolioRepository.save(portfolio);

        return OrderResponse.from(savedOrder);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getOrders(String email) {

        User user = getUser(email);

        return orderRepository
                .findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(OrderResponse::from)
                .toList();
    }

    private User getUser(String email) {

        return userRepository
                .findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User not found"
                ));
    }

    private MarketPrice getLatestPrice(Long instrumentId) {

        return marketPriceRepository
                .findTopByInstrumentIdOrderByPriceTimeDesc(
                        instrumentId
                )
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Market price not available"
                ));
    }

    private void validateQuantity(Integer quantity) {

        if (quantity == null || quantity <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Quantity must be greater than zero"
            );
        }
    }
}