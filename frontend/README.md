# 🍽️ ReserveIQ – Smart Restaurant Reservation & Queue Management Platform

Welcome to **ReserveIQ** — a state-of-the-art full-stack platform designed to connect food connoisseurs with premium dining venues. This repository provides both a standalone ultra-premium client application (frontend) and a complete professionally structured Spring Boot Monolith backend ready to connect to a MySQL Cloud / Local Database.

> 📖 **Backend + Database setup?** See the detailed step-by-step guide: **[`backend/README.md`](backend/README.md)**

---

## 🎯 Architecture & Options Highlights

```
===================================================================================
                       RESERVEIQ PLATFORM ECOSYSTEM
===================================================================================

  [OPTION A: CLIENT APP]                       [OPTION B: SPRING BOOT BACKEND]
  ┌─────────────────────────┐                  ┌─────────────────────────────────┐
  │  React 18 + Vite + MUI  │ ◄─── REST ───►   │  Java 21 + Spring Boot 3 Monolith│
  │  (Ultra-Premium UI/UX)  │    (Axios)       │  (Clean Classic MVC Architecture)│
  └─────────────┬───────────┘                  └────────────────┬────────────────┘
                │                                               │
             Deploy                                          Deploy / Connect
                ▼                                               ▼
      ┌──────────────────┐                            ┌───────────────────┐
      │  Vercel Hosting  │                            │ Cloud / Local     │
      └──────────────────┘                            │ MySQL Database    │
                                                      └───────────────────┘
```

### Option A: The React Frontend Application (`src/`)
- **Visual Feel**: Breathtaking premium restaurant aesthetics with rich copper (`#d97706`) and amber gold (`#fbbf24`) accents.
- **Micro-interactions**: Smooth page transitions and card hover states powered by `framer-motion`. Toast notifications via `notistack`.
- **Advanced Mock Architecture**: Completely self-contained simulating server delays, JWT token exchange, and interactive virtual queue workflows. Ready to connect to your live Spring Boot API by flipping one environment variable.

### Option B: The Spring Boot Monolith Backend (`backend/`)
- **Clean Simplicity**: Built using straightforward, beginner-to-intermediate friendly Java 21 code. **No Microservices, No Kafka, No Kubernetes.**
- **Pattern Architecture**: Built exactly on the classic **Spring MVC & Service-Repository Pattern** using constructor injection (`@RequiredArgsConstructor`).
- **Security & Authorization**: Spring Security 3 with stateless 24-hour **JSON Web Tokens (JWT)** and precise **Role-Based Access Control (RBAC)** for `CUSTOMER`, `MANAGER`, and `ADMIN` user roles.
- **Documentation**: Fully configured Swagger UI (`springdoc-openapi`) and exhaustive comments on every entity relationship, controller endpoint, and Postman payload.

---

## 🔑 Quick-Fill Demo Credentials

Whether browsing the live React application or testing your Spring Boot APIs, you can use the following default credentials (which match the seeded MySQL database):

| User Role | Email Address          | Password Match | Permissions Access Scope |
|-----------|------------------------|----------------|--------------------------|
| **Customer** | `john@example.com`     | `password123`  | Book tables, join virtual queues, write reviews, view itinerary history |
| **Manager**  | `maria@reserveiq.com`  | `manager123`   | Create/edit assigned restaurants, configure table layouts, approve/reject bookings |
| **Admin**    | `admin@reserveiq.com`  | `admin123`     | Manage and promote registered users, view platform-wide business analytics |

---

## 🚀 How to Run Locally

### 1️⃣ Option A: Running the React Client Application
The client app is ready to launch in seconds without setting up a backend:

```bash
# Clone the repository
git clone https://github.com/your-username/reserveiq.git
cd reserveiq

# Install dependencies
npm install

# Start the high-performance Vite development server
npm run dev
```
Open your web browser to `http://localhost:5173` (or the port indicated by Vite).

---

### 2️⃣ Option B: Running the Spring Boot Backend & Connecting to MySQL

#### Step 1: Initialize your MySQL Database
1. Open your database tool (MySQL Workbench, DBeaver, or Railway MySQL).
2. Create a new database named `reserveiq`:
   ```sql
   CREATE DATABASE IF NOT EXISTS reserveiq;
   ```
3. (Optional) Run the provided initialization SQL script to seed mock users, restaurants, and tables:
   ```bash
   # You can execute the script from the command line:
   mysql -u root -p reserveiq < backend/src/main/resources/init.sql
   ```

#### Step 2: Configure your `application.properties`
Open `backend/src/main/resources/application.properties` and verify or update your database credentials:

```properties
server.port=8080

# Configure MySQL Connection URL & Credentials
spring.datasource.url=jdbc:mysql://localhost:3306/reserveiq?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=your-mysql-password-here
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# Automatically update database schemas matching entities
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

# Base64 256-bit Secret Key for signing JWT tokens
jwt.secret=8fbc2e790b12bc1a8e9e4f2a74c1001a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e
```

#### Step 3: Build & Launch with Maven
Open a terminal in the `backend/` directory:

```bash
cd backend

# Compile the project and verify all Java tests pass
mvn clean install

# Launch the Spring Boot API Monolith
mvn spring-boot:run
```

**Verify the API**:
Open your browser to `http://localhost:8080/swagger-ui/index.html`. You will see the interactive OpenAPI documentation matching all platform endpoints.

