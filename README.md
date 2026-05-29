# The Production Agent Skill

The Production Agent Skill is a reusable rule framework for AI coding agents. It teaches an agent how to understand a product, ask the right questions, plan deliberately, build production-grade software, verify the work, and keep project memory up to date.

Use it as the stable base layer for your agent behavior. Put project-specific decisions, preferences, and product context in `harness/` so this package can be updated without losing your project rules.

## What It Gives You

- **Production-first execution:** agents consider correctness, security, reliability, observability, performance, maintainability, accessibility, operability, cost, and user experience.
- **360 feature development:** agents look beyond the immediate prompt and surface edge cases, failure modes, negative paths, abuse cases, scale concerns, and future integrations.
- **Better planning:** agents clarify ambiguity, research current framework/library practices, compare options, and lock an implementation plan before high-impact work.
- **Packaged library references:** agents check matching files in `docs/` for in-depth library APIs and capabilities before implementing against supported libraries.
- **Living project memory:** agents maintain PRDs, functional requirements, architecture notes, task history, verdicts, and file maps in a dedicated project guide folder.
- **Safer customization:** teams can override decisions in `harness/verdicts.md` without editing this package.
- **Stack-specific depth:** backend and frontend rules provide focused guidance for production engineering, API contracts, state management, testing, accessibility, and runtime operations.

## Install

Install from the registry when published:

```bash
npm install --save-dev the-production-agent-skill
```

Use a local checkout during development:

```bash
npm install --save-dev /path/to/the-production-agent-skill
```

You can also copy this folder into a repository as `the-production-agent-skill/`, but package installation is preferred because it is easier to update.

## Activate In A Project

Add this to your `AGENTS.md`, `.cursorrules`, Codex instructions, or equivalent agent rule file:

```markdown
Prior to initiating any coding task, you must first access, read and strictly comply with all requirements outlined in `node_modules/the-production-agent-skill/instructions.md`. This file serves as the official operational directive for the AI coding agent and must be followed in its entirety without omission. After completing the review of the core guide, proceed to load and integrate all project-specific rules contained within the `harness/` directory. All rules specified in both the core guide and project-specific guides are binding contractual requirements that must be fully adhered to in all applicable scenarios. Under no circumstances may any rule be skipped, disregarded, or incompletely implemented. You are required to validate compliance with every relevant rule before executing any coding work and during first review  to ensure full alignment with the established standards.
```

If you copied the guide into the repository instead of installing it, use:

```markdown
Prior to initiating any coding task, you must first access, read and strictly comply with all requirements outlined in `the-production-agent-skill/instructions.md`. This file serves as the official operational directive for the AI coding agent and must be followed in its entirety without omission. After completing the review of the core guide, proceed to load and integrate all project-specific rules contained within the `harness/` directory. All rules specified in both the core guide and project-specific guides are binding contractual requirements that must be fully adhered to in all applicable scenarios. Under no circumstances may any rule be skipped, disregarded, or incompletely implemented. You are required to validate compliance with every relevant rule before executing any coding work and during first review  to ensure full alignment with the established standards.
```

The CLI can print this snippet:

```bash
npx the-production-agent-skill snippet
```

## Project Setup

Create the project-specific guide scaffold:

```bash
npx the-production-agent-skill init
```

The command is non-destructive. It creates missing files only and never overwrites your existing project rules.

Required downstream files:

- `harness/PRD.md`
- `harness/FRD.md`
- `harness/Non-FRD.md`
- `harness/constraints.md`
- `harness/git-workflow.md`
- `harness/architectural-guide.md`
- `harness/project-guide.md`
- `harness/verdicts.md`
- `harness/mcp-rules.md`
- `harness/tasks.md`
- `harness/development-history.md`
- `harness/files-directories.md`
- `harness/backend-handbook.md`
- `harness/frontend-handbook.md`
- `harness/environments-cloud-deployments.md`
- `harness/prompt-template.md`
- `scripts/supply-chain-audit.mjs`

Check a project at any time:

```bash
npx the-production-agent-skill doctor
```

The scaffolded `scripts/supply-chain-audit.mjs` is intended for the project vulnerability test run. Add scripts like these to the downstream project `package.json` when they fit the local test workflow:

```json
{
  "scripts": {
    "security:supply-chain": "node scripts/supply-chain-audit.mjs",
    "security:supply-chain:fix": "node scripts/supply-chain-audit.mjs --fix",
    "test:vulnerability": "npm run security:supply-chain"
  }
}
```

The script checks reproducible installs, dependency specs, `npm audit`, install-time package scripts, and suspicious dependency behavior indicators. Use `--socket` when the project has approved Socket-style package behavior scanning; Socket documents `socket ci` for CI policy checks at https://docs.socket.dev/docs/socket-ci.

## Expected Agent Behavior

After activation, expect the agent to be more deliberate. It may ask more questions, especially for requirements, non-functional needs, constraints, scale, security, deployment, observability, and unclear edge cases.

For larger tasks, the agent should:

1. Load base and harness rules.
2. Classify the task as backend, frontend, full-stack, QA, infrastructure, documentation, or browser/computer-use.
3. Read the relevant code, living docs, and matching packaged `docs/` library reference files before acting.
4. Clarify ambiguous intent and surface useful feature improvements.
5. Research current library/framework practices when useful or when no matching packaged docs file exists.
6. Propose a plan with options and tradeoffs, including reusable open-source or standards-based options when complex rules or architecture patterns are involved.
7. Include the chosen approach, expected system structure, engineering norms, safeguards, non-functional assumptions, and a table of planned tests for meaningful work.
8. Implement with production-grade architecture, tests, telemetry, and docs.
9. Run a final cross-check for regressions, security, accessibility, reliability, supply-chain risk, and product fit.
10. Update living docs and provide a concise review with test results, system impact, side effects, rollback notes, and critical code paths for human review.

This behavior is intentional. The goal is not just to make code work, but to make the product safer, clearer, and easier to evolve.

## Customization

Do not edit files inside this package for project-specific behavior. Add decisions and overrides to `harness/`.

Use `harness/verdicts.md` as the persistent settings and conflict-resolution file. Examples:

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
- `docs/`: packaged library API and capability references, such as NestJS and TypeORM.
- `scripts/supply-chain-audit.mjs`: dependency vulnerability and supply-chain behavior check scaffolded into downstream projects by `init`.

## Publishing

Dry-run the package before publishing:

```bash
npm run publish:dry-run
```

Inspect package contents:

```bash
npm run pack
```
