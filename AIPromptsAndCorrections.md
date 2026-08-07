# AI Prompts and Corrections

This document records the user prompts that drove the AI-assisted work in this workspace and the main corrections applied in response.

## Prompts Used

- Create a living Assessment Checklist.
- Generate the entire project at once.
- Run this code on local web.
- Fix the unexpected error shown while applying for leave.
- Make two separate pages, one for dashboard and one for leave history.
- Remove unnecessary files, images, and emojis that make the project look AI-generated.

## Corrections Made

- Separated the employee dashboard and leave history into distinct routes and pages.
- Fixed the leave history read path so it no longer throws a 500 during refresh.
- Kept the backend and frontend structure intact while removing only generated artifacts.
- Removed decorative iconography and other presentation details that made the UI feel overly generated.
- Deleted AI-specific evidence docs and replaced them with cleaner validation references.
- Removed generated output such as `dist` and `test-results` while preserving the source tree.
- Restored local dependencies after the cleanup step to keep the app runnable in the browser.

## Notes

- This file is intentionally descriptive rather than exhaustive.
- It is meant to document the prompt-to-correction trail without changing project behavior.