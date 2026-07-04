# The Production Agent Skill

The Production Agent Skill is a reusable rule framework for AI coding agents. It teaches an agent how to understand a product, ask the right questions, plan deliberately, build production-grade software, verify the work, and keep project memory up to date.

Use it as the stable base layer for your agent behavior. Put project-specific decisions, preferences, and product context in `harness/` so this package can be updated without losing your project rules.

## What It Gives You

- **Production-first execution:** agents consider correctness, security, reliability, observability, performance, maintainability, accessibility, operability, cost, and user experience.
- **360 feature development:** agents look beyond the immediate prompt and surface edge cases, failure modes, negative paths, abuse cases, scale concerns, and future integrations.
- **Better planning:** agents clarify ambiguity, research current framework/library practices, compare options, and lock an implementation plan before high-impact work.
- **Packaged library references:** agents check matching files in `docs/` for in-depth library APIs and capabilities before implementing against supported libraries.
- **Development arsenal:** agents scan a packaged catalog of proven tools, compare candidates against the current stack and a no-new-tool option, then fully install, configure, document, and verify only the tools that materially improve the product outcome.
- **Living project memory:** agents maintain PRDs, functional requirements, architecture notes, runbooks, deployment/CI/workflow books, dictionaries, incident and observability books, task history, verdicts, and file maps in a dedicated project guide folder.
- **Feature-level docs:** substantial features get their own `harness/features/<feature-name>/` folders with PRD, FRD, SystemsArchitecture, tasks, workflow, runbook, observability, and decision docs.
- **Strictness levels:** projects can choose `advisory`, `standard`, or `strict` in `harness/verdicts.md`; strict mode requires full precautions, docs, KPI capture, tests, security review, rollout/rollback notes, and explicit risk acceptance for skipped safeguards.
- **KPI-driven architecture:** agents ask for endpoint hit rates, latency, database/query budgets, queue volume, availability, observability, and growth targets, then plan code and infrastructure toward those targets.
- **Skill commands:** agents treat commands such as `pag-review`, `pag-optimise`, `pag-security`, `pag-deployment`, `pag-guide`, `pag-automations`, and `pag-git-assist- ...` as binding workflows loaded from `harness/skills.md` and `harness/skills/`.
- **Automation recommendations:** the `recommend` CLI command and `pag-automations` skill suggest skills, plugins, hooks, monitors, CI checks, alerts, and agent-specific setup for Codex, Claude, Cursor, Antigravity, and similar tools.
- **Harness growth command:** agents treat `Update harness` as a binding workflow to refresh project memory, cache important official library docs, strengthen local instructions, and add useful automation.
- **Safer customization:** teams can override decisions in `harness/verdicts.md` without editing this package.
- **Stack-specific depth:** backend, web frontend, and React Native/Expo rules provide focused guidance for production engineering, API contracts, state management, testing, accessibility, native platforms, app stores, and runtime operations.

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
Prior to initiating any coding task, you must first access, read and strictly comply with all requirements outlined in `node_modules/the-production-agent-skill/instructions.md`. This file serves as the official operational directive for the AI coding agent and must be followed in its entirety without omission. After completing the review of the core guide, proceed to load and integrate all project-specific rules contained within the `harness/` directory. All rules specified in both the core guide and project-specific guides are binding contractual requirements that must be fully adhered to in all applicable scenarios. Under no circumstances may any rule be skipped, disregarded, or incompletely implemented. You are required to validate compliance with every relevant rule before executing any coding work and during first review to ensure full alignment with the established standards. When the user sends a skill command such as `pag-review`, `pag-optimise`, `pag-security`, `pag-deployment`, `pag-guide`, `pag-discovery`, `pag-compare`, `pag-shield`, `pag-idea`, `pag-automations`, or `pag-git-assist- {{git-command:with_options}}`, you must follow the `Skill Commands` workflow in `instructions.md`: read `harness/skills.md`, verify and read the referenced file in `harness/skills/`, ask required preflight questions, and execute the skill workflow as binding guidance. When the user says `Update harness` or a clear variant, you must follow the `Update Harness Command` workflow in `instructions.md`: inspect the project and harness, brief the user on planned updates, wait for agreement, update this harness library to the latest allowed version when package-managed, update project memory, cache important official library documentation, strengthen local agent instructions, add useful automation where appropriate, keep skill registry and skill files synchronized, verify the changes, and provide a comprehensive report.
```

If you copied the guide into the repository instead of installing it, use:

```markdown
Prior to initiating any coding task, you must first access, read and strictly comply with all requirements outlined in `the-production-agent-skill/instructions.md`. This file serves as the official operational directive for the AI coding agent and must be followed in its entirety without omission. After completing the review of the core guide, proceed to load and integrate all project-specific rules contained within the `harness/` directory. All rules specified in both the core guide and project-specific guides are binding contractual requirements that must be fully adhered to in all applicable scenarios. Under no circumstances may any rule be skipped, disregarded, or incompletely implemented. You are required to validate compliance with every relevant rule before executing any coding work and during first review to ensure full alignment with the established standards. When the user sends a skill command such as `pag-review`, `pag-optimise`, `pag-security`, `pag-deployment`, `pag-guide`, `pag-discovery`, `pag-compare`, `pag-shield`, `pag-idea`, `pag-automations`, or `pag-git-assist- {{git-command:with_options}}`, you must follow the `Skill Commands` workflow in `instructions.md`: read `harness/skills.md`, verify and read the referenced file in `harness/skills/`, ask required preflight questions, and execute the skill workflow as binding guidance. When the user says `Update harness` or a clear variant, you must follow the `Update Harness Command` workflow in `instructions.md`: inspect the project and harness, brief the user on planned updates, wait for agreement, update this harness library to the latest allowed version when package-managed, update project memory, cache important official library documentation, strengthen local agent instructions, add useful automation where appropriate, keep skill registry and skill files synchronized, verify the changes, and provide a comprehensive report.
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
- `harness/mobile-handbook.md`
- `harness/environments-cloud-deployments.md`
- `harness/project-product-runbook.md`
- `harness/deployment-book.md`
- `harness/ci-book.md`
- `harness/workflow-book.md`
- `harness/dictionary.md`
- `harness/incident-response-book.md`
- `harness/observability-book.md`
- `harness/features/README.md`
- `harness/prompt-template.md`
- `harness/skills.md`
- `harness/skills/review.md`
- `harness/skills/optimise.md`
- `harness/skills/security.md`
- `harness/skills/deployment.md`
- `harness/skills/guide.md`
- `harness/skills/discovery.md`
- `harness/skills/compare.md`
- `harness/skills/shield.md`
- `harness/skills/idea.md`
- `harness/skills/automations.md`
- `harness/skills/git-assist.md`
- `scripts/supply-chain-audit.mjs`
- `scripts/codebase-consistency-codemod.mjs`

