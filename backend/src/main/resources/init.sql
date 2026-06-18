-- ====================================================================
-- ReserveIQ MySQL Database Setup
-- ====================================================================
-- NOTE: You do NOT need to create the tables manually.
-- Hibernate (spring.jpa.hibernate.ddl-auto=update) will create all
-- tables automatically when the Spring Boot app first starts.
--
-- The sample data (users, restaurants, tables, reviews) is inserted
-- automatically by DataInitializer.java using CORRECT BCrypt-hashed
-- passwords — so the demo accounts can actually log in.
--
-- You only need to run the ONE line below to create the database itself:
-- ====================================================================

CREATE DATABASE IF NOT EXISTS reserveiq;
USE reserveiq;
