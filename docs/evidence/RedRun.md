# Red Test Evidence

## Deliberate Backend Failure

Command:

```bash
cd backend
mvn test
```

What was changed:

- A temporary bug was introduced in `LeaveService.validateRequestDates` by reversing the past-date check.

Observed failure:

- `LeaveServiceTest.applyLeaveRejectsPastDates` failed because the validation error was raised for the wrong date direction.
- `LeaveServiceTest.applyLeaveSavesPendingRequest` failed because future leave requests were incorrectly blocked.

Outcome:

- The bug was fixed immediately after the red run.
- The same test suite was rerun and passed.

## Environment Failure During Playwright Setup

Command:

```bash
npx playwright test
```

Observed failure:

- Chromium was not installed yet.

Outcome:

- Installed Chromium with `npx playwright install chromium`.
- Re-ran the same suite successfully.
