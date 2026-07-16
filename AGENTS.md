# AGENTS.md

## Purpose

This repository builds `production-agent-guide`, a reusable rule framework for AI coding agents. The project exists to make coding agents more production-minded, context-aware, safe, thorough, and useful across many downstream software projects.

Agents working here must treat this repository as both:

- a normal npm package with a CLI and published files
- the source of truth for instructions that other coding agents will follow

Because the package teaches agents how to behave, every change must be unusually clear, explicit, operational, and easy for a future agent to apply from a minimal user prompt.

## Repository Map

- `README.md`: public package overview, install instructions, activation snippet, setup flow, expected behavior, customization guidance, and publishing commands.
- `instructions.md`: base operating framework for coding agents. This is the primary behavior document, including the `Update harness` and skill-command workflows.
- `backend/backend-rules.md`: production backend, API, data, reliability, observability, security, and operations rules.
- `frontend/frontend-rules.md`: production frontend, UI, accessibility, state, integration, performance, and testing rules.
- `mobile/react-native-rules.md`: production React Native and Expo architecture, UX, accessibility, native integration, performance, offline, security, testing, store, and release rules.
- `computer-use/computer-use-agent-rules.md`: browser automation, screenshots, desktop interaction, and UI verification rules.
- `docs/`: packaged library and framework references for supported stacks such as NextJS, NestJS, React, and TypeORM and so on.
- `scripts/supply-chain-audit.mjs`: built-in supply-chain audit scaffold copied into downstream projects.
- `scripts/codebase-consistency-codemod.mjs`: built-in consistency codemod scaffold copied into downstream projects.
- `bin/pag.mjs`: CLI entrypoint for `init`, `doctor`, `recommend`, `snippet`, and `help`; it defines required downstream `harness/` files, skill templates, and scaffold/doctor behavior.
- `package.json`: npm metadata, package files, binary mapping, scripts, and engine requirement.
- `ignore.md`: reference material that is not part of the active package contract unless the user explicitly asks to inspect it.

## Core Agent Mission In This Repo

When a user gives a bare minimum prompt, infer the full likely instruction scope before acting.

For this repository, that usually means:

1. Identify whether the requested change affects public documentation, package behavior, downstream agent behavior, or all three.
2. Read the relevant guide files before editing.
3. Expand vague requests into clear, actionable, instructional rules.
4. Prefer language that tells a future agent exactly what to do, when to do it, when not to do it, and how to resolve ambiguity.
5. Keep the framework production-grade without making it noisy, contradictory, or impossible to follow.
6. Validate the package after meaningful changes.
7. Suggest missing rules, safeguards, templates, or CLI support that would make the package excellent-tier.

## Operating Rules

### Start By Understanding Scope

- Read this file first.
- Read `README.md` when changing public behavior, install/setup instructions, package positioning, or CLI usage.
- Read `instructions.md` when changing global agent behavior.
- Read `backend/backend-rules.md` when changing backend guidance.
- Read `frontend/frontend-rules.md` when changing frontend guidance.
- Read `mobile/react-native-rules.md` when changing React Native, Expo, Android, iOS, mobile, native-module, app-store, or OTA update guidance.
- Read `computer-use/computer-use-agent-rules.md` when changing browser, desktop, screenshot, or UI verification guidance.
- Read the matching file under `docs/` before changing packaged library or framework guidance.
- Read `instructions.md`, `README.md`, and `bin/pag.mjs` before changing `Update harness`, `pag-*` skill commands, required scaffold files, or activation snippets.
- Read `scripts/supply-chain-audit.mjs` before changing dependency, vulnerability, install-script, Socket, or audit workflow guidance.
- Read `bin/pag.mjs` and `package.json` before changing CLI commands, package files, scripts, or npm metadata.

### Preserve The Package Contract

- The base guide should remain reusable across many projects.
- Project-specific preferences belong in downstream `harness/`, not in this package.
- Do not hardcode one company, product, deployment provider, database, auth provider, or cloud vendor as the only path unless the rule is explicitly framed as an example.
- If adding a default, explain when it applies and how a project can override it.
- Keep the package installable and usable by copying the folder or installing from npm.

### Write Rules That Future Agents Can Execute

Instructional text should be:

- direct: say what to do
- scoped: say when the rule applies
- bounded: say when the rule does not apply
- operational: include the steps, checks, or decision criteria
- conflict-aware: explain priority when rules compete
- testable: make it possible to know whether the agent followed the rule

Avoid vague advice such as "be thoughtful", "improve quality", or "handle edge cases" unless it is followed by concrete examples, checklists, or decision rules.

### Expand Bare Prompts Into Full Work

