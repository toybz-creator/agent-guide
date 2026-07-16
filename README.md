# The Production Agent Skill

The Production Agent Skill is a reusable rule framework for AI coding agents. It teaches an agent how to understand a product, ask the right questions, plan deliberately, build production-grade software, verify the work, and keep project memory up to date.

Use it as the stable base layer for your agent behavior. Put project-specific decisions, preferences, and product context in `harness/` so this package can be updated without losing your project rules.

## What It Gives You

- **Production-first execution:** agents consider correctness, security, reliability, observability, performance, maintainability, accessibility, operability, cost, and user experience.
- **Six-stage execution:** every project task runs Rewrite, Planning, Implementation, Evaluation, Feedback, and Iteration, with depth proportional to risk but no stage silently skipped.
- **Durable task reasoning:** each task keeps a reviewable `harness/planning-notes/<task-id>/implementation-guide.md` containing the refined prompt, selected rule IDs, architecture, plan, evidence, report, and iteration notes.
- **Numbered rules:** stable `PAG-*` IDs make rule selection and completion evidence explicit instead of asking an agent to remember an undifferentiated wall of guidance.
- **360 feature development:** agents look beyond the immediate prompt and surface edge cases, failure modes, negative paths, abuse cases, scale concerns, and future integrations.
- **Better planning and delegation:** agents clarify ambiguity, research current framework/library practices, compare options, lock an implementation plan before high-impact work, and split large tasks into related bounded workstreams that use the maximum safe parallel sub-agent capacity.
- **Packaged library references:** agents check matching files in `docs/` for in-depth library APIs and capabilities before implementing against supported libraries.
- **Development arsenal:** agents scan a packaged catalog of proven tools, compare candidates against the current stack and a no-new-tool option, then fully install, configure, document, and verify only the tools that materially improve the product outcome.
- **Living project memory:** agents maintain PRDs, functional requirements, architecture notes, runbooks, deployment/CI/workflow books, dictionaries, incident and observability books, task history, verdicts, and file maps in a dedicated project guide folder.
- **Feature-level docs:** substantial features get their own `harness/features/<feature-name>/` folders with PRD, FRD, SystemsArchitecture, tasks, workflow, runbook, observability, and decision docs.
- **Strictness levels:** projects can choose `advisory`, `standard`, or `strict` in `harness/verdicts.md`; strict mode requires full precautions, docs, KPI capture, tests, security review, rollout/rollback notes, and explicit risk acceptance for skipped safeguards.
- **Enforceable QA profile:** during setup, agents ask which test layers the project requires, record the answer and commands in `harness/verdicts.md`, then write, run, and report the selected coverage after every applicable implementation task. The profile can require unit, integration, E2E, manual browser/computer-use, security, load/stress, accessibility, migration, visual, smoke, or other test layers.
- **KPI-driven architecture:** agents ask for endpoint hit rates, latency, database/query budgets, queue volume, availability, observability, and growth targets, then plan code and infrastructure toward those targets.
- **Skill commands:** agents treat commands such as `pag-review`, `pag-optimise`, `pag-security`, `pag-deployment`, `pag-guide`, `pag-automations`, `pag-synchronise-project`, and `pag-git-assist- ...` as binding workflows loaded from `harness/skills.md` and `harness/skills/`.
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
For every project task, read and follow `node_modules/the-production-agent-skill/instructions.md`. Treat the user's initial prompt as authoritative intent but incomplete implementation input. Before implementation, create or resume `harness/planning-notes/<task-id>/implementation-guide.md`; research the product, current repository, relevant harness and task memory, available agent memory, applicable numbered rulebooks, tools, and current official sources when needed; then write the refined working prompt and implementation-ready plan there. For large tasks, group related independent work into bounded workstreams and delegate them to the maximum safely usable number of sub-agents; the coordinating agent owns integration and final evaluation. Run all six stages—Rewrite, Planning, Implementation, Evaluation, Feedback, and Iteration—at a depth proportional to risk, but never skip a stage. Take enough time to infer the right rules and architecture instead of optimizing for speed. Record selected `PAG-*` rule IDs and evidence, keep affected living harness docs synchronized, preserve unrelated user work, and do not claim completion until evaluation covers the refined goal. Use `npx the-production-agent-skill task --id <task-id> --title "<title>"` to create the task guide and `verify-task --id <task-id> --stage <stage>` to validate stage evidence. When a `pag-*` skill is invoked, load its registry entry and skill file in addition to this lifecycle. When the user explicitly requests `Update harness`, follow the numbered harness-maintenance rules in `instructions.md`.
```

If you copied the guide into the repository, replace `node_modules/the-production-agent-skill/instructions.md` with `the-production-agent-skill/instructions.md`.

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

### First-Time Harness Setup

After `init` completes, finish the initial setup in this order:

1. Review and modify `harness/verdicts.md` so it captures project-specific decisions, preferences, constraints, and required QA profile.
2. Send your AI agent the prompt `pag-synchronise-project`.

`pag-synchronise-project` compares the harness with the current project and updates the relevant living documents to reflect verified product behavior, code, architecture, infrastructure, plans, known gaps or missteps, and refinements. It is useful immediately after initialization and at any later point after manual or out-of-band project work.

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
- `harness/planning-notes/README.md`
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
- `harness/skills/synchronise-project.md`
- `harness/skills/git-assist.md`
- `scripts/supply-chain-audit.mjs`
- `scripts/codebase-consistency-codemod.mjs`

Check a project at any time:

```bash
npx the-production-agent-skill doctor
```

Create and validate a task workspace:

```bash
npx the-production-agent-skill task --id 20260704-example-task --title "Example task"
npx the-production-agent-skill verify-task --id 20260704-example-task --stage rewrite
npx the-production-agent-skill verify-task --id 20260704-example-task --stage planning
npx the-production-agent-skill verify-task --id 20260704-example-task --stage complete
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

