package com.tradewise.order.controller;

import com.tradewise.order.dto.BuyOrderRequest;
import com.tradewise.order.dto.OrderResponse;
import com.tradewise.order.dto.SellOrderRequest;
import com.tradewise.order.service.OrderService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(
            OrderService orderService
    ) {
        this.orderService = orderService;
    }

    /**
     * Execute a paper BUY order.
     *
     * POST /api/orders/buy
     */
    @PostMapping("/buy")
    public ResponseEntity<OrderResponse> buy(
            Principal principal,
            @RequestBody BuyOrderRequest request
    ) {

        return ResponseEntity.ok(
                orderService.buy(
                        principal.getName(),
                        request
                )
        );
    }

    /**
     * Execute a paper SELL order.
     *
     * POST /api/orders/sell
     */
    @PostMapping("/sell")
    public ResponseEntity<OrderResponse> sell(
            Principal principal,
            @RequestBody SellOrderRequest request
    ) {

        return ResponseEntity.ok(
                orderService.sell(
                        principal.getName(),
                        request
                )
        );
    }

    /**
     * Get order history for the logged-in user.
     *
     * GET /api/orders
     */
    @GetMapping
    public ResponseEntity<List<OrderResponse>> getOrders(
            Principal principal
    ) {

        return ResponseEntity.ok(
                orderService.getOrders(
                        principal.getName()
                )
        );
    }
}