Check a project at any time:

```bash
npx the-production-agent-skill doctor
```

Get project-aware recommendations for agent skills, plugins, hooks, monitors, CI checks, alerts, and automation setup:

```bash
npx the-production-agent-skill recommend --agent codex
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

The scaffolded `scripts/codebase-consistency-codemod.mjs` helps standardize quote style without broad formatter churn. It is dry-run by default, requires an explicit `--quote single` or `--quote double`, and should only be run with `--write` after confirming the established project standard or asking the user:

```bash
node scripts/codebase-consistency-codemod.mjs --quote single
node scripts/codebase-consistency-codemod.mjs --quote single --write
```

## Expected Agent Behavior

After activation, expect the agent to be more deliberate. It may ask more questions, especially for requirements, non-functional needs, constraints, scale, security, deployment, observability, and unclear edge cases.

For larger tasks, the agent should:

1. Load base and harness rules.
2. Detect skill commands such as `pag-review`, `pag-optimise`, `pag-security`, `pag-deployment`, `pag-guide`, `pag-discovery`, `pag-compare`, `pag-shield`, `pag-idea`, `pag-automations`, and `pag-git-assist- ...`; load `harness/skills.md` and the referenced file in `harness/skills/` before acting.
3. Classify the task as backend, frontend, mobile, full-stack, QA, infrastructure, documentation, or browser/computer-use.
4. Read the relevant code, living docs, and matching packaged `docs/` library reference files before acting.
5. For meaningful implementation or architecture work, consult `arsenals/development-arsenals.md`, compare suitable tools with the existing stack and a no-new-tool option, and select only tools that materially improve the end goal.
6. Clarify ambiguous intent and surface useful feature improvements.
7. Research current library/framework practices when useful or when no matching packaged docs file exists.
8. Propose a plan with options and tradeoffs, including reusable open-source or standards-based options when complex rules or architecture patterns are involved.
9. Include the chosen approach, expected system structure, engineering norms, safeguards, non-functional assumptions, tool setup and ownership when relevant, and a table of planned tests for meaningful work.
10. Implement with production-grade architecture, tests, telemetry, KPI-aware scale assumptions, and docs. Fully configure and verify selected tools instead of stopping after package installation.
11. State blockers early and name the exact assistance, credential, approval, environment change, or decision needed to finish safely.
12. Run a final cross-check for regressions, security, accessibility, reliability, supply-chain risk, and product fit.
13. Update living docs, using Mermaid diagrams, tables, checklists, and clear procedures where they improve comprehension, then provide a concise review with test results, system impact, side effects, rollback notes, and critical code paths for human review.

When the user says `Update harness` or a clear variant, the agent must run the dedicated harness-growth workflow from `instructions.md`. It inspects the project, package manifests, current harness, activation files, docs, scripts, tools, skills, and codebase; identifies important direct frameworks and platform libraries; briefs the user and waits for agreement; updates `the-production-agent-skill` to the latest allowed package-managed version when applicable; caches full relevant official textual docs under `harness/libraries-documentations/`; self-heals missing or weak agent rules outside `harness/verdicts.md`; adds useful automation, templates, reports, MCP/tool guidance, skill workflows, and workflow safeguards; keeps `harness/skills.md` synchronized with `harness/skills/`; records deferred work in `harness/tasks.md`; verifies the updates; and reports exactly what changed and how to use it.

This behavior is intentional. The goal is not just to make code work, but to make the product safer, clearer, and easier to evolve.

## Customization

Do not edit files inside this package for project-specific behavior. Add decisions and overrides to `harness/`.

Use `harness/verdicts.md` as the persistent settings and conflict-resolution file. Examples:

- whether linting/formatting hooks should be configured
- preferred observability provider
- whether web research should be automatic, optional, or disabled
- architecture decisions that override a default guide rule
- deployment and environment assumptions

Use `harness/skills.md` and `harness/skills/` for project-specific skill commands. A skill is available only when the registry row and referenced skill file both exist. New skill commands must use the `pag-{{skill-name}}` format and should include preflight questions, workflow steps, output expectations, and completion evidence.

When package rules conflict with project rules, the agent should ask for a decision once, record the final choice in `verdicts.md`, and follow that verdict in future tasks.

## Included Rule Files

- `instructions.md`: base framework and task lifecycle.
- `backend/backend-rules.md`: backend and service engineering rules.
- `frontend/frontend-rules.md`: frontend and product interface engineering rules.
- `mobile/react-native-rules.md`: React Native, Expo, native mobile, offline, accessibility, performance, security, testing, app-store, and release engineering rules.
- `computer-use/computer-use-agent-rules.md`: browser/computer-use safety guidance.
- `arsenals/development-arsenals.md`: curated tool catalog plus the selection, installation, setup, documentation, verification, and assistance workflow.
- `docs/`: packaged library API and capability references, including React Native, Expo, Expo Application Services, the React Native ecosystem, NestJS, and TypeORM.
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
