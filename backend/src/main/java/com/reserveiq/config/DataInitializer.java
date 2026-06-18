package com.reserveiq.config;

import com.reserveiq.entity.*;
import com.reserveiq.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;

/**
 * Database Seed / Data Initializer.
 * --------------------------------------------------
 * Runs automatically every time the Spring Boot app starts.
 * It ONLY inserts sample data if the database is empty (idempotent),
 * so it is safe to run repeatedly.
 *
 * IMPORTANT: It uses the real BCrypt PasswordEncoder bean to hash
 * passwords correctly — so the demo accounts will actually log in.
 *
 * This replaces the need to manually run init.sql with hard-coded
 * (and often incorrect) password hashes.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RestaurantRepository restaurantRepository;
    private final RestaurantTableRepository tableRepository;
    private final ReservationRepository reservationRepository;
    private final ReviewRepository reviewRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Only seed if there are no users yet (keeps it idempotent)
        if (userRepository.count() > 0) {
            log.info("Database already contains data — skipping seed initialization.");
            return;
        }

        log.info("🌱 Seeding ReserveIQ database with sample data...");

        // ---------- 1. USERS ----------
        User customer = userRepository.save(User.builder()
                .fullName("John Customer")
                .email("john@example.com")
                .password(passwordEncoder.encode("password123"))
                .role(Role.CUSTOMER)
                .phone("+1-555-0101")
                .build());

        User manager = userRepository.save(User.builder()
                .fullName("Maria Manager")
                .email("maria@reserveiq.com")
                .password(passwordEncoder.encode("manager123"))
                .role(Role.MANAGER)
                .phone("+1-555-0102")
                .build());

        userRepository.save(User.builder()
                .fullName("Admin User")
                .email("admin@reserveiq.com")
                .password(passwordEncoder.encode("admin123"))
                .role(Role.ADMIN)
                .phone("+1-555-0100")
                .build());

        User sarah = userRepository.save(User.builder()
                .fullName("Sarah Smith")
                .email("sarah@example.com")
                .password(passwordEncoder.encode("password123"))
                .role(Role.CUSTOMER)
                .phone("+1-555-0103")
                .build());

        // ---------- 2. RESTAURANTS ----------
        Restaurant goldenFork = restaurantRepository.save(Restaurant.builder()
                .name("The Golden Fork")
                .description("A fine dining experience with modern European cuisine, featuring locally-sourced ingredients and an award-winning wine list.")
                .cuisine("French")
                .address("123 Gourmet Street, Downtown")
                .phoneNumber("+1-555-1001")
                .openingTime(LocalTime.of(17, 0))
                .closingTime(LocalTime.of(23, 0))
                .imageUrl("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800")
                .manager(manager)
                .build());

        Restaurant sakura = restaurantRepository.save(Restaurant.builder()
                .name("Sakura Sushi House")
                .description("Authentic Japanese sushi and sashimi prepared by master chefs with over 20 years of experience. Fresh fish flown daily from Tokyo.")
                .cuisine("Japanese")
                .address("456 Cherry Blossom Ave, Midtown")
                .phoneNumber("+1-555-1002")
                .openingTime(LocalTime.of(12, 0))
                .closingTime(LocalTime.of(22, 0))
                .imageUrl("https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=800")
                .manager(manager)
                .build());

        Restaurant pastaParadise = restaurantRepository.save(Restaurant.builder()
                .name("Pasta Paradise")
                .description("Traditional Italian recipes passed down through generations. Wood-fired pizzas and homemade pasta in a cozy, rustic setting.")
                .cuisine("Italian")
                .address("789 Tuscan Road, Little Italy")
                .phoneNumber("+1-555-1003")
                .openingTime(LocalTime.of(11, 0))
                .closingTime(LocalTime.of(22, 30))
                .imageUrl("https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800")
                .manager(manager)
                .build());

        // ---------- 3. TABLES ----------
        tableRepository.save(RestaurantTable.builder()
                .restaurant(goldenFork).tableNumber(1).capacity(2).status(TableStatus.AVAILABLE).build());
        RestaurantTable table3 = tableRepository.save(RestaurantTable.builder()
                .restaurant(goldenFork).tableNumber(3).capacity(4).status(TableStatus.RESERVED).build());
        tableRepository.save(RestaurantTable.builder()
                .restaurant(goldenFork).tableNumber(4).capacity(6).status(TableStatus.AVAILABLE).build());

        RestaurantTable table9 = tableRepository.save(RestaurantTable.builder()
                .restaurant(sakura).tableNumber(2).capacity(4).status(TableStatus.AVAILABLE).build());
        tableRepository.save(RestaurantTable.builder()
                .restaurant(sakura).tableNumber(1).capacity(2).status(TableStatus.AVAILABLE).build());

        RestaurantTable table13 = tableRepository.save(RestaurantTable.builder()
                .restaurant(pastaParadise).tableNumber(1).capacity(4).status(TableStatus.AVAILABLE).build());
        tableRepository.save(RestaurantTable.builder()
                .restaurant(pastaParadise).tableNumber(2).capacity(2).status(TableStatus.MAINTENANCE).build());

        // ---------- 4. RESERVATIONS ----------
        reservationRepository.save(Reservation.builder()
                .user(customer).table(table3).restaurant(goldenFork)
                .reservationDate(LocalDate.now().plusDays(5))
                .reservationTime(LocalTime.of(19, 0))
                .guestCount(4).status(ReservationStatus.CONFIRMED)
                .specialRequests("Window seat preferred, anniversary dinner")
                .build());

        reservationRepository.save(Reservation.builder()
                .user(customer).table(table9).restaurant(sakura)
                .reservationDate(LocalDate.now().plusDays(10))
                .reservationTime(LocalTime.of(18, 30))
                .guestCount(3).status(ReservationStatus.PENDING)
                .specialRequests("Allergy to shellfish")
                .build());

        reservationRepository.save(Reservation.builder()
                .user(customer).table(table13).restaurant(pastaParadise)
                .reservationDate(LocalDate.now().plusDays(15))
                .reservationTime(LocalTime.of(19, 30))
                .guestCount(4).status(ReservationStatus.PENDING)
                .specialRequests("Birthday celebration")
                .build());

        // ---------- 5. REVIEWS ----------
        reviewRepository.save(Review.builder()
                .user(sarah).restaurant(goldenFork).rating(5)
                .comment("Absolutely incredible dining experience! The filet mignon was cooked to perfection and the service was impeccable.")
                .build());

        reviewRepository.save(Review.builder()
                .user(customer).restaurant(sakura).rating(5)
                .comment("Best sushi I have ever had outside of Japan. The omakase was worth every penny.")
                .build());

        reviewRepository.save(Review.builder()
                .user(sarah).restaurant(pastaParadise).rating(4)
                .comment("Great pasta and wonderful atmosphere. The tiramisu was a bit sweet but otherwise excellent.")
                .build());

        log.info("✅ Database seeded successfully! Demo accounts are ready to log in.");
    }
}
