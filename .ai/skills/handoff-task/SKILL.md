---
name: handoff-task
description: Produce a concise, evidence-based handoff so another person or AI tool can continue a task safely.
---

# Handoff task

Read the task artefacts and current diff, then write `handoff.md` with:

- goal and current status (exactly one status value in backticks);
- decisions made and why;
- changed files;
- tests and verification evidence;
- red-team findings and disposition;
- unresolved questions, risks, and blockers;
- the exact recommended next action.

Before setting the status to `verified` or `done`, run `npm run validate -- TASK-001`; it must pass.

A handoff must be understandable without access to the previous chat.