---

## 🔌 Connecting Option A Frontend to your Live Option B Backend
To switch the React frontend from its local mock simulation to your live Spring Boot API on `localhost:8080` (or Railway):

1. Create a `.env` file in the root of the React project (copying `.env.example`):
   ```env
   VITE_API_URL=http://localhost:8080/api
   ```
2. In `src/services/api.js`, Axios will automatically pick up this environment variable and attach the JWT tokens stored in your browser's `localStorage` (`reserveiq_user`) to the `Authorization: Bearer <token>` header of every API request.

---

## 🗄️ Detailed Database Schema (Cloud / Local MySQL)

Our Spring Boot JPA Entities (`@Entity`) directly map to these strict relational tables:

```
+-----------------------------------------------------------------------+
|  users                                                                |
+-----------------------------------------------------------------------+
| id (BIGINT PK) | email (VARCHAR UNIQUE) | full_name (VARCHAR)         |
| password (VARCHAR BCrypt) | role (ENUM) | phone (VARCHAR)             |
+-----------------------------------------------------------------------+
                                    ▲
                                    │ (manager_id / user_id)
                                    ▼
+-----------------------------------------------------------------------+
|  restaurants                                                          |
+-----------------------------------------------------------------------+
| id (BIGINT PK) | name (VARCHAR) | cuisine (VARCHAR) | address         |
| opening_time (TIME) | closing_time (TIME) | manager_id (BIGINT FK)    |
+-----------------------------------------------------------------------+
            ▲                                               ▲
            │ (restaurant_id)                               │ (restaurant_id)
            ▼                                               ▼
+-----------------------------------+   +-------------------------------+
|  restaurant_tables                |   |  reviews                      |
+-----------------------------------+   +-------------------------------+
| id (BIGINT PK) | table_number     |   | id (BIGINT PK) | rating (1-5) |
| capacity (INT) | status (ENUM)    |   | comment (TEXT) | user_id (FK) |
+-----------------------------------+   +-------------------------------+
            ▲
            │ (table_id)
            ▼
+-----------------------------------------------------------------------+
|  reservations                                                         |
+-----------------------------------------------------------------------+
| id (BIGINT PK) | reservation_date (DATE) | reservation_time (TIME)    |
| guest_count (INT) | status (ENUM) | user_id (FK) | restaurant_id (FK) |
+-----------------------------------------------------------------------+
```

---

## 📨 Postman API Examples & Testing Guide

Below are examples of how to format your JSON requests when testing the REST endpoints via Postman:

### 1. Authenticate & Obtain JWT Token
- **Endpoint**: `POST http://localhost:8080/api/auth/login`
- **Headers**: `Content-Type: application/json`
- **Body JSON Payload**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response**: Returns your `token` string alongside user identification details. Copy this token string for subsequent requests.

### 2. Submit a High-Priority Table Booking
- **Endpoint**: `POST http://localhost:8080/api/reservations`
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer <paste-your-token-here>`
- **Body JSON Payload**:
  ```json
  {
    "userId": 1,
    "tableId": 3,
    "restaurantId": 1,
    "reservationDate": "2025-03-15",
    "reservationTime": "19:30:00",
    "guestCount": 4,
    "specialRequests": "It is our 5th wedding anniversary — window seat and champagne bucket preferred."
  }
  ```
- **Response**: Returns the newly saved reservation object with status set to `PENDING`.

### 3. Manager Approves a Reservation Request
- **Endpoint**: `PUT http://localhost:8080/api/reservations/1/approve`
- **Headers**: `Authorization: Bearer <paste-manager-token-here>`
- **Response**: Confirms the booking status has been promoted to `CONFIRMED`.

---

## 🌐 Production Deployment Requirements

### Railway Deployment (Option B Spring Boot API)
1. Fork or push the `backend/` code to your GitHub repository.
2. In your Railway dashboard, click **New Project** → **Deploy from GitHub repo**.
3. Provision a connected MySQL database service within the same Railway private network.
4. Add your production environment variables to your Spring Boot service container:
   ```
   SPRING_DATASOURCE_URL=jdbc:mysql://${MYSQLHOST}:${MYSQLPORT}/${MYSQLDATABASE}?useSSL=false
   SPRING_DATASOURCE_USERNAME=${MYSQLUSER}
   SPRING_DATASOURCE_PASSWORD=${MYSQLPASSWORD}
   JWT_SECRET=your-secure-production-random-256-bit-key
   ```
5. Railway's build Nixpacks will execute `mvn clean package` and launch your monolithic Java JAR.

### Vercel Deployment (Option A React Frontend)
1. In your Vercel dashboard, click **Add New Project** → choose your connected GitHub repository.
2. Ensure the Framework Preset is detected as **Vite**.
3. In Environment Variables, set:
   ```
   VITE_API_URL=https://your-production-railway-backend.up.railway.app/api
   ```
4. Click **Deploy**. Vercel will process `vercel.json` and serve your lightning-fast client app.

---

### ❓ Support or Doubts?
If you have any doubts regarding the constructor injection patterns, JPA bidirectional mapping setups, or how JWT claims are verified in the Spring security filter, please consult the provided inline JavaDoc comments or open an issue!

Happy Smart Coding & Bon Appétit! 🍷✨
