#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(__dirname, "..");

const requiredGuideFiles = [
  "harness/PRD.md",
  "harness/FRD.md",
  "harness/Non-FRD.md",
  "harness/constraints.md",
  "harness/git-workflow.md",
  "harness/architectural-guide.md",
  "harness/project-guide.md",
  "harness/verdicts.md",
  "harness/mcp-rules.md",
  "harness/tasks.md",
  "harness/development-history.md",
  "harness/files-directories.md",
  "harness/backend-handbook.md",
  "harness/frontend-handbook.md",
  "harness/environments-cloud-deployments.md",
  "harness/project-product-runbook.md",
  "harness/deployment-book.md",
  "harness/ci-book.md",
  "harness/workflow-book.md",
  "harness/dictionary.md",
  "harness/incident-response-book.md",
  "harness/observability-book.md",
  "harness/prompt-template.md",
  "harness/skills.md",
  "harness/skills/review.md",
  "harness/skills/optimise.md",
  "harness/skills/guide.md",
  "harness/skills/discovery.md",
  "harness/skills/compare.md",
  "harness/skills/shield.md",
  "harness/skills/idea.md",
  "harness/skills/git-assist.md"
];

const requiredProjectFiles = [
  ...requiredGuideFiles,
  "scripts/supply-chain-audit.mjs"
];

const packageFiles = [
  "README.md",
  "instructions.md",
  "backend/backend-rules.md",
  "frontend/frontend-rules.md",
  "computer-use/computer-use-agent-rules.md",
  "docs",
  "scripts/supply-chain-audit.mjs",
  "bin/the-production-agent-skill.mjs",
  "package.json"
];

