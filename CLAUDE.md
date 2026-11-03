@AGENTS.md

# WAQT — Men's Watch Store

Frontend-only Next.js 16 / React 19 / Sass storefront in its design phase. There is no
backend. Dev server: `npm run dev` on **port 3002**. Checks: `npm run lint`,
`npx tsc --noEmit`, `npm run build`.

## Project memory (mandatory)

The persistent project memory is these four files at the repo root:

- `HANDOFF.md`: everything another agent needs to continue (objective, status, decisions,
  environment, bugs, blockers, next step). Comprehensive.
- `PROJECT_STATUS.md`: milestone, completed, in-progress and pending features; test, build
  and deploy status; recent progress. Concise.
- `ARCHITECTURE.md`: structure, components, state, data model, conventions, design decisions
  and why they were made.
- `TODO.md`: prioritized tasks, each with Priority (High/Medium/Low), Status
  (Pending/In Progress/Blocked/Done), description and notes.

**Before starting work:** read all four, understand the current state, continue from the
existing implementation and don't redo finished work. If they conflict, trust in this order:
source code, then ARCHITECTURE.md, then PROJECT_STATUS.md, then HANDOFF.md, then TODO.md.

**While working:** whenever you implement a feature, fix a bug, refactor, change the
architecture, find an issue or finish a milestone, update the relevant files right away. Don't
save it for the end of the session.

**Before finishing any meaningful task**, update:

- HANDOFF.md if project knowledge changed
- PROJECT_STATUS.md if progress changed
- ARCHITECTURE.md if architecture changed
- TODO.md if tasks changed

Remove a finished task from TODO.md only after recording it in PROJECT_STATUS.md. Another
agent must be able to continue from these files without this conversation.

## Rules

- Never delete the memory files (`HANDOFF.md`, `PROJECT_STATUS.md`, `ARCHITECTURE.md`,
  `TODO.md`).
- Never commit changes. The user commits.
- Never run commands that modify a database or production environment without explicit
  instructions.
- Never run create, update or delete commands against Azure, Firebase, GCloud or any other
  production service without explicit instructions.
- If you write a test file to check a task, delete it when the task is done, and never commit
  test files.
- For reasoning, follow `reasoning-operating-manual.md`. _(This file is not in the repo yet. Ask
  the user for it if it is needed.)_
