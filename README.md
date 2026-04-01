# Cars API - Back-End

A RESTful API for a car rental platform built with Node.js, Express, and MongoDB.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express 5
- **Database:** MongoDB + Mongoose
- **Auth:** JWT + bcryptjs
- **File Uploads:** Multer
- **Security:** Helmet, express-rate-limit, HPP, mongo-sanitize, xss-clean

## Getting Started

### Prerequisites

- Node.js
- MongoDB

### Installation

```bash
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/cars_db
NODE_ENV=development
```

### Running the Server

```bash
# Development
npm run dev

# Production
npm start
```

### Seed the Database

```bash
npm run seed
```

### Tests

```bash
npm test
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/cars` | Get all cars |
| POST | `/api/cars` | Add a car (admin) |
| GET | `/api/cars/:id` | Get car by ID |
| PUT | `/api/cars/:id` | Update a car (admin) |
| DELETE | `/api/cars/:id` | Delete a car (admin) |
| GET | `/api/reservations` | Get reservations |
| POST | `/api/reservations` | Create a reservation |

## Project Structure

```
├── config/         # Database connection
├── controllers/    # Route handlers
├── middleware/     # Auth, validation, error handling, uploads
├── models/         # Mongoose schemas
├── routes/         # Express routers
├── uploads/        # Uploaded car images
├── tests/          # Jest tests
├── app.js          # Express app setup
└── server.js       # Entry point
```
