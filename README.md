# Smart Leave Approval & Employee Management System

Production-style internship assessment project built with Java 21, Spring Boot, Spring Security, Spring Data JPA, React, Vite, Tailwind CSS, JWT, JUnit, Mockito, Playwright, and Markdown documentation.

## What is included

- Employee registration, login, profile editing, leave application, leave history, and leave balance viewing
- Admin login, dashboard, employee listing, leave approval/rejection, and leave balance adjustment
- JWT-based authentication and role-based authorization
- Validation and global error handling
- JUnit and Mockito backend unit tests
- Playwright browser automation tests
- Assessment checklist and validation evidence
- Architecture, design, user guide, presentation content, and demo script

## Repository Layout

- `backend/` Spring Boot API
- `src/` React + Vite frontend
- `tests/` Playwright tests
- `docs/` assessment documentation and evidence

## Prerequisites

- Java 21
- Maven 3.9+
- Node.js 20+
- Optional for MySQL runtime: Docker Desktop or a local MySQL 8.4 server

## Run the backend

The default profile uses H2 so the repository runs cleanly in a local assessment environment.

```bash
cd backend
mvn test
mvn spring-boot:run
```

The API runs at `http://localhost:8080`.

### MySQL runtime path

If you want the MySQL profile instead of H2:

```bash
docker compose up -d mysql
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=mysql
```

Update `SMARTLEAVE_DB_USERNAME`, `SMARTLEAVE_DB_PASSWORD`, and `SMARTLEAVE_JWT_SECRET` if needed.

## Run the frontend

```bash
npm install
npm run dev
```

The UI runs at `http://localhost:5173`.

## Test commands

```bash
cd backend
mvn test

cd ..
npx playwright test
```

## Seeded demo users

- Admin: `admin@smartleave.test` / `Admin123!`
- Employee: `employee@smartleave.test` / `Employee123!`

## Assessment evidence

- Green backend unit test run: `docs/evidence/GreenRun.md`
- Red backend unit test run: `docs/evidence/RedRun.md`
- Validation evidence: `docs/evidence/RedRun.md` and `docs/evidence/GreenRun.md`

## Notes

- The default backend profile uses H2 for repeatable local execution.
- The MySQL profile and Docker Compose path are included so the project still satisfies the database requirement.
- Screenshot capture is a manual step; the exact commands are documented in `docs/UserGuide.md`.