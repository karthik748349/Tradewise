package com.tradewise.portfolio.service;

import com.tradewise.auth.entity.User;
import com.tradewise.auth.repository.UserRepository;
import com.tradewise.portfolio.dto.PortfolioResponse;
import com.tradewise.portfolio.entity.Portfolio;
import com.tradewise.portfolio.repository.PortfolioRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class PortfolioService {

    private final PortfolioRepository portfolioRepository;
    private final UserRepository userRepository;

    public PortfolioService(
            PortfolioRepository portfolioRepository,
            UserRepository userRepository
    ) {
        this.portfolioRepository = portfolioRepository;
        this.userRepository = userRepository;
    }

    /**
     * Get the portfolio belonging to the authenticated user.
     *
     * If the portfolio does not exist, create it with
     * ₹10,00,000 virtual capital.
     */
    public PortfolioResponse getOrCreatePortfolio(String email) {

        User user = userRepository
                .findByEmailIgnoreCase(email)
                .orElseThrow(
                        () -> new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "User not found"
                        )
                );

        Portfolio portfolio =
                portfolioRepository
                        .findByUserId(user.getId())
                        .orElseGet(() -> {

                            Portfolio newPortfolio =
                                    new Portfolio(user);

                            return portfolioRepository.save(
                                    newPortfolio
                            );
                        });

        return PortfolioResponse.from(portfolio);
    }
}