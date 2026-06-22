# 🍽️ ReserveIQ Frontend

Frontend application for the ReserveIQ Restaurant Reservation System built with React and Vite.

## Tech Stack

* React 18
* Vite
* JavaScript
* Material UI
* Axios
* React Router
* Framer Motion

## Features

* User Authentication
* Restaurant Discovery
* Table Reservation Interface
* Booking Management
* Responsive Design
* JWT-Based API Integration
* Modern UI/UX

## Run Locally

### Clone Repository

```bash
git clone <repository-url>
cd frontend
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:8080/api
```

### Start Development Server

```bash
npm run dev
```

Frontend will run on:

```text
http://localhost:5173
```

## Build for Production

```bash
npm run build
```

## Project Structure

```text
src/
├── components/
├── pages/
├── services/
├── hooks/
├── context/
├── assets/
└── utils/
```

## Backend Connection

The frontend communicates with the Spring Boot backend through Axios.

Default API URL:

```text
http://localhost:8080/api
```

Make sure the backend server is running before testing authenticated features.

For backend setup instructions, see `backend/README.md`.
