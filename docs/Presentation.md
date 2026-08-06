# Presentation Content

## Slide 1 - Title

- Smart Leave Approval & Employee Management System
- Internship assessment submission
- Java 21, Spring Boot, React, JWT, JPA, Playwright

## Slide 2 - Problem Statement

- Teams need a structured leave workflow
- Manual approvals create delays and errors
- Employees need self-service visibility into balance and history
- Admins need a reliable approval and audit flow

## Slide 3 - Solution Overview

- Secure employee registration and login
- Leave application with validation and duplicate prevention
- Admin approval/rejection with balance enforcement
- Unified dashboard experience for both roles

## Slide 4 - Architecture

- React/Vite frontend
- Spring Boot REST API
- JPA repository layer
- Service layer for business rules
- JWT stateless security

## Slide 5 - Technology Stack

- Java 21
- Spring Boot 3
- Spring Security
- Spring Data JPA
- MySQL runtime profile
- React, Vite, Tailwind CSS
- JUnit, Mockito, Playwright

## Slide 6 - AI Tools Used

- GitHub Copilot for generation, refactoring, and evidence documentation
- Playwright for browser automation coverage
- No other AI tool was used in this workspace session

## Slide 7 - Testing Strategy

- JUnit and Mockito for service-layer rules
- Playwright for employee and admin flows
- Happy paths, edge cases, and invalid inputs covered
- Backend and frontend build validation included

## Slide 8 - AI Change Loop

- Implemented the application from the assessment brief
- Ran backend tests and frontend build
- Fixed dependency and build issues
- Introduced one deliberate bug for red/green evidence
- Repaired the bug and reran the same tests successfully

## Slide 9 - Challenges

- Tailwind 4 build configuration mismatch
- Playwright browser binary installation requirement
- Ensuring leave rules stayed consistent across backend and UI

## Slide 10 - Future Improvements

- Add pagination and filters to leave history
- Add email notifications for leave decisions
- Add audit export/reporting
- Add manager-level approval tiers