# Design Document

## Domain Model

### User

Represents an employee or administrator. Stores identity, role, department, position, contact details, active flag, password hash, and leave balance.

### LeaveRequest

Represents a leave application with start and end dates, requested days, status, review note, timestamps, and reviewer reference.

## Core Rules

- Employees cannot request leave in the past.
- End date must be on or after the start date.
- The system blocks overlapping or duplicate leave requests.
- Leave balance is decremented only when an admin approves a request.
- Approval is rejected if the resulting balance would be negative.

## API Design

### Authentication

- `POST /api/auth/register`
- `POST /api/auth/login`

### Employee

- `GET /api/employee/profile`
- `PUT /api/employee/profile`
- `GET /api/employee/dashboard`
- `GET /api/employee/leaves`
- `POST /api/employee/leaves`
- `PATCH /api/employee/leaves/{id}/cancel`

### Admin

- `GET /api/admin/dashboard`
- `GET /api/admin/employees`
- `GET /api/admin/leaves`
- `PATCH /api/admin/leaves/{id}/approve`
- `PATCH /api/admin/leaves/{id}/reject`
- `PATCH /api/admin/employees/{id}/balance`

## Validation Strategy

- DTO annotations handle input shape and required fields.
- The service layer performs domain validation that cannot be expressed in annotations alone.
- The global exception handler converts failures into clear API responses.

## Test Strategy

- JUnit and Mockito cover authentication and leave-rule enforcement in the backend.
- Playwright covers the employee and admin browser flows.
- One deliberate red/green loop is documented in the evidence files.