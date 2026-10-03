---
name: verify-task
description: Run the repository's relevant checks and record reproducible evidence for a task.
---

# Verify task

1. Read the task acceptance criteria and red-team report.
2. Take the format, lint, test, and build commands from `.ai/PROJECT.md`; discover them from the repository only if that file does not list them, and report the gap.
3. Run the smallest set that proves the changed behavior; expand checks when risk warrants it.
4. Record exact commands, exit status, relevant output, and environment assumptions in `verification.md`.
5. Mark any unrun check as a gap; never invent a successful result.
6. Run `npm run validate -- TASK-001` and record its result. In the light tier, write the evidence into the `Commands run` table of `changes.md`.

Verification does not replace human review or red-team analysis.
