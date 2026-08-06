# User Guide

## Getting Started

1. Start the backend.
2. Start the frontend.
3. Open the landing page in the browser.
4. Sign in as an employee or admin.

## Demo Accounts

- Admin: `admin@smartleave.test` / `Admin123!`
- Employee: `employee@smartleave.test` / `Employee123!`

## Employee Workflow

1. Register or sign in.
2. Open the dashboard.
3. Submit a leave request with a valid future date range.
4. Review leave history and balance.
5. Cancel a pending leave if needed.
6. Edit profile details from the API-supported profile route.

## Admin Workflow

1. Sign in as the admin user.
2. Review the summary dashboard.
3. Inspect employee balances.
4. Open pending leave requests.
5. Approve or reject a request with a review note.
6. Adjust an employee balance if needed.

## Business Rule Examples

- A start date in the past returns a validation error.
- An end date before the start date returns a validation error.
- Overlapping leave requests are rejected.
- Approving a request that would overdraw leave balance is blocked.

## Screenshots

Capture the following manually if required by your submission:

```bash
npm run dev
cd backend && mvn spring-boot:run
```

Suggested screenshots:

- Landing page
- Employee dashboard
- Admin dashboard
- A passing Playwright test run
- A passing backend test run