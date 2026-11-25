# Temple Management System (TMS) Backend

A robust, production-ready backend built with Node.js, Express, and MongoDB.

## Features Included
- **Clean Architecture:** Strict separation of Models, Repositories, Services, and Controllers.
- **Production Ready:** Configured with Docker, multi-stage builds, and Winston Logging.
- **Advanced APIs:** Global Pagination, Search, Sorting, and Filtering via `APIFeatures`.
- **Data Integrity:** Mongoose Transactions built into the Counter Sync.

## Quick Start (Docker)

1. Clone the repository and configure `.env` (use `.env.example`).
2. Run the application stack:
   ```bash
   docker-compose up -d --build
   ```

## Local Development & Seeding

If you prefer running locally without Docker:
1. `npm install`
2. Configure `.env` with your `MONGO_URI`.
3. Seed the initial data (Roles, Temples, Counters):
   ```bash
   node seed.js
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

## Postman Collection
Import `TMS_API_Collection.json` into Postman to explore the endpoints.

## Directory Structure
```text
backend/
├── src/
│   ├── config/        # Database and other configuration
│   ├── models/        # Mongoose schema definitions
│   ├── controllers/   # Express route controllers
│   ├── services/      # Business logic
│   ├── repositories/  # Database access layer (Clean Architecture)
│   ├── routes/        # Express routers mapped to controllers
│   ├── middlewares/   # Custom Express middlewares (Auth, Error Handler)
│   ├── validations/   # Joi request validation schemas
│   ├── helpers/       # Helper functions
│   ├── constants/     # Static constants
│   ├── utils/         # Utility functions (Logger, Token Generation)
│   ├── jobs/          # Cron jobs/background tasks
│   ├── templates/     # Email/Receipt templates
│   ├── docs/          # Swagger documentation setup
│   └── app.js         # Express app initialization and middleware mounting
├── server.js          # Node.js server entry point
├── package.json
└── .env.example
```

## Setup & Running

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   Copy `.env.example` to `.env` and fill in your MongoDB URI and secrets.

3. Run in development mode:
   ```bash
   npm run dev
   ```

## Endpoints
- **Health Check:** `GET /api/v1/health`
- **Swagger API Docs:** `GET /api-docs`