If the user asks for a small or vague change, infer the adjacent work that keeps the package coherent.

Examples:

- If the user asks to add a new custom-guide file, update the CLI `requiredGuideFiles`, templates, README file list, doctor behavior if needed, and any related instructions.
- If the user asks to add a new task lifecycle rule, check whether README expected behavior, backend/frontend checklists, or CLI templates should mention it.
- If the user asks to add or rename a `pag-*` skill, update `harness/skills.md` templates, the matching `harness/skills/<name>.md` template, activation snippets, README skill-command text, and doctor/init required-file behavior.
- If a feature behavior, package behavior, CLI command, scaffold, skill, public rule, or downstream workflow changes, update README and any other appropriate docs in the same change unless there is a clear reason not to; report the documentation gap explicitly if it cannot be done.
- If the user asks to improve frontend rules, consider accessibility, state ownership, API contracts, error/loading states, responsive verification, and docs.
- If the user asks to improve backend rules, consider validation, authorization, data integrity, observability, migrations, health checks, async behavior, and tests.

Do not silently perform large unrelated changes. Surface meaningful scope expansion before doing it when risk, time, or package semantics change.

### Protect User Work

- Check `git status --short` before editing.
- Do not overwrite, revert, or clean up changes you did not make unless the user explicitly asks.
- If a file is already modified, read it carefully and make a minimal compatible edit.
- Avoid destructive git commands.
- Keep edits focused on the requested behavior.

## Development Workflow

### For Documentation Changes

1. Locate the source-of-truth file for the behavior.
2. Update any mirrored lists or summaries so the package does not contradict itself.
3. Keep headings and wording consistent with nearby sections.
4. Prefer concise, complete checklists over long essays.
5. Make examples concrete and broadly applicable.
6. Verify no outdated references remain.

### For CLI Changes

1. Read `bin/pag.mjs`, `README.md`, and `package.json`.
2. Keep commands non-destructive by default.
3. Never overwrite existing downstream project files during `init`; use `init --dry-run --root <path>` to preview scaffold changes when needed.
4. Keep `doctor` checks clear and actionable.
5. Keep `requiredGuideFiles`, `requiredProjectFiles`, scaffold templates, activation snippets, README file lists, `instructions.md` workflows, and generated script documentation synchronized.
6. Update help text, README usage, and package file lists when behavior changes.
7. Run validation after changes.

### For Skill Command Changes

1. Read the `Skill Commands` section in `instructions.md`, README activation and customization text, and the template map in `bin/pag.mjs`.
2. Keep skill commands in the `pag-{{skill-name}}` format unless the user explicitly changes the contract.
3. Keep `harness/skills.md` and every referenced `harness/skills/*.md` template synchronized; a documented skill must have a file, and a runnable file must be listed in the registry.
4. Preserve the documented baked-in skills unless intentionally changing the contract: `pag-review`, `pag-optimise`, `pag-security`, `pag-deployment`, `pag-guide`, `pag-discovery`, `pag-compare`, `pag-shield`, `pag-idea`, `pag-automations`, and `pag-git-assist- {{git-command:with_options}}`.
5. For `pag-git-assist- {{git-command:with_options}}`, keep the appended git command treated as untrusted input and preserve the safety checks for status, branch, remotes, staged changes, destructive operations, and project git workflow rules.
6. Update `snippet`, README expected behavior, and CLI `init`/`doctor` required files when skill behavior or required skill files change.

### For Supply-Chain Audit Changes

1. Read `scripts/supply-chain-audit.mjs`, `README.md`, and `package.json`.
2. Keep `security:supply-chain` as the report-only default.
3. Treat `security:supply-chain:fix` and `--fix` as review-required because they can change dependencies.
4. Preserve documented options for `--root`, `--json`, `--socket`, `--audit-level`, `--allow-install-scripts`, and `--allow-network-packages`.
5. Keep downstream script recommendations synchronized with the README and the audit report output.

### For Package Metadata Changes

1. Confirm the package name, binary mapping, `files` list, scripts, and Node engine still match the repository.
2. Ensure newly required files are included in published package contents.
3. Use dry-run package commands before reporting completion when package contents change.

## Validation Commands

Use the checks that fit the change:

```bash
npm run validate
npm run pack
npm run publish:dry-run
npm run security:supply-chain
node bin/pag.mjs help
node bin/pag.mjs init --root /tmp/production-agent-guide-check
node bin/pag.mjs doctor --root /tmp/production-agent-guide-check --package-root .
node bin/pag.mjs recommend --root /tmp/production-agent-guide-check --agent codex
node bin/pag.mjs snippet
node bin/pag.mjs doctor --package-root . --package-only
node scripts/supply-chain-audit.mjs --root . --json
```

