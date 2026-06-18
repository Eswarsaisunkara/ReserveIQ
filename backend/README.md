# 🍽️ ReserveIQ Backend — Complete Setup Guide

This guide explains **everything** you need to run the Spring Boot backend,
connect it to a MySQL database, and connect the React frontend to it.

> 👉 Written for beginners. Follow the steps top to bottom.

---

## 📋 Table of Contents
1. [What You Need Installed](#1-what-you-need-installed)
2. [Create the MySQL Database](#2-create-the-mysql-database)
3. [Configure application.properties (THE MAIN PART)](#3-configure-applicationproperties-the-main-part)
4. [Run the Backend](#4-run-the-backend)
5. [Test That It Works (Swagger)](#5-test-that-it-works-swagger)
6. [Connect the React Frontend](#6-connect-the-react-frontend)
7. [Troubleshooting Common Errors](#7-troubleshooting-common-errors)

---

## 1. What You Need Installed

Make sure you have these 3 things on your computer:

| Software | Why | Download |
|----------|-----|----------|
| **Java 21** (JDK) | Runs the Spring Boot code | https://adoptium.net/ |
| **Maven** | Builds and runs the Java project | https://maven.apache.org/ |
| **MySQL 8** | The database server | https://dev.mysql.com/downloads/ |

> 💡 **Easier option:** Install **XAMPP** or **MySQL Workbench** — they give you
> a one-click MySQL server + a visual tool to see your tables.

**Verify Java is installed** by running in your terminal:
```bash
java -version
```
You should see something like `openjdk version "21..."`.

---

## 2. Create the MySQL Database

You do **NOT** create the tables manually. Hibernate creates all tables
automatically when Spring Boot starts. You only create an **empty database**.

### If using MySQL Command Line:
```bash
mysql -u root -p
```
Enter your password, then type:
```sql
CREATE DATABASE IF NOT EXISTS reserveiq;
exit;
```

### If using XAMPP:
1. Start **Apache** and **MySQL** from the XAMPP control panel
2. Open `http://localhost/phpmyadmin`
3. Click **New** → type database name `reserveiq` → click **Create**

### If using MySQL Workbench:
1. Connect to your local server
2. Click the "Create a new schema" icon (folder +)
3. Name it `reserveiq` → click **Apply**

✅ Done. An empty database named `reserveiq` now exists.

---

## 3. Configure application.properties (THE MAIN PART)

Open this file in any editor:
```
backend/src/main/resources/application.properties
```

You only need to change **3 lines**. Here they are, explained one by one:

### 🔴 Line 1 — The database URL
```properties
spring.datasource.url=${SPRING_DATASOURCE_URL:jdbc:mysql://localhost:3306/reserveiq?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true}
```
- `localhost:3306` = MySQL runs on your computer at port 3306 (default). **Leave this.**
- `/reserveiq` = the database name. **Change this only if** you named your database differently.
- The `?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true` part **prevents errors** — leave it as is.

### 🔴 Line 2 — Your username
```properties
spring.datasource.username=${SPRING_DATASOURCE_USERNAME:root}
```
- Change `root` only if your MySQL username is different.
- For most installs, `root` is correct.

### 🔴 Line 3 — Your password ⚠️ (most important)
```properties
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD:password}
```
- Replace `password` with **YOUR real MySQL password**.
- Examples:
  - If your MySQL has **no password**: change to `${SPRING_DATASOURCE_PASSWORD:}`
  - If your XAMPP password is `root`: change to `${SPRING_DATASOURCE_PASSWORD:root}`

---

### 🟢 "What does `${ ... }` mean?"

This is the only tricky part. Let me explain with a simple example:

```
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD:password}
                           └──────────────┘ └─────┘
                           environment var    default
```

**Meaning:** *"Use the environment variable `SPRING_DATASOURCE_PASSWORD` if it exists.
If it does NOT exist, use the default value `password`."*

- **For local development:** Just edit the **default value** (after the colon `:`).
  You don't need to touch environment variables at all.
- **For cloud deployment (Railway):** You set environment variables instead, and
  the default values are ignored. That's why this format exists.

> 💡 If the `${...}` syntax confuses you, you can **simplify** the 3 lines to this
> (it works perfectly for local dev):
> ```properties
> spring.datasource.url=jdbc:mysql://localhost:3306/reserveiq?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
> spring.datasource.username=root
> spring.datasource.password=YOUR_PASSWORD_HERE
> ```

---

## 4. Run the Backend

Open a terminal **inside the `backend/` folder** and run:

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### ✅ If successful, you will see in the console:
```
🌱 Seeding ReserveIQ database with sample data...
✅ Database seeded successfully! Demo accounts are ready to log in.
Tomcat started on port 8080 (http)
Started ReserveIQApplication in 5.234 seconds
```

This means:
- ✅ Spring Boot connected to MySQL successfully
- ✅ All tables were created automatically
- ✅ Sample users, restaurants, tables, and reviews were inserted

The backend is now running at **http://localhost:8080**

---

## 5. Test That It Works (Swagger)

Spring Boot includes a built-in **API tester** called Swagger UI.

1. Open your browser → **http://localhost:8080/swagger-ui.html**
2. Find the `POST /api/auth/login` endpoint and click **Try it out**
3. Paste this request body:
   ```json
   {
     "email": "john@example.com",
     "password": "password123"
   }
   ```
4. Click **Execute**
5. If you get a response with a `"token"` field → 🎉 **Your backend + database are working!**

### 🔑 Demo Accounts (already seeded in the database)
| Role | Email | Password |
|------|-------|----------|
| Customer | `john@example.com` | `password123` |
| Manager | `maria@reserveiq.com` | `manager123` |
| Admin | `admin@reserveiq.com` | `admin123` |

---

## 6. Connect the React Frontend

By default, the React app uses **fake mock data** (it works without the backend).
To make it talk to your **real Spring Boot backend**, do this:

### Step A: Create a `.env` file
In the **root folder** (where `package.json` lives — NOT inside `backend/`), create a file named:
```
.env
```
Add this one line inside it:
```env
VITE_API_URL=http://localhost:8080/api
```

### Step B: Restart the frontend
```bash
npm run dev
```

Now the React app will send real requests to your Spring Boot backend. 🎉

> ⚠️ Note: The current frontend service files (`src/services/*.js`) use mock data
> for the demo UI. The Axios instance (`src/services/api.js`) is already configured
> to use `VITE_API_URL` and attach JWT tokens automatically. To fully wire the
> live backend, the service functions need to call `api.get()/api.post()` instead
> of mock arrays.

---

## 7. Troubleshooting Common Errors

### ❌ Error: `Access denied for user 'root'@'localhost'`
**Cause:** Wrong username or password in `application.properties`.
**Fix:** Open MySQL, confirm your credentials, then update Line 2 and Line 3.

### ❌ Error: `Communications link failure`
**Cause:** MySQL server is not running, or wrong port.
**Fix:**
- Make sure MySQL is **started** (XAMPP → click "Start" next to MySQL)
- Confirm port is `3306` (the default)

### ❌ Error: `Unknown database 'reserveiq'`
**Cause:** You forgot to create the database.
**Fix:** Go back to [Step 2](#2-create-the-mysql-database) and create it.

### ❌ Error: `Public Key Retrieval is not allowed`
**Cause:** MySQL 8 authentication security.
**Fix:** Make sure your URL includes `&allowPublicKeyRetrieval=true` (it already does).

### ❌ Error: `The server time zone value is unrecognized`
**Cause:** MySQL timezone not configured.
**Fix:** Make sure your URL includes `&serverTimezone=UTC` (it already does).

### ❌ Login fails (invalid credentials) but app starts fine
**Cause:** You ran the old `init.sql` with fake password hashes.
**Fix:** Delete your database, recreate it empty, and let `DataInitializer.java`
seed it automatically (it uses real BCrypt hashing).

---

## 📁 Project Structure (for reference)

```
backend/
├── pom.xml                          # Maven dependencies
├── README.md                        # ← THIS FILE
└── src/main/
    ├── java/com/reserveiq/
    │   ├── ReserveIQApplication.java       # Main entry point
    │   ├── config/
    │   │   ├── CorsConfig.java             # Allows frontend to connect
    │   │   └── DataInitializer.java        # Auto-seeds demo data
    │   ├── controller/                     # REST API endpoints
    │   ├── service/                        # Business logic
    │   ├── repository/                     # Database access
    │   ├── entity/                         # JPA database tables
    │   ├── dto/                            # Request/response objects
    │   ├── security/                       # JWT + Spring Security
    │   └── exception/                      # Error handling
    └── resources/
        ├── application.properties          # ← YOUR CONFIG (Step 3)
        └── init.sql                        # Just creates the database
```

---

## 🚀 Quick Summary (TL;DR)

1. **Install** Java 21, Maven, MySQL 8
2. **Create** an empty database called `reserveiq`
3. **Edit** `application.properties` → put your MySQL username + password
4. **Run** `mvn spring-boot:run` inside the `backend/` folder
5. **Test** at `http://localhost:8080/swagger-ui.html`
6. **Connect frontend** by creating a `.env` file with `VITE_API_URL=http://localhost:8080/api`

That's it! You now have a full-stack app running. 🎉
