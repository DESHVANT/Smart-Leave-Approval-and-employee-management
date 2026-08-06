# Architecture Document

## System Overview

The application is a two-tier monorepo with a Spring Boot backend and a React/Vite frontend. The backend exposes REST endpoints for authentication, employee self-service, and admin approval workflows. The frontend consumes the API and handles routing, forms, and role-based screens.

## Backend Architecture

- `controller` handles HTTP requests and request validation entry points
- `service` enforces business rules and transaction boundaries
- `repository` encapsulates persistence access through Spring Data JPA
- `dto` isolates API contracts from persistence models
- `model` holds JPA entities and enums
- `config` contains JWT, security, and application configuration
- `exception` centralizes validation and runtime error mapping

## Frontend Architecture

- `AuthContext` manages token and user state in local storage
- `ProtectedRoute` enforces UI-level access control
- `Shell` provides authenticated navigation and layout
- `pages` contain the main route-specific screens
- `services/http.js` provides a single Axios client with JWT injection

## Data Flow

1. The user signs in or registers through the frontend.
2. The backend authenticates the user and returns a JWT plus profile metadata.
3. The frontend stores the token and sends it with each API request.
4. Employee requests are validated, persisted, and later reviewed by admins.
5. Admin approvals can deduct leave balance and record review metadata.

## Security Model

- JWT stateless authentication
- Role-based authorization for admin endpoints
- Server-side validation on all request DTOs
- Password hashing with BCrypt
- Global exception handling to avoid leaking stack traces

## Runtime Notes

- Default local profile uses H2 for repeatable development and assessment execution.
- MySQL configuration is included for the database requirement and production-style execution.