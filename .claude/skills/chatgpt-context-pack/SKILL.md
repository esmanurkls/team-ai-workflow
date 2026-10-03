---
name: chatgpt-context-pack
description: Prepare a compact, redacted task context bundle for independent planning, research, or review in a chat assistant.
---

# ChatGPT context pack

Use `npm run context-pack -- TASK-001` after the task has a brief or meaningful progress.

The generated pack contains the shared workflow, the project context, and the task artefacts. Decisions are included only when selected: `npm run context-pack -- TASK-001 --decisions ADR-001,ADR-003`. Known credential formats are redacted automatically, but review the pack before sharing it. Do not add secrets, credentials, private personal data, or unrelated repository files.

The external chat is an advisory surface. Apply its suggestions only after checking them against the repository, task scope, and human owner decisions.
