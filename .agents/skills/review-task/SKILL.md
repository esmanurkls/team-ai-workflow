---
name: review-task
description: Perform an independent red-team review of a task diff against its goal, risks, tests, and existing contracts.
---

# Review task

Review the active task as an independent adversary. Prefer a fresh context and, when practical, a different AI tool.

1. Read `brief.md`, `plan.md`, and the current diff.
2. Check acceptance criteria, edge cases, error paths, security boundaries, compatibility, and test quality.
3. Look for accidental scope expansion, missing migrations, secret exposure, and false confidence from weak tests.
4. Record every finding with severity `P0`–`P3`, evidence, impact, and a concrete recommendation.
5. If no finding exists, list the surfaces reviewed and remaining uncertainty.
6. Write only `.ai/runs/TASK-*/redteam-review.md`; do not modify product code during this wave.
