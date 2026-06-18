package com.reserveiq;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main entry point for ReserveIQ Spring Boot Monolith Application.
 * 
 * Includes explanations of coding rules:
 * - Constructor injection is used across all services and controllers
 * - Clean, MVC Service-Repository pattern architecture
 */
@SpringBootApplication
public class ReserveIQApplication {

    public static void main(String[] args) {
        SpringApplication.run(ReserveIQApplication.class, args);
    }
}
