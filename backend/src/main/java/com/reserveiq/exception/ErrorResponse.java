package com.reserveiq.exception;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Clean Error Response format returned by the Global Exception Handler.
 */
@Getter
@Setter
@AllArgsConstructor
@Builder
public class ErrorResponse {
    private LocalDateTime timestamp;
    private int status;
    private String error;
    private String message;
    private String path;
    private Map<String, String> validationErrors;
}