After activation, expect the agent to be more deliberate:

1. **Rewrite:** gather current product, repository, harness, task, memory, rulebook, tool, package, and official-source context; then write a refined working prompt.
2. **Planning:** design architecture, contracts, patterns, implementation sequence, test matrix, operational behavior, documentation, rollout, and rollback.
3. **Implementation:** execute the recorded plan, keep the implementation log current, and revise the plan when evidence changes it.
4. **Evaluation:** prove the result with applicable unit, integration, contract, E2E, migration, security, accessibility, performance, browser/device, smoke, and manual evidence.
5. **Feedback:** write the comprehensive task report and give the user an outcome-first handoff.
6. **Iteration:** fix discovered defects, re-evaluate, and update the durable harness so future work starts with better evidence.

The six stages apply to every project task. Small tasks use brief sections; consequential tasks require deeper research, simulation, evidence, and user alignment. For large tasks with independent workstreams, agents group related work into non-overlapping delegations and use all safely available parallel sub-agent capacity, while one coordinating agent reconciles the handoffs and verifies the integrated result. The method is mandatory, while its depth is proportional.

This behavior is intentional. The goal is not just to make code work, but to make the product safer, clearer, and easier to evolve.

## Customization

Do not edit files inside this package for project-specific behavior. Add decisions and overrides to `harness/`.

Use `harness/verdicts.md` as the persistent settings and conflict-resolution file. Examples:

- whether linting/formatting hooks should be configured
- preferred observability provider
- required QA test layers, commands, test environment, fixtures, and whether manual browser/computer-use testing is mandatory
- whether web research should be automatic, optional, or disabled
- architecture decisions that override a default guide rule
- deployment and environment assumptions

Use `harness/skills.md` and `harness/skills/` for project-specific skill commands. A skill is available only when the registry row and referenced skill file both exist. New skill commands must use the `pag-{{skill-name}}` format and should include preflight questions, workflow steps, output expectations, and completion evidence.

Use `pag-synchronise-project` after initialization and whenever the repository has changed outside the normal agent workflow. It captures verified current project truth in the harness while preserving existing decisions in `harness/verdicts.md` unless the user or evidence changes them.

When a same-priority conflict materially changes product behavior, architecture, cost, risk, scope, or user experience, the agent asks once, records the durable decision in `verdicts.md`, and follows it in future tasks. The conflict order in `instructions.md` remains authoritative.

## Included Rule Files

- `instructions.md`: base framework and task lifecycle.
- `backend/backend-rules.md`: backend and service engineering rules.
- `frontend/frontend-rules.md`: frontend and product interface engineering rules.
- `mobile/react-native-rules.md`: React Native, Expo, native mobile, offline, accessibility, performance, security, testing, app-store, and release engineering rules.
- `computer-use/computer-use-agent-rules.md`: browser/computer-use safety guidance.
- `qa/qa-rules.md`: test-profile setup and enforcement plus unit, integration, contract, E2E, manual browser/computer-use, accessibility, visual, security, performance/load, stress/soak, resilience, migration/data, smoke, and QA evidence rules.
- `arsenals/development-arsenals.md`: curated tool-discovery catalog; the canonical selection, implementation, evaluation, and reporting workflow remains in `instructions.md`.
- `docs/`: packaged library API and capability references, including React Native, Expo, Expo Application Services, the React Native ecosystem, NestJS, and TypeORM.
- `scripts/supply-chain-audit.mjs`: dependency vulnerability and supply-chain behavior check scaffolded into downstream projects by `init`.
- `test/cli.test.mjs`: package integration tests for rule validation, activation synchronization, scaffolding, task creation, and lifecycle verification.

## Publishing

Dry-run the package before publishing:

```bash
npm run publish:dry-run
```

Inspect package contents:

```bash
npm run pack
```