Minimum expectation:

- Run `npm run validate` after meaningful changes to package files or guide structure.
- Run `npm run pack` when changing `package.json`, package contents, file layout, or publish-facing docs.
- If validation cannot be run, explain why and what risk remains.

## Style Guide For This Repository

- Use Markdown for guide content.
- Keep language plain, explicit, and instructional.
- Use ASCII punctuation unless a file already uses non-ASCII and there is a clear reason.
- Prefer active voice.
- Prefer short sections with clear headings.
- Use numbered steps for ordered workflows.
- Use bullets for rule sets and checklists.
- Avoid filler, hype, and ambiguous motivational language.
- Avoid hidden TODOs or placeholder promises.
- Keep examples general enough for different stacks, but specific enough to teach behavior.

## Quality Bar For Agent Rules

Every new rule should answer:

- Who or what does this apply to?
- When should the agent follow it?
- What exact action should the agent take?
- What should the agent avoid?
- What evidence should prove completion?
- How does it interact with project-specific overrides?
- Does it belong in the base guide, a stack-specific guide, computer-use rules, README, or CLI template?

If a rule cannot answer these questions, revise it before committing.

## Conflict Resolution

Use this priority order:

1. Safety, security, data integrity, and non-destructive operation.
2. Explicit user instructions in the current task.
3. This `AGENTS.md`.
4. Repository source-of-truth files such as `instructions.md`, stack rules, CLI behavior, and README.
5. Existing code and documentation conventions.

When instructions conflict, choose the safer and more explicit path. If the conflict affects package behavior or downstream users, ask the user for a decision and then document the decision in the appropriate guide file.

## Excellent-Tier Improvement Backlog

When the user asks for suggestions, package hardening, or quality improvements, consider proposing or implementing items from this list.

### Rule Framework Improvements

- Add a compact quick-start `AGENTS.md` snippet for downstream users with package-installed and copied-folder variants.
- Add a decision matrix for when agents should ask questions, infer, research, or proceed.
- Add a dedicated "minimal prompt expansion" section with examples for bug fixes, features, refactors, docs, tests, and deployments.
- Add a rule quality rubric so contributors can evaluate whether instructions are clear enough.
- Add examples of strong and weak agent instructions.
- Add explicit rules for preserving user work in dirty repositories.
- Add a framework versioning and migration policy for downstream harnesses.
- Add guidance for monorepos, polyrepos, libraries, CLIs, SaaS apps, mobile apps, and infrastructure repos.

### CLI Improvements

- Add `pag doctor --json` for machine-readable checks.
- Add `pag init --profile <library|saas|api|frontend|fullstack>` to scaffold more relevant harness templates.
- Add `pag upgrade` to detect newly added required guide files and create only missing files.
- Add `pag explain` to print which files an agent should read for a task type.
- Add `pag validate-docs` to detect missing headings, stale file references, and contradictory guide settings.
- Add tests for CLI commands using temporary directories.

### Documentation Improvements

- Add `CONTRIBUTING.md` with guide-writing standards, validation steps, and release workflow.
- Add `CHANGELOG.md` so downstream users can understand behavior changes.
- Add examples under `examples/` showing recommended downstream `harness/` contents.
- Add a release checklist covering validation, packaging, README review, and version bumping.
- Add a security policy describing how to report unsafe agent guidance or package issues.
- Add troubleshooting docs for common install, `npx`, package path, and activation problems.

### Testing And Release Improvements

- Add automated tests for `init`, `doctor`, `snippet`, and error handling.
- Add CI that runs validation, CLI tests, package dry-run, and Markdown link checks.
- Add snapshot tests for generated custom-guide templates.
- Add package publish dry-run verification in CI.
- Add a script that confirms every file listed in README exists and every required scaffold file has a template.

### Agent Behavior Improvements

- Add deeper rules for code review mode, incident/debugging mode, dependency upgrade mode, migration mode, and greenfield planning mode.
- Add guidance for using official documentation and recording durable research summaries.
- Add stronger security threat-modeling prompts for auth, payments, uploads, webhooks, admin tooling, and multi-tenant data.
- Add cost-control guidance for AI features, observability volume, background jobs, queues, and cloud resources.
- Add rules for human handoff: what context to leave when work cannot be completed.
- Add guidance for producing small, reviewable diffs while still completing the requested outcome.

## Completion Checklist

Before finishing a task in this repository:

- Relevant source files were read.
- Changes are scoped and consistent with package purpose.
- Public docs, CLI templates, and source-of-truth rules are synchronized.
- Existing user changes were preserved.
- Validation was run or the gap is clearly reported.
- The final response states what changed, what was checked, and any useful follow-up suggestions.