const templates = {
  "harness/PRD.md": `# Product Requirements Document

## Product Goal

_Describe the product outcome this repository exists to deliver._

## Users

_List primary users, roles, and jobs-to-be-done._

## Requirements

_Capture product requirements, non-goals, success metrics, and acceptance criteria._
`,
  "harness/FRD.md": `# Functional Requirements Document

## Functional Scope

_Describe feature behavior, workflows, roles, inputs, outputs, edge cases, and negative paths._
`,
  "harness/Non-FRD.md": `# Non-Functional Requirements Document

## Requirements

_Capture scalability, request rate, data volume, availability, latency, reliability, consistency, security, privacy, compliance, observability, KPIs, SLEs, support, and deployment expectations._
`,
  "harness/constraints.md": `# Constraints

## Technical Constraints

_Capture required stacks, hosting limits, data stores, integrations, environments, performance ceilings, migration limits, and compatibility requirements._

## Business Constraints

_Capture budget, timeline, market, support, operational ownership, vendor, and staffing constraints._

## Legal And Compliance Constraints

_Capture privacy, retention, data residency, accessibility, audit, security, regulatory, and contractual constraints._
`,
  "harness/git-workflow.md": `# Git Workflow

## Branching And Commits

_Document branch naming, commit style, review expectations, and merge strategy._

## Hooks And Local Gates

_Document pre-commit, pre-push, lint, format, typecheck, test, security scan, and generated-file checks._

## Release And Rollback

_Document CI gates, deployment promotion, versioning, database migration order, rollback safety, and emergency procedures._
`,
  "harness/architectural-guide.md": `# Architectural Guide

## System Architecture

_Document architecture decisions, domain boundaries, data flow, infrastructure, CI/CD, and deployment topology._
`,
  "harness/project-guide.md": `# Project Guide

## Context

_Capture project history, current state, roadmap notes, links, conventions, and useful context._
`,
  "harness/verdicts.md": `# Agent Verdicts

This file stores final decisions, project preferences, and conflict resolutions for AI coding agents.

## Settings

- is-non-frd-options-set: false
- web-research: optional
- cached-library-documentation: optional
- lint-format-hooks: unset
- observability-provider: unset
`,
  "harness/mcp-rules.md": `# MCP Rules

## Available Tools

_List available MCPs, plugins, credentials boundaries, safety rules, and when to use each tool._
`,
  "harness/tasks.md": `# Tasks

Keep this file forward-only where practical. Add task status, implementation notes, verification steps, and resumable context.
`,
  "harness/development-history.md": `# Development History

Record meaningful technical changes, decisions, dates, reasoning, and verification notes.
`,
  "harness/files-directories.md": `# Files And Directories

Document the current codebase map grouped by feature or domain.
`,
  "harness/backend-handbook.md": `# Backend Handbook

Document backend architecture, dependencies, modules, data access, service flows, and operational notes.
`,
  "harness/frontend-handbook.md": `# Frontend Handbook

Document frontend architecture, routes, state ownership, data flows, UI systems, and integration notes.
`,
  "harness/environments-cloud-deployments.md": `# Environments, Cloud, And Deployments

Document local and remote environments, infrastructure, secrets policy, deployment flows, rollback, monitoring, and support procedures.
`,
  "harness/project-product-runbook.md": `# Project And Product Runbook

Maintain this as the practical operating guide for the product and project. Update it whenever ownership, user journeys, support paths, release readiness, or day-to-day operating procedures change.

## Operating Summary

| Area | Current Detail | Owner | Source |
| --- | --- | --- | --- |
| Product purpose | TBD | TBD | TBD |
| Primary users | TBD | TBD | TBD |
| Core workflows | TBD | TBD | TBD |
| Support path | TBD | TBD | TBD |
| Release readiness owner | TBD | TBD | TBD |

## Product Flow

\`\`\`mermaid
flowchart TD
  User[User or customer] --> Entry[Primary entrypoint]
  Entry --> Workflow[Core product workflow]
  Workflow --> Outcome[Expected outcome]
  Workflow --> Support[Support or exception path]
\`\`\`

## Runbook Checklist

- Keep user journeys, support paths, release readiness, and owner tables current.
- Link to PRD, FRD, workflow book, deployment book, and incident response book where relevant.
- Mark unknown facts as TBD with an owner or discovery note.
`,
  "harness/deployment-book.md": `# Deployment Book

Maintain this as the source of truth for deployment, release promotion, verification, rollback, emergency deployment, and migration order.

## Deployment Flow

\`\`\`mermaid
flowchart LR
  Dev[Local or feature branch] --> CI[CI checks]
  CI --> Preview[Preview or staging]
  Preview --> Gate[Release gate]
  Gate --> Prod[Production]
  Prod --> Smoke[Smoke checks]
  Smoke --> Monitor[Monitoring and rollback watch]
\`\`\`

## Deployment Matrix

| Environment | Trigger | Required Checks | Secrets Boundary | Rollback Method | Owner |
| --- | --- | --- | --- | --- | --- |
| Local | TBD | TBD | TBD | TBD | TBD |
| Preview/Staging | TBD | TBD | TBD | TBD | TBD |
| Production | TBD | TBD | TBD | TBD | TBD |

## Procedure

1. Confirm required CI checks passed.
2. Confirm migrations, feature flags, secrets, and config are ready.
3. Deploy through the approved path.
4. Run smoke checks and monitor critical signals.
5. Record deployment notes, rollback notes, and follow-ups.
`,
  "harness/ci-book.md": `# CI Book

Maintain this as the source of truth for continuous integration jobs, required checks, caches, secrets, branch protection, failure triage, and flaky-test handling.

## CI Flow

\`\`\`mermaid
flowchart TD
  Push[Push or PR] --> Install[Install dependencies]
  Install --> Static[Lint, format, typecheck]
  Static --> Tests[Unit, integration, E2E, security checks]
  Tests --> Build[Build or package checks]
  Build --> Result[Required status result]
\`\`\`

## Required Checks

| Check | Command Or Job | Required For Merge | Failure Owner | Triage Notes |
| --- | --- | --- | --- | --- |
| Install | TBD | TBD | TBD | TBD |
| Lint/Format/Typecheck | TBD | TBD | TBD | TBD |
| Tests | TBD | TBD | TBD | TBD |
| Build/Package | TBD | TBD | TBD | TBD |
| Security/Supply Chain | TBD | TBD | TBD | TBD |

## Maintenance Rules

- Keep CI commands synchronized with package scripts, workflow files, and branch protection.
- Document cache keys, secret usage, retry policy, and flaky-test decisions.
- Record unexplained failures or deferred CI hardening in tasks.md.
`,
  "harness/workflow-book.md": `# Workflow Book

Maintain this as the source of truth for product, engineering, QA, release, incident, support, and automation workflows.

## Workflow Map

\`\`\`mermaid
flowchart TD
  Intake[Intake] --> Triage[Triage]
  Triage --> Plan[Plan]
  Plan --> Build[Build]
  Build --> Verify[Verify]
  Verify --> Release[Release or handoff]
  Release --> Learn[Update living docs]
\`\`\`

## Workflow Catalog

| Workflow | Trigger | Inputs | Steps | Outputs | Owner | Completion Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| Product change | TBD | TBD | TBD | TBD | TBD | TBD |
| Bug fix | TBD | TBD | TBD | TBD | TBD | TBD |
| Release | TBD | TBD | TBD | TBD | TBD | TBD |
| Incident | TBD | TBD | TBD | TBD | TBD | TBD |

## Update Rules

- Add a workflow when repeated work needs consistent handling.
- Use Mermaid state diagrams for workflows with branching states or retries.
- Keep completion evidence concrete enough for future agents to verify.
`,
  "harness/dictionary.md": `# Dictionary

Maintain this as the canonical glossary for product, project, domain, technical, business, support, and acronym terms. Define terms before relying on them heavily in other docs.

## Terms

| Term | Meaning | Canonical Usage | Aliases | Category | Source Or Owner |
| --- | --- | --- | --- | --- | --- |
| TBD | TBD | TBD | TBD | TBD | TBD |

## Relationship Map

\`\`\`mermaid
flowchart LR
  ProductTerm[Product term] --> DomainConcept[Domain concept]
  DomainConcept --> TechnicalModel[Technical model]
  TechnicalModel --> UserFacingCopy[User-facing copy]
\`\`\`

## Maintenance Rules

- Prefer plain-language definitions.
- Capture aliases, deprecated names, acronyms, and source links.
- Update affected docs when a canonical term changes.
`,
  "harness/incident-response-book.md": `# Incident Response Book

Maintain this as the source of truth for incident detection, severity, escalation, communication, mitigation, rollback, recovery, post-incident review, and follow-up tracking.

## Incident Flow

\`\`\`mermaid
flowchart TD
  Detect[Detect signal] --> Severity[Classify severity]
  Severity --> Lead[Assign incident lead]
  Lead --> Mitigate[Mitigate or rollback]
  Mitigate --> Recover[Recover service]
  Recover --> Review[Post-incident review]
  Review --> FollowUp[Track follow-ups]
\`\`\`

## Severity Table

| Severity | User Impact | Response Target | Communication | Escalation Owner |
| --- | --- | --- | --- | --- |
| SEV1 | TBD | TBD | TBD | TBD |
| SEV2 | TBD | TBD | TBD | TBD |
| SEV3 | TBD | TBD | TBD | TBD |

## Response Checklist

1. Confirm impact and severity.
2. Assign roles and communication channel.
3. Stabilize, mitigate, or rollback.
4. Verify recovery with metrics, logs, traces, and user-visible checks.
5. Record timeline, root cause, action items, and owners.
`,
  "harness/observability-book.md": `# Observability Book

Maintain this as the source of truth for logs, metrics, traces, dashboards, alerts, audit events, SLOs/SLEs, ownership, and runbook links.

## Signal Map

\`\`\`mermaid
flowchart LR
  App[Application] --> Logs[Logs]
  App --> Metrics[Metrics]
  App --> Traces[Traces]
  App --> Audit[Audit events]
  Logs --> Dashboard[Dashboards]
  Metrics --> Alerts[Alerts]
  Traces --> Runbooks[Runbook links]
\`\`\`

## Signals

| Signal | Source | Dashboard Or Query | Alert Threshold | Owner | Runbook Link |
| --- | --- | --- | --- | --- | --- |
| Availability | TBD | TBD | TBD | TBD | TBD |
| Latency | TBD | TBD | TBD | TBD | TBD |
| Errors | TBD | TBD | TBD | TBD | TBD |
| Security/Audit | TBD | TBD | TBD | TBD | TBD |

## Maintenance Rules

- Add or update signals when critical paths, jobs, integrations, security events, or deployments change.
- Keep alert thresholds tied to user impact or operational risk.
- Link alerts to deployment, incident, and product runbooks where possible.
`,
  "harness/prompt-template.md": `# Standard Production Task Prompt Template

Use this template for meaningful implementation, review, refactor, security, infrastructure, and debugging work.

## Task

_Describe the requested outcome, users affected, current behavior, desired behavior, and explicit non-goals._

## Acceptance Criteria

| Criterion | How It Will Be Verified |
| --- | --- |
| _Expected product behavior_ | _Test, demo, or inspection method_ |
| _Security/permission requirement_ | _Auth/RBAC/security test_ |
| _Operational or non-functional requirement_ | _Metric, log, load test, or smoke check_ |

## Context To Load

- Read the base agent guide and relevant harness files.
- Read the code paths, tests, schemas, migrations, infrastructure, and docs affected by the task.
- Check matching packaged library docs and current official docs when the task depends on framework, API, or security-sensitive behavior.

## Planning Rules

- Start with a plan when the task is non-trivial, risky, security-sensitive, data-sensitive, infrastructure-related, or ambiguous.
- The plan must state the chosen approach, system structure, engineering norms, safeguards, alternatives considered, and open questions.
- Simulate the solution globally before coding: data flow, permissions, failure modes, rollback, deployment, observability, scalability, and downstream effects.
- Ask questions or pause for alignment when uncertainty could change product behavior, architecture, security, cost, migration safety, or user experience.

## Non-Functional Requirements

Document explicit targets or assumptions for:

| Area | Requirement Or Assumption | Evidence Needed |
| --- | --- | --- |
| Latency | _Example: bulk initiation endpoint responds in milliseconds by enqueueing durable async work._ | _API/integration test and timing notes_ |
| Throughput | _Example: supports 5k concurrent users without blocking critical request paths._ | _Load model, query plan, or stress test_ |
| Availability | _Expected uptime, failover, graceful degradation, and retry behavior._ | _Health checks, alerts, fallback behavior_ |
| Consistency | _Strong, eventual, or read-after-write needs._ | _Transaction, replica, cache, or reconciliation design_ |
| Security | _Auth, RBAC, tenant scope, abuse prevention, supply-chain checks._ | _Unit/integration/security tests_ |
| Operability | _Logs, metrics, traces, dashboards, runbook, rollback._ | _Observed telemetry and rollback notes_ |

## Test Plan

List planned tests before implementation:

| Type | Scenario | Expected Result | Coverage Area |
| --- | --- | --- | --- |
| Unit | _Happy path domain behavior_ | _Correct state/output_ | Correctness |
| Unit | _Invalid input or bad state_ | _Safe error/no mutation_ | Defensive coding |
| Integration | _Endpoint with valid DTO and auth_ | _Expected response and persistence_ | API contract |
| Integration | _RBAC/tenant denial_ | _Forbidden/no data leak_ | Security |
| Integration | _Concurrency/idempotency/retry_ | _No duplicate side effects_ | Reliability |
| E2E | _Critical user workflow_ | _User-visible success and recovery states_ | Regression |
| Security | _Malicious input, dependency, or permission boundary_ | _Rejected, logged, or blocked_ | Security |
| Performance | _Expected scale/load path_ | _Meets latency/resource target_ | Efficiency |

## Implementation Rules

- Preserve existing behavior unless a change is explicitly required.
- Use defensive coding: validate inputs, reject impossible states, keep defaults safe, and treat external systems as unreliable.
- Apply security first: least privilege, server-side authorization, tenant scoping, secrets protection, dependency hygiene, and safe logs.
- Build for scale only where the requirement or foreseeable growth justifies it; leave simple extension points without over-engineering.
- Keep persistence, schema, migrations, seed data, DTOs, tests, and docs synchronized.
- Prefer async workflows, queues, caches, replicas, sharding, regional routing, or specialized data systems only when the non-functional requirements justify their complexity.
- Add observability for critical paths, failures, retries, queues, security events, and business state transitions.

## Final Review And Report

After development, report:

- What changed and what the new code means for the system.
- Side effects introduced, compatibility changes, and how the system evolved.
- Critical code paths created or changed that need human review.
- Deployment, migration, rollback, production data, and operational risks.
- Test results in table form:

| Check | Command Or Method | Result | Notes |
| --- | --- | --- | --- |
| Unit | _command_ | _pass/fail/not run_ | _summary_ |
| Integration | _command_ | _pass/fail/not run_ | _summary_ |
| Security | _command_ | _pass/fail/not run_ | _summary_ |
| Build | _command_ | _pass/fail/not run_ | _summary_ |

- Remaining risks, follow-ups, and recommended monitoring after release.
`
,
  "harness/skills.md": `# Skills Registry

This file is the source of truth for project skill commands. A skill is valid only when it is listed here and its referenced file exists under harness/skills/.

When the user sends a command matching pag-{{skill-name}}, read this registry, confirm the matching row, read the referenced skill file, ask any required preflight questions, and follow that skill workflow before doing the work.

## Skills

| Skill | Command | File | Description |
| --- | --- | --- | --- |
| Review | pag-review | harness/skills/review.md | Reviews a project, feature, module, section, workflow, or implementation in depth. |
| Optimise | pag-optimise | harness/skills/optimise.md | Optimises a target feature or workflow against a stated goal such as speed, cost, reliability, UX, or maintainability. |
| Guide | pag-guide | harness/skills/guide.md | Explains the codebase or a feature end to end for junior developers and non-technical stakeholders. |
| Discovery | pag-discovery | harness/skills/discovery.md | Studies the product, code, docs, dependencies, and ecosystem to produce broad upgrade and improvement recommendations. |
| Compare | pag-compare | harness/skills/compare.md | Compares the project or feature against five strong open-source references and extracts actionable insights. |
| Shield | pag-shield | harness/skills/shield.md | Assesses abuse, misuse, leakage, security, operational, and supply-chain protection across system layers. |
| Idea | pag-idea | harness/skills/idea.md | Generates practical next-step ideas for product, engineering, refactoring, hardening, optimization, and operations. |
| Git Assist | pag-git-assist- {{git-command:with_options}} | harness/skills/git-assist.md | Reviews and, only when safe, runs the appended git command according to repository state and git workflow rules. |

## Extending Skills

- Add new skills by creating a Markdown file under harness/skills/ and adding one row to this registry.
- Use the command format pag-{{skill-name}}. Skill names should be lowercase kebab-case.
- Keep descriptions short but specific enough that an agent can choose the right skill.
- Do not treat a skill as available when the registry row or referenced file is missing.
`,
  "harness/skills/review.md": `# Review Skill

## Command

pag-review

## Purpose

Review a project, feature, module, section, workflow, or implementation comprehensively. Explain what exists, how it is implemented, how pieces connect, what works well, what is fragile, and what needs attention.

## Preflight Questions

Ask only for details that cannot be discovered from the repository:

- What target should be reviewed: whole project, feature, module, folder, file, PR, workflow, or architecture area?
- Which verticals matter most: correctness, security, accuracy, availability, performance, architecture, database, UX, maintainability, cost, operability, or another area?
- Should the review be written into a document? If yes, ask for the target path or propose a suitable path under harness/.
- Should the review be advisory only, or should actionable fixes be planned after the review?

## Workflow

1. Read the skill registry and this file before reviewing.
2. Load the relevant base guide, harness files, docs, source code, tests, configs, and dependency manifests.
3. Map the target: purpose, entrypoints, data flow, dependencies, ownership boundaries, runtime behavior, and user or operator workflows.
4. Explain how the implementation ties together across files, modules, APIs, jobs, UI, data, and infrastructure where relevant.
5. Identify handled edge cases, unhandled edge cases, blind spots, failure modes, security or data risks, scaling risks, operational risks, and maintainability risks.
6. Identify what is okay, what is strong, and what should be preserved.
7. Keep findings evidence-based with file references, commands, traces, configs, tests, docs, or concrete code behavior.
8. If the user requested a document, write a richer report with headings, tables, code pointers, and Mermaid diagrams where they clarify flow or architecture.

## Output

- Start with the review target and scope.
- Include implementation summary, workflow, integration points, edge cases, blind spots, risks, strengths, and recommendations.
- Use tables for findings, risk ranking, and follow-up actions when useful.
- Use Mermaid diagrams for data flow, request flow, module relationships, or lifecycle diagrams when useful.

## Completion Evidence

- Relevant files and docs were read.
- Claims are tied to repo evidence or clearly labeled as inference.
- The final answer or document states what was reviewed, what was not reviewed, and the highest-priority follow-ups.
`,
  "harness/skills/optimise.md": `# Optimise Skill

## Command

pag-optimise

## Purpose

Optimise a specific project feature, workflow, module, query, UI path, build step, infrastructure path, or operational process to meet a stated goal.

## Preflight Questions

Before starting, ask for missing optimization inputs:

- What exact feature, workflow, endpoint, screen, job, query, build step, or module should be optimised?
- What is the optimization goal: response time, throughput, database load, memory, cost, bundle size, reliability, availability, UX, accessibility, maintainability, accuracy, or another target?
- What current baseline, pain, metric, incident, or user complaint motivated the optimization?
- What constraints matter: no behavior change, no new dependency, budget, compatibility, rollout risk, deadline, infrastructure limit, or project-specific rule?
- Should the output be a plan only, implementation, or a richer document?

## Workflow

1. Read the skill registry and this file before optimising.
2. Load relevant harness requirements, constraints, architecture notes, performance or reliability targets, code, tests, configs, and observability artifacts.
3. Establish the current path and baseline from code, tests, logs, metrics, profiling, build output, query plans, or reasoned inspection.
4. Identify bottlenecks, waste, unnecessary coupling, slow or risky dependencies, data access issues, rendering issues, network round trips, retries, queue behavior, or operational friction.
5. Propose options with tradeoffs, risk, expected impact, verification method, and rollback path.
6. If implementing, make the smallest safe change that achieves the goal and preserves existing behavior.
7. Verify against the optimization goal with a relevant command, measurement, test, benchmark, profile, or clearly stated inspection method.

## Output

- State the target, optimization goal, baseline, chosen approach, expected impact, and risks.
- Include before and after evidence when available.
- Use tables for option comparison, measurements, and verification.
- Use diagrams when they make the performance path or workflow clearer.

## Completion Evidence

- Target and goal were clarified.
- Baseline and verification method were recorded.
- The final report states what improved, what did not change, and what remains risky or unmeasured.
`,
  "harness/skills/guide.md": `# Guide Skill

## Command

pag-guide

## Purpose

Guide the user through a codebase, feature, module, architecture area, workflow, or file set comprehensively and end to end. Write for junior developers and non-technical stakeholders without losing technical accuracy.

## Preflight Questions

Ask for missing guidance scope:

- What should be explained: whole codebase, feature, workflow, module, folder, file, architecture, deployment, or data flow?
- Who is the audience: junior developer, PM, marketer, QA, business analyst, DevOps, SRE, senior engineer, executive, or mixed audience?
- How deep should the guide go: overview, onboarding, implementation-level, operations-level, or decision-making level?
- Should the guide be written into a document? If yes, ask for the target path or propose a suitable path under harness/.

## Workflow

1. Read the skill registry and this file before guiding.
2. Load relevant harness docs, README files, source files, tests, configs, routes, schemas, APIs, jobs, UI screens, deployment files, and package manifests.
3. Build a clear map of what the target does, why it exists, who uses it, and how data or control flows through it.
4. Explain the system from the outside in: product purpose, user workflow, entrypoints, main components, data model, dependencies, edge cases, operations, and tests.
5. Translate technical concepts into plain language while keeping exact file and symbol references for developers.
6. Use examples, tables, and Mermaid diagrams where they help readers understand relationships or flow.
7. Call out what a new contributor should read next and what they should avoid changing casually.

## Output

- Include a plain-language overview, technical walkthrough, code map, workflow, data flow, edge cases, tests, and operations notes.
- Use sections that different audiences can scan.
- Use Mermaid diagrams for architecture, request flow, state machines, or dependency relationships when useful.

## Completion Evidence

- The guide names the files and docs inspected.
- The explanation is understandable to junior developers and non-technical stakeholders.
- The final answer or document includes next reading steps and important cautions.
`,
  "harness/skills/discovery.md": `# Discovery Skill

## Command

pag-discovery

## Purpose

Study the codebase, docs, product direction, dependencies, workflows, and ecosystem. Produce broad recommendations that help users from many roles understand what the product needs next.

## Preflight Questions

Ask for missing discovery focus:

- Should discovery cover the whole product or a specific area?
- Which audience or verticals should be emphasized: product, engineering, QA, security, DevOps, SRE, data, growth, marketing, support, business analysis, or leadership?
- Should recommendations be lightweight ideas, prioritized roadmap items, implementation-ready tasks, or a richer document?
- May current web research be used for competitors, industry standards, tools, libraries, and open-source references?

## Workflow

1. Read the skill registry and this file before discovery.
2. Load the full relevant codebase map, README, harness docs, package manifests, scripts, tests, CI, deployment files, issue/task notes, docs, and architecture notes.
3. Infer what the product does, where it appears to be going, what workflows are missing, and what constraints shape the next steps.
4. Inspect direct dependencies and important libraries for capabilities the project is not using but could benefit from.
5. When allowed or required, research current tools, competitors, open-source projects, standards, and alternatives that are relevant to the domain and stack.
6. Generate roughly 50 recommendations across product, UX, architecture, backend, frontend, data, security, QA, DevOps, SRE, observability, dependencies, workflows, docs, support, and business operations.
7. Prioritize recommendations by impact, effort, risk, evidence, and audience.

## Output

- Start with a product understanding summary.
- Include recommendation tables grouped by vertical.
- Include dependency and library opportunity notes.
- Include competitor, tool, software, library, GitHub repository, and industry-standard suggestions when research was allowed.
- Mark speculative ideas clearly when evidence is weak.

## Completion Evidence

- Codebase and docs were inspected before recommending.
- Recommendations are grouped and prioritized.
- The final report states whether web research was used and what sources or repo evidence shaped the findings.
`,
  "harness/skills/compare.md": `# Compare Skill

## Command

pag-compare

## Purpose

Compare this project, product, feature, architecture, workflow, or implementation against five high-quality open-source projects or public reference implementations.

## Preflight Questions

Ask for missing comparison scope:

- What should be compared: whole product, architecture, feature, module, workflow, library choice, API design, UI pattern, or operational model?
- What comparison criteria matter most: architecture, code organization, UX, security, performance, reliability, testing, DevOps, documentation, governance, or ecosystem maturity?
- May current web research be used to select and inspect comparable open-source projects?
- Should the comparison be advisory only, a roadmap, implementation recommendations, or a richer document?

## Workflow

1. Read the skill registry and this file before comparing.
2. Load the target project's relevant docs, code, tests, configs, manifests, and architecture notes.
3. Select five comparable high-quality open-source projects or public references. Prefer active, well-rated, domain-relevant projects with clear documentation and inspectable implementation.
4. Compare architecture, code organization, workflows, data flow, error handling, tests, operations, dependency choices, security posture, and user experience where relevant.
5. Extract practical insights that fit this project's constraints instead of copying patterns blindly.
6. Identify where this project is stronger, weaker, simpler, more complex, or intentionally different.

## Output

- Include a comparison table for the five references.
- Include insight sections for architecture, workflow, code, testing, operations, dependencies, security, and product fit where relevant.
- Include recommendations ranked by usefulness and implementation risk.
- Cite sources or name inspected references when web research was used.

## Completion Evidence

- Five comparable projects or references were inspected unless unavailable, in which case explain why.
- Comparison criteria are explicit.
- Recommendations are adapted to the local project rather than generic.
`,
  "harness/skills/shield.md": `# Shield Skill

## Command

pag-shield

## Purpose

Assess and improve protection against intentional abuse, accidental misuse, hacks, loopholes, data leakage, internal misuse, external misuse, operational failure, and supply-chain risk.

## Preflight Questions

Ask for missing shield scope:

- What should be assessed: whole system, feature, API, auth, data layer, infrastructure, CI/CD, dependencies, admin tooling, uploads, webhooks, payments, AI features, or another area?
- Which verticals matter most: security, privacy, abuse prevention, availability, data integrity, supply chain, insider risk, compliance, or operations?
- Should the output be a risk review, prioritized hardening plan, implementation, or a richer document?
- Are there known incidents, threat actors, compliance requirements, or business constraints to consider?

## Workflow

1. Read the skill registry and this file before assessing.
2. Load relevant harness rules, security constraints, code, auth flows, API boundaries, schemas, secrets handling, CI/CD, deployment config, logs, dependencies, scripts, and supply-chain tooling.
3. Map assets, trust boundaries, actors, roles, tenants, permissions, data stores, external systems, secrets, and operational controls.
4. Identify intentional abuse paths, accidental misuse paths, leakage risks, privilege escalation, insecure defaults, dependency risks, CI/CD risks, admin risks, runtime egress risks, and monitoring gaps.
5. Recommend layered mitigations across product, code, auth, data, infrastructure, dependencies, CI/CD, observability, support, and policy.
6. Treat destructive or risky commands as review-required. Do not run them without explicit permission and a rollback plan.

## Output

- Include a risk table with severity, likelihood, evidence, impact, mitigation, owner, and verification.
- Include layered protections across app, data, infrastructure, supply chain, and operations.
- Use diagrams for trust boundaries or abuse flows when useful.
- Separate confirmed risks from inferred risks.

## Completion Evidence

- Assets and trust boundaries were mapped.
- Findings cite repo evidence or are labeled as inference.
- The final report includes prioritized mitigations and verification steps.
`,
  "harness/skills/idea.md": `# Idea Skill

## Command

pag-idea

## Purpose

Generate useful next-step ideas for the project or product. Ideas may be technical, product-focused, operational, refactoring-oriented, hardening-focused, optimization-focused, or documentation-focused.

## Preflight Questions

Ask for missing ideation scope:

- Should ideas cover the whole project or a specific feature, module, audience, or vertical?
- What kind of ideas are wanted: product, engineering, refactor, security, QA, DevOps, SRE, performance, UX, growth, documentation, or mixed?
- Should ideas be quick suggestions, prioritized roadmap items, implementation-ready tickets, or a richer document?
- Are there constraints such as budget, timeline, team capacity, customer segment, platform, or risk appetite?

## Workflow

1. Read the skill registry and this file before ideating.
2. Load relevant README files, harness docs, tasks, architecture notes, package manifests, tests, scripts, and code areas needed to understand the product.
3. Infer product goals, current capabilities, gaps, constraints, and likely next growth paths.
4. Generate ideas across multiple verticals, including features, refactors, tests, security, operations, documentation, developer experience, dependency usage, automation, and product workflows.
5. Rank ideas by impact, effort, confidence, risk, and who benefits.
6. Mark assumptions clearly when ideas depend on unverified product direction.

## Output

- Include grouped ideas with title, rationale, expected benefit, effort, risk, and first step.
- Include quick wins, medium investments, and larger bets.
- Include technical and non-technical ideas when the audience is mixed.

## Completion Evidence

- Ideas are grounded in inspected project facts where possible.
- Assumptions are labeled.
- The final response gives the user a clear shortlist of best next actions.
`,
  "harness/skills/git-assist.md": `# Git Assist Skill

## Command

pag-git-assist- {{git-command:with_options}}

## Purpose

Act as an extra safety reviewer for git commands. Inspect the appended git command, repository state, branch workflow, pending changes, and project rules before deciding whether to run it.

## Preflight Questions

Ask only when safety cannot be determined from the repository:

- What outcome should this git operation achieve?
- Is there approval for destructive, history-rewriting, force-push, deletion, reset, clean, rebase, or conflict-resolution behavior?
- Which target branch, remote, PR, or release rule applies when the local workflow docs are unclear?

## Workflow

1. Read the skill registry, this file, harness/git-workflow.md, current git status, branch, remotes, recent commits, and relevant CI or hook rules before running any appended command.
2. Parse the appended command and classify it as read-only, local metadata, staging, commit, pull/fetch, merge/rebase, push, tag/release, branch deletion, reset/clean/checkout restore, hook/workflow, or unknown.
3. Block or ask for explicit approval before any command that can discard work, rewrite history, delete branches/tags, force push, overwrite files, bypass hooks, skip CI, expose secrets, or violate the project git workflow.
4. For safe read-only commands, run them and summarize the important output.
5. For safe mutating commands, confirm the working tree state, target branch, staged files, remote, and workflow compliance before running. Run only the exact safe command or a safer equivalent.
6. For unsafe or suboptimal commands, explain the risk, cite the project rule or git behavior, and suggest safer alternatives.
7. If conflicts occur, stop and explain the conflict state, affected files, safe next steps, and what user decision is needed.

## Output

- State whether the command is safe, unsafe, needs approval, or should be replaced.
- Explain why using repo state and git workflow rules.
- If run, summarize command output and resulting state.
- If not run, provide a safer command or workflow.

## Completion Evidence

- Git status and workflow rules were checked.
- Destructive commands were not run without explicit approval.
- The final report states what command was evaluated, whether it ran, and the resulting repository state.
`
};

