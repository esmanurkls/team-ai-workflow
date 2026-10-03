---
name: plan-task
description: Define a bounded task, acceptance criteria, risks, and a verification plan before implementation.
---

# Plan task

Use this skill at the start of a meaningful task or when the scope changes.

1. Read `.ai/PROJECT.md`. If the task folder does not exist, create it with `npm run new-task -- TASK-001` (add `--light` only for a small, easily reverted change in one module).
2. Read the task brief and inspect only the files needed to understand the change.
3. State the goal, non-goals, constraints, assumptions, and acceptance criteria.
4. Identify affected files, interfaces, tests, and likely risks.
5. Propose the smallest coherent implementation plan.
6. Record the plan in `.ai/runs/TASK-*/plan.md`. In the light tier there is no `plan.md`; keep the plan in the brief's scope and acceptance criteria.

Do not implement while the scope, owner, or acceptance criteria are materially unclear. Ask one focused question or record the uncertainty and stop at the planning boundary.
