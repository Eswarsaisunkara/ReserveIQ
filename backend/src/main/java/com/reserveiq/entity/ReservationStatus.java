package com.reserveiq.entity;

/**
 * Status of a table booking/reservation lifecycle.
 */
public enum ReservationStatus {
    PENDING,    // Request submitted by customer, waiting for manager
    CONFIRMED,  // Approved by manager
    CANCELLED,  // Cancelled by customer
    REJECTED,   // Rejected by manager
    COMPLETED   // Guest arrived and dined successfully
}
