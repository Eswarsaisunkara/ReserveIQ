# 🍽️ ReserveIQ Backend

Spring Boot backend for the ReserveIQ Restaurant Reservation System.

## Tech Stack

* Java 21
* Spring Boot
* Spring Security
* JWT Authentication
* MySQL
* Maven
* Swagger/OpenAPI

## Prerequisites

* Java 21+
* Maven
* MySQL 8+

## Run Locally

### 1. Clone the Repository

```bash
git clone <repository-url>
cd backend
```

### 2. Create the Database

```sql
CREATE DATABASE reserveiq;
```

### 3. Configure Database Credentials

Update:

```text
src/main/resources/application.properties
```

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/reserveiq
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
```

### 4. Start the Application

```bash
mvn clean install
mvn spring-boot:run
```

The backend will start on:

```text
http://localhost:8080
```

## API Documentation

Swagger UI:

```text
http://localhost:8080/swagger-ui.html
```

## Demo Accounts

| Role     | Email                                             | Password    |
| -------- | ------------------------------------------------- | ----------- |
| Customer | [john@example.com](mailto:john@example.com)       | password123 |
| Manager  | [maria@reserveiq.com](mailto:maria@reserveiq.com) | manager123  |
| Admin    | [admin@reserveiq.com](mailto:admin@reserveiq.com) | admin123    |

## Features

* User Authentication & Authorization
* JWT Security
* Restaurant Management
* Table Reservations
* Booking Management
* RESTful APIs
* MySQL Integration

## Project Structure

```text
src/main/
├── controller/
├── service/
├── repository/
├── entity/
├── dto/
├── security/
├── config/
└── resources/
```

For frontend setup instructions, see `frontend/README.md`.
