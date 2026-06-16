# 🍽️ ReserveIQ – Smart Restaurant Reservation Platform

A complete full-stack restaurant reservation and queue management platform.

## 🎯 Project Overview

ReserveIQ connects diners with restaurants, enabling:
- **Customers** to discover restaurants, book tables, leave reviews
- **Managers** to manage their restaurants, tables, and approve reservations
- **Admins** to oversee the entire platform with statistics and user management

---

## 🛠️ Tech Stack

### Frontend (this repository)
- React 18 + JSX
- Vite
- React Router DOM v6
- Axios
- Material UI (MUI) v5
- Context API for authentication
- Tailwind CSS (utility classes)

### Backend (Spring Boot — separate repo)
- Java 21 + Spring Boot 3
- Spring Security + JWT Authentication
- Spring Data JPA + Hibernate
- MySQL Database
- Lombok + Bean Validation
- Swagger / OpenAPI
- Maven

---

## 🔑 Demo Accounts

Click the quick-fill buttons on the login page, or use:

| Role     | Email                  | Password      |
|----------|------------------------|---------------|
| Customer | `john@example.com`     | `password123` |
| Manager  | `maria@reserveiq.com`  | `manager123`  |
| Admin    | `admin@reserveiq.com`  | `admin123`    |

---

## 📁 Frontend Structure

```
src/
├── main.jsx                 # App entry point
├── App.jsx                  # Route definitions
├── index.css                # Global styles
│
├── context/
│   └── AuthContext.jsx      # Authentication (Context API)
│
├── services/                # API calls (mirror Spring Boot endpoints)
│   ├── api.js               # Axios instance with JWT interceptor
│   ├── authService.js       # (handled in AuthContext)
│   ├── restaurantService.js
│   ├── tableService.js
│   ├── reservationService.js
│   ├── reviewService.js
│   └── userService.js
│
├── data/
│   └── mockData.js          # Sample data (simulates MySQL)
│
├── components/
│   ├── Navbar.jsx
│   ├── ProtectedRoute.jsx   # Role-based route guard
│   ├── RestaurantCard.jsx
│   ├── ReservationCard.jsx
│   └── ReviewCard.jsx
│
├── layouts/
│   ├── MainLayout.jsx       # Public pages layout (navbar + footer)
│   └── DashboardLayout.jsx  # Auth pages layout (sidebar)
│
└── pages/
    ├── public/
    │   ├── Home.jsx
    │   ├── Login.jsx
    │   ├── Register.jsx
    │   ├── RestaurantList.jsx
    │   └── RestaurantDetails.jsx
    ├── customer/
    │   ├── Dashboard.jsx
    │   ├── MyReservations.jsx
    │   └── Profile.jsx
    ├── manager/
    │   ├── RestaurantManagement.jsx
    │   ├── TableManagement.jsx
    │   └── ReservationManagement.jsx
    └── admin/
        ├── Dashboard.jsx
        └── UserManagement.jsx
```

---

## 🚀 Running Locally

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build
```

## 🌐 Deployment

### Frontend → Vercel
The `vercel.json` file is included. Just connect your GitHub repo to Vercel.

Add the environment variable in Vercel:
- `VITE_API_URL=https://your-backend.railway.app/api`

### Backend → Railway (Spring Boot)
1. Create a new Railway project
2. Provision a MySQL service
3. Add these environment variables:
```
SPRING_DATASOURCE_URL=jdbc:mysql://${MYSQLHOST}:${MYSQLPORT}/${MYSQLDATABASE}
SPRING_DATASOURCE_USERNAME=${MYSQLUSER}
SPRING_DATASOURCE_PASSWORD=${MYSQLPASSWORD}
JWT_SECRET=your-256-bit-secret-key-here
```
4. Deploy the Spring Boot JAR file

---

## 🔌 API Endpoints (Spring Boot)

### Auth
| Method | Endpoint             | Access    |
|--------|----------------------|-----------|
| POST   | `/api/auth/register` | Public    |
| POST   | `/api/auth/login`    | Public    |

