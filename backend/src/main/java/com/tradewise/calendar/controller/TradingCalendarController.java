package com.tradewise.calendar.controller;

import com.tradewise.calendar.dto.TradingCalendarResponse;
import com.tradewise.calendar.service.TradingCalendarService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/calendar")
public class TradingCalendarController {

    private final TradingCalendarService tradingCalendarService;

    public TradingCalendarController(
            TradingCalendarService tradingCalendarService
    ) {
        this.tradingCalendarService = tradingCalendarService;
    }

    @GetMapping
    public ResponseEntity<List<TradingCalendarResponse>> getCalendar(
            Principal principal
    ) {
        return ResponseEntity.ok(
                tradingCalendarService.getCalendar(
                        principal.getName()
                )
        );
    }
}