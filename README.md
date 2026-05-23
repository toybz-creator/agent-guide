# Production Coding Agent Skill Guide

Production Coding Agent Skill Guide is a reusable rule framework for AI coding agents. It teaches an agent how to understand a product, ask the right questions, plan deliberately, build production-grade software, verify the work, and keep project memory up to date.

Use it as the stable base layer for your agent behavior. Put project-specific decisions, preferences, and product context in `custom-agent-guide/` so this package can be updated without losing your custom rules.

## What It Gives You

- **Production-first execution:** agents consider correctness, security, reliability, observability, performance, maintainability, accessibility, operability, cost, and user experience.
- **360 feature development:** agents look beyond the immediate prompt and surface edge cases, failure modes, negative paths, abuse cases, scale concerns, and future integrations.
- **Better planning:** agents clarify ambiguity, research current framework/library practices, compare options, and lock an implementation plan before high-impact work.
- **Living project memory:** agents maintain PRDs, functional requirements, architecture notes, task history, verdicts, and file maps in a dedicated project guide folder.
- **Safer customization:** teams can override decisions in `custom-agent-guide/verdicts.md` without editing this package.
- **Stack-specific depth:** backend and frontend rules provide focused guidance for production engineering, API contracts, state management, testing, accessibility, and runtime operations.

## Install

Install from the registry when published:

```bash
npm install --save-dev production-coding-agent-skill-guide
```

Use a local checkout during development:

```bash
npm install --save-dev /path/to/production-coding-agent-skill-guide
```

You can also copy this folder into a repository as `agent-guide/`, but package installation is preferred because it is easier to update.

## Activate In A Project

Add this to your `AGENTS.md`, `.cursorrules`, Codex instructions, or equivalent agent rule file:

```markdown
Before every task, read and follow `node_modules/production-coding-agent-skill-guide/instructions.md`.

This file is the director for the AI coding agent. Follow it strictly, then load any project-specific rules from `custom-agent-guide/`.
```

If you copied the guide into the repository instead of installing it, use:

```markdown
Before every task, read and follow `agent-guide/instructions.md`.

This file is the director for the AI coding agent. Follow it strictly, then load any project-specific rules from `custom-agent-guide/`.
```

The CLI can print this snippet:

```bash
npx agent-guide snippet
```

## Project Setup

Create the project-specific guide scaffold:

```bash
npx agent-guide init
```

The command is non-destructive. It creates missing files only and never overwrites your existing project rules.

Required downstream files:

- `custom-agent-guide/PRD.md`
- `custom-agent-guide/FRD.md`
- `custom-agent-guide/Non-FRD.md`
- `custom-agent-guide/architectural-guide.md`
- `custom-agent-guide/project-guide.md`
- `custom-agent-guide/verdicts.md`
- `custom-agent-guide/mcp-rules.md`
- `custom-agent-guide/tasks.md`
- `custom-agent-guide/development-history.md`
- `custom-agent-guide/files-directories.md`
- `custom-agent-guide/backend-handbook.md`
- `custom-agent-guide/frontend-handbook.md`
- `custom-agent-guide/environments-cloud-deployments.md`

Check a project at any time:

```bash
npx agent-guide doctor
```

## Expected Agent Behavior

After activation, expect the agent to be more deliberate. It may ask more questions, especially for requirements, non-functional needs, scale, security, deployment, observability, and unclear edge cases.

For larger tasks, the agent should:

1. Load base and custom rules.
2. Classify the task as backend, frontend, full-stack, QA, infrastructure, documentation, or browser/computer-use.
3. Read the relevant code and living docs before acting.
4. Clarify ambiguous intent and surface useful feature improvements.
5. Research current library/framework practices when useful.
6. Propose a plan with options and tradeoffs.
7. Implement with production-grade architecture, tests, telemetry, and docs.
8. Run a final cross-check for regressions, security, accessibility, reliability, and product fit.
9. Update living docs and provide a concise review with test instructions.

This behavior is intentional. The goal is not just to make code work, but to make the product safer, clearer, and easier to evolve.

## Customization

Do not edit files inside this package for project-specific behavior. Add decisions and overrides to `custom-agent-guide/`.

Use `custom-agent-guide/verdicts.md` as the persistent settings and conflict-resolution file. Examples:

- whether linting/formatting hooks should be configured
- preferred observability provider
- whether web research should be automatic, optional, or disabled
- architecture decisions that override a default guide rule
- deployment and environment assumptions

When package rules conflict with project rules, the agent should ask for a decision once, record the final choice in `verdicts.md`, and follow that verdict in future tasks.

## Included Rule Files

- `instructions.md`: base framework and task lifecycle.
- `backend/backend-rules.md`: backend and service engineering rules.
- `frontend/frontend-rules.md`: frontend and product interface engineering rules.
- `computer-use/computer-use-agent-rules.md`: browser/computer-use safety guidance.

## Publishing

Dry-run the package before publishing:

```bash
npm run publish:dry-run
```

Inspect package contents:

```bash
npm run pack
```
