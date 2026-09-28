---
name: verify-task
description: Run the repository's relevant checks and record reproducible evidence for a task.
---

# Verify task

1. Read the task acceptance criteria and red-team report.
2. Discover the repository's existing format, lint, unit, integration, build, or domain checks.
3. Run the smallest set that proves the changed behavior; expand checks when risk warrants it.
4. Record exact commands, exit status, relevant output, and environment assumptions in `verification.md`.
5. Mark any unrun check as a gap; never invent a successful result.

Verification does not replace human review or red-team analysis.