### Restaurants
| Method | Endpoint                  | Access         |
|--------|---------------------------|----------------|
| GET    | `/api/restaurants`        | Public         |
| GET    | `/api/restaurants/{id}`   | Public         |
| POST   | `/api/restaurants`        | MANAGER/ADMIN  |
| PUT    | `/api/restaurants/{id}`   | MANAGER/ADMIN  |
| DELETE | `/api/restaurants/{id}`   | MANAGER/ADMIN  |

### Tables
| Method | Endpoint                             | Access    |
|--------|--------------------------------------|-----------|
| GET    | `/api/tables/restaurant/{id}`        | Public    |
| POST   | `/api/tables`                        | MANAGER   |
| PUT    | `/api/tables/{id}`                   | MANAGER   |
| DELETE | `/api/tables/{id}`                   | MANAGER   |

### Reservations
| Method | Endpoint                             | Access    |
|--------|--------------------------------------|-----------|
| GET    | `/api/reservations`                  | MANAGER/ADMIN |
| GET    | `/api/reservations/my`               | CUSTOMER  |
| POST   | `/api/reservations`                  | CUSTOMER  |
| DELETE | `/api/reservations/{id}`            | CUSTOMER/MANAGER |
| PUT    | `/api/reservations/{id}/approve`     | MANAGER   |
| PUT    | `/api/reservations/{id}/reject`      | MANAGER   |

### Reviews
| Method | Endpoint                             | Access    |
|--------|--------------------------------------|-----------|
| GET    | `/api/reviews/restaurant/{id}`       | Public    |
| POST   | `/api/reviews`                       | CUSTOMER  |

### Users (Admin)
| Method | Endpoint                  | Access  |
|--------|---------------------------|---------|
| GET    | `/api/users`              | ADMIN   |
| PUT    | `/api/users/{id}/role`    | ADMIN   |
| DELETE | `/api/users/{id}`         | ADMIN   |

---

## 🗄️ Database Schema (MySQL)

### users
| Column     | Type         |
|------------|--------------|
| id         | BIGINT PK    |
| full_name  | VARCHAR(100) |
| email      | VARCHAR(100) UNIQUE |
| password   | VARCHAR(255) |
| role       | ENUM(CUSTOMER, MANAGER, ADMIN) |
| phone      | VARCHAR(20)  |
| created_at | DATETIME     |

### restaurants
| Column         | Type         |
|----------------|--------------|
| id             | BIGINT PK    |
| name           | VARCHAR(150) |
| description    | TEXT         |
| cuisine        | VARCHAR(50)  |
| address        | VARCHAR(255) |
| phone_number   | VARCHAR(20)  |
| opening_time   | TIME         |
| closing_time   | TIME         |
| image_url      | VARCHAR(255) |
| manager_id     | BIGINT FK    |

### restaurant_tables
| Column         | Type         |
|----------------|--------------|
| id             | BIGINT PK    |
| restaurant_id  | BIGINT FK    |
| table_number   | INT          |
| capacity       | INT          |
| status         | ENUM(AVAILABLE, RESERVED, OCCUPIED, MAINTENANCE) |

### reservations
| Column            | Type         |
|-------------------|--------------|
| id                | BIGINT PK    |
| user_id           | BIGINT FK    |
| table_id          | BIGINT FK    |
| restaurant_id     | BIGINT FK    |
| reservation_date  | DATE         |
| reservation_time  | TIME         |
| guest_count       | INT          |
| status            | ENUM(PENDING, CONFIRMED, CANCELLED, REJECTED, COMPLETED) |
| special_requests  | TEXT         |
| created_at        | DATETIME     |

### reviews
| Column         | Type         |
|----------------|--------------|
| id             | BIGINT PK    |
| user_id        | BIGINT FK    |
| restaurant_id  | BIGINT FK    |
| rating         | INT (1-5)    |
| comment        | TEXT         |
| created_at     | DATETIME     |

---

## 🔐 Spring Boot Security Configuration

Security filter chain should:
1. Permit public endpoints (`/api/auth/**`, `/api/restaurants/**`, `/api/reviews/restaurant/**`, `/api/tables/restaurant/**`)
2. Require JWT for everything else
3. Use `@PreAuthorize("hasRole('MANAGER')")` for manager-only endpoints
4. Use `@PreAuthorize("hasRole('ADMIN')")` for admin-only endpoints
5. BCrypt password encoder
6. JWT token valid for 24 hours

---

Built with ❤️ using React + Spring Boot
