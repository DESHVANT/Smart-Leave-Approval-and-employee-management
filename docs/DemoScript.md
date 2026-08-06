# Demo Script

## First 2 Minutes

"Hi, I’m demonstrating the Smart Leave Approval & Employee Management System. This project solves a common operational problem: employees need a simple way to request leave, and admins need a secure, auditable workflow to review it."

"The stack is Java 21 with Spring Boot, Spring Security, Spring Data JPA, and Maven on the backend. The frontend is React with Vite and Tailwind CSS. Authentication is JWT-based, and automated coverage is provided with JUnit, Mockito, and Playwright."

"I kept the project focused on the actual product workflow, validation evidence, and maintainable implementation rather than a tutorial-style demo."

## Final 3 Minutes

"Here is the landing page and the login flow. I can sign in as an employee or admin using seeded demo accounts. Once authenticated, the UI switches to the role-appropriate dashboard."

"On the employee side, I can see my balance, submit a leave request, review history, and cancel a pending request. The backend blocks past dates, reverse date ranges, overlapping requests, and invalid inputs."

"On the admin side, I can review employee records, see pending requests, approve or reject leave, and adjust leave balances. Approval deducts balance only when it remains non-negative."

"For automation, I have JUnit and Mockito unit tests for the service layer and Playwright tests for browser flows. I also captured a deliberate failing test run and then fixed it to show the AI change loop honestly."

"The final run is green: backend tests pass, the frontend builds successfully, and Playwright browser tests pass. This gives me both code confidence and evidence for the assessment submission."

## Narration Notes

- Speak slowly during the feature walkthrough so the audience can read the UI.
- Pause briefly before showing the test evidence.
- If recording live, show the backend test output first, then the browser test output, then the dashboards.