function printHelp() {
  console.log(`The Production Agent Skill

Usage:
  the-production-agent-skill init [--dry-run] [--root <path>]
  the-production-agent-skill doctor [--root <path>] [--package-root <path>] [--package-only]
  the-production-agent-skill snippet
  the-production-agent-skill help

Commands:
  init      Create missing harness files and security scripts without overwriting existing files.
  doctor    Check framework package files, downstream guide files, and security scripts.
  snippet   Print an activation snippet for AGENTS.md or equivalent agent rules files.
`);
}

function parseArgs(argv) {
  const args = {
    command: argv[2] ?? "help",
    dryRun: false,
    root: process.cwd(),
    packageRoot,
    packageOnly: false
  };

  for (let index = 3; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--dry-run") {
      args.dryRun = true;
      continue;
    }

    if (arg === "--root") {
      args.root = resolve(argv[index + 1] ?? ".");
      index += 1;
      continue;
    }

    if (arg === "--package-root") {
      args.packageRoot = resolve(argv[index + 1] ?? ".");
      index += 1;
      continue;
    }

    if (arg === "--package-only") {
      args.packageOnly = true;
      continue;
    }

    fail(`Unknown option: ${arg}`);
  }

  return args;
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

function snippet() {
  console.log(`Prior to initiating any coding task, you must first access, read and strictly comply with all requirements outlined in \`node_modules/the-production-agent-skill/instructions.md\`. This file serves as the official operational directive for the AI coding agent and must be followed in its entirety without omission. After completing the review of the core guide, proceed to load and integrate all project-specific rules contained within the \`harness/\` directory. All rules specified in both the core guide and project-specific guides are binding contractual requirements that must be fully adhered to in all applicable scenarios. Under no circumstances may any rule be skipped, disregarded, or incompletely implemented. You are required to validate compliance with every relevant rule before executing any coding work and during first review to ensure full alignment with the established standards. When the user sends a skill command such as \`pag-review\`, \`pag-optimise\`, \`pag-guide\`, \`pag-discovery\`, \`pag-compare\`, \`pag-shield\`, \`pag-idea\`, or \`pag-git-assist- {{git-command:with_options}}\`, you must follow the \`Skill Commands\` workflow in \`instructions.md\`: read \`harness/skills.md\`, verify and read the referenced file in \`harness/skills/\`, ask required preflight questions, and execute the skill workflow as binding guidance. When the user says \`Update harness\` or a clear variant, you must follow the \`Update Harness Command\` workflow in \`instructions.md\`: inspect the project and harness, brief the user on planned updates, wait for agreement, update project memory, cache important official library documentation, strengthen local agent instructions, add useful automation where appropriate, keep skill registry and skill files synchronized, verify the changes, and provide a comprehensive report.`);
}

function init({ root, dryRun }) {
  const created = [];
  const skipped = [];

  for (const file of requiredProjectFiles) {
    const absolutePath = join(root, file);

    if (existsSync(absolutePath)) {
      skipped.push(file);
      continue;
    }

    created.push(file);

    if (!dryRun) {
      mkdirSync(dirname(absolutePath), { recursive: true });
      writeFileSync(absolutePath, getTemplate(file), { flag: "wx" });
    }
  }

  if (dryRun) {
    console.log("Dry run only. No files were created.");
  }

  if (created.length > 0) {
    console.log(`${dryRun ? "Would create" : "Created"}:`);
    for (const file of created) {
      console.log(`  - ${file}`);
    }
  } else {
    console.log("All harness files already exist.");
  }

  if (skipped.length > 0) {
    console.log("Skipped existing files:");
    for (const file of skipped) {
      console.log(`  - ${file}`);
    }
  }
}

function doctor({ root, packageRoot: guideRoot, packageOnly }) {
  const missingPackageFiles = packageFiles.filter((file) => !existsSync(join(guideRoot, file)));
  const missingCustomFiles = packageOnly
    ? []
    : requiredProjectFiles.filter((file) => !existsSync(join(root, file)));

  if (missingPackageFiles.length === 0) {
    console.log("Package files: ok");
  } else {
    console.log("Package files: missing");
    for (const file of missingPackageFiles) {
      console.log(`  - ${file}`);
    }
  }

  if (packageOnly) {
    console.log("harness: skipped");
  } else if (missingCustomFiles.length === 0) {
    console.log("harness: ok");
  } else {
    console.log("harness: missing");
    for (const file of missingCustomFiles) {
      console.log(`  - ${file}`);
    }
  }

  if (missingPackageFiles.length > 0 || missingCustomFiles.length > 0) {
    process.exitCode = 1;
  }
}

function getTemplate(file) {
  if (file === "scripts/supply-chain-audit.mjs") {
    return readFileSync(join(packageRoot, "scripts/supply-chain-audit.mjs"), "utf8");
  }

  return templates[file];
}

const args = parseArgs(process.argv);

switch (args.command) {
  case "init":
    init(args);
    break;
  case "doctor":
    doctor(args);
    break;
  case "snippet":
    snippet();
    break;
  case "help":
  case "--help":
  case "-h":
    printHelp();
    break;
  default:
    printHelp();
    fail(`Unknown command: ${args.command}`);
}
