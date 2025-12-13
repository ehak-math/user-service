# User Service

A **Node.js REST API** for user management, built with Express and MongoDB.  
This service handles user registration, login, token verification, and CRUD operations on users. It is designed to be **dockerized** for easy deployment and comes with **Jest + Supertest tests**.

---

## Features

- User registration with unique email
- User login with JWT authentication
- Token verification endpoint
- Error handling and input validation
- Docker support for local and production environments
- In-memory MongoDB for testing (Jest + Supertest)

---

## Technologies Used

- **Node.js** & **Express**
- **MongoDB** & **Mongoose**
- **Jest** & **Supertest** for testing
- **Docker** for containerization
- **Helmet**, **CORS**, **Morgan** for security and logging

---

## Run locally (without Docker)
1. Copy `.env.example` → `.env` and fill values.
2. `npm install`
3. `npm start`
4. Service runs at `http://localhost:4001`

---

## Run with Docker (local)
- build docker compos
```
docker compos up build
```
---

## Endpoints
- `POST /users/register` — { name, email, password }
- `POST /users/login` — { email, password } → { token, user }
- `GET /users/:id` — get user detail
- `POST /users/verify` — accepts `Authorization: Bearer <token>` or `{ token }` body

## Notes
- Keep `JWT_SECRET` safe.
- This repo is intended to be one microservice repo among others (movie-service, booking-service).
