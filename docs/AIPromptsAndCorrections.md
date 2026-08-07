# AI Prompts and Corrections

This document records the AI-assisted work done in this workspace. It captures the prompts that drove the changes and the concrete corrections that were applied across the backend, frontend, docs, and deployment setup.

## Prompts Used

- Create a living Assessment Checklist.
- Generate the entire project at once.
- Run this code on local web.
- Fix the unexpected error shown while applying for leave.
- Make two separate pages, one for dashboard and one for leave history.
- Remove unnecessary files, images, and emojis that make the project look AI-generated.
- Add a GitHub Actions workflow so the website can be deployed live.
- Put all the AI changes into this document.

## Corrections Made

### Backend behavior

- Fixed the leave history read path so it no longer throws a 500 during refresh.
- Kept the leave request validation rules intact for past dates, reverse ranges, duplicates, and balance checks.
- Preserved the transactional boundaries on the service layer so lazy-loaded relations are resolved safely.
- Kept the API and entity structure stable while refining the implementation to support the UI flow.

### Frontend structure and routing

- Separated the employee dashboard and leave history into distinct routes and pages.
- Kept `/dashboard` focused on applying leave and editing the profile.
- Moved leave history, cancel actions, and summary cards into `/dashboard/leaves`.
- Updated the app router bootstrap to respect the Vite base path for static hosting.
- Simplified the landing page so it feels less like generated demo UI and more like a normal product page.
- Removed decorative iconography that made the interface look synthetic.

### Build and tooling fixes

- Fixed the backend Maven XML parsing issue caused by an unescaped ampersand in the project description.
- Corrected the MySQL connector dependency coordinate so Maven could resolve the runtime driver.
- Removed the legacy PostCSS config so Tailwind 4 could work with the Vite plugin path.
- Installed the Playwright Chromium browser after the first browser test setup failed because the binary was missing.
- Restored local dependencies after cleanup so the app could still run and build locally.

### Documentation cleanup

- Removed AI-specific evidence docs and replaced them with cleaner validation references.
- Removed generated output such as `dist` and `test-results` while preserving the source tree.
- Removed references that made the repository look like an AI demo instead of a project submission.
- Added this document to keep the AI prompt-to-correction trail in one place.

### Deployment work

- Added `.github/workflows/deploy.yml` for GitHub Pages deployment of the website.
- Configured the build to use the repository base path for Pages hosting.
- Added a `404.html` fallback so browser refreshes on client-side routes still resolve correctly.

## Validation Performed

- Verified the frontend builds successfully after the routing and deployment changes.
- Verified the backend unit tests pass with `mvn test`.
- Confirmed the local web app runs and loads the employee dashboard in the browser.

## Notes

- This file is intentionally focused on the AI-driven changes, not every minor edit in the repository.
- The goal is to preserve project integrity while making the provenance of the major changes clear.