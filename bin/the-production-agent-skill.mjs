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
  "harness/mobile-handbook.md",
  "harness/environments-cloud-deployments.md",
  "harness/project-product-runbook.md",
  "harness/deployment-book.md",
  "harness/ci-book.md",
  "harness/workflow-book.md",
  "harness/dictionary.md",
  "harness/incident-response-book.md",
  "harness/observability-book.md",
  "harness/features/README.md",
  "harness/planning-notes/README.md",
  "harness/prompt-template.md",
  "harness/skills.md",
  "harness/skills/review.md",
  "harness/skills/optimise.md",
  "harness/skills/security.md",
  "harness/skills/deployment.md",
  "harness/skills/guide.md",
  "harness/skills/discovery.md",
  "harness/skills/compare.md",
  "harness/skills/shield.md",
  "harness/skills/idea.md",
  "harness/skills/automations.md",
  "harness/skills/git-assist.md"
];

const requiredProjectFiles = [
  ...requiredGuideFiles,
  "scripts/supply-chain-audit.mjs",
  "scripts/codebase-consistency-codemod.mjs"
];

const packageFiles = [
  "README.md",
  "CHANGELOG.md",
  "instructions.md",
  "backend/backend-rules.md",
  "frontend/frontend-rules.md",
  "mobile/react-native-rules.md",
  "computer-use/computer-use-agent-rules.md",
  "arsenals/development-arsenals.md",
  "docs",
  "scripts/supply-chain-audit.mjs",
  "scripts/codebase-consistency-codemod.mjs",
  "bin/the-production-agent-skill.mjs",
  "test/cli.test.mjs",
  "package.json"
];

const rulebookFiles = [
  "instructions.md",
  "backend/backend-rules.md",
  "frontend/frontend-rules.md",
  "mobile/react-native-rules.md",
  "computer-use/computer-use-agent-rules.md",
  "arsenals/development-arsenals.md"
];

const taskGuideSections = [
  "Metadata",
  "Initial Request",
  "Refined Working Prompt",
  "Context And Evidence",
  "Product And Task Understanding",
  "Scope, Non-Goals, Assumptions, And Open Questions",
  "Task Classification And Rule Register",
  "Architecture And Design Decisions",
  "Implementation Plan And Change Map",
  "Test And Evaluation Matrix",
  "Implementation Log",
  "Evaluation Evidence",
  "Feedback Report",
  "Iteration, Harness Updates, Residual Risks, And Follow-Ups"
];

const taskStageSections = {
  rewrite: taskGuideSections.slice(0, 7),
  planning: taskGuideSections.slice(0, 10),
  implementation: taskGuideSections.slice(0, 11),
  evaluation: taskGuideSections.slice(0, 12),
  feedback: taskGuideSections.slice(0, 13),
  iteration: taskGuideSections,
  complete: taskGuideSections
};

const taskStageRuleNamespaces = {
  rewrite: ["CORE", "RWR"],
  planning: ["CORE", "RWR", "PLN"],
  implementation: ["CORE", "RWR", "PLN", "IMP"],
  evaluation: ["CORE", "RWR", "PLN", "IMP", "EVL"],
  feedback: ["CORE", "RWR", "PLN", "IMP", "EVL", "FDB"],
  iteration: ["CORE", "RWR", "PLN", "IMP", "EVL", "FDB", "ITR"],
  complete: ["CORE", "RWR", "PLN", "IMP", "EVL", "FDB", "ITR", "DONE"]
};

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
- strict-level: standard
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
  "harness/mobile-handbook.md": `# Mobile Handbook

Document React Native and Expo versions, supported platforms and OS versions, native project ownership, routes and deep links, state and data flow, storage and offline behavior, permissions, accessibility, performance budgets, native dependencies, config plugins, build profiles, app identifiers, signing ownership, store tracks, OTA update policy, device testing, observability, and mobile operational notes.
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
  "harness/features/README.md": `# Feature Documentation Index

Every substantial feature must have its own folder under this directory, even when product-wide PRD, FRD, and architecture docs already exist.

## Folder Contract

Use kebab-case feature folders:

\`\`\`text
harness/features/<feature-name>/
  PRD.md
  FRD.md
  SystemsArchitecture.md
  tasks.md
  workflow.md
  runbook.md
  observability.md
  decisions.md
\`\`\`

## Required Coverage

| Document | Purpose | Required Rich Media |
| --- | --- | --- |
| PRD.md | User problem, goals, non-goals, personas, success metrics, release scope. | User journey table, acceptance matrix, optional screenshots or product images. |
| FRD.md | Functional behavior, roles, permissions, inputs, outputs, edge cases, negative paths. | Requirement tables, state diagrams, workflow diagrams. |
| SystemsArchitecture.md | Components, APIs, data model, events, jobs, queues, caches, infrastructure, rollout and rollback. | Mermaid architecture, sequence, data-flow, and deployment diagrams. |
| tasks.md | Implementation plan, owners, dependencies, verification, status, risks. | Task tables and dependency diagrams when useful. |
| workflow.md | Product, engineering, QA, support, and operational workflows. | Mermaid flowcharts or state diagrams. |
| runbook.md | Support, incident, deployment, rollback, data repair, and operator procedures. | Ordered checklists, escalation tables, diagrams. |
| observability.md | KPIs, SLOs/SLEs, logs, metrics, traces, dashboards, alerts, audit events. | KPI tables, signal maps, alert matrices. |
| decisions.md | Architecture decisions, rejected options, tradeoffs, constraints, source links. | Decision tables and comparison matrices. |

## Writing Standard

- Write for junior developers, QA, product, support, DevOps/SRE, and future agents.
- Use plain language first, then precise technical details.
- Use Mermaid diagrams, tables, checklists, screenshots, image links, short video links, or other useful media when they make behavior clearer.
- Mark unknown facts as TBD with an owner or discovery note.
- Keep feature docs synchronized with product-wide PRD, FRD, architecture, deployment, CI, workflow, dictionary, observability, and runbook docs.
`,
  "harness/planning-notes/README.md": `# Task Planning Notes

Every project task must create or resume:

\`\`\`text
harness/planning-notes/<task-id>/implementation-guide.md
\`\`\`

Use a stable task ID in the form \`YYYYMMDD-short-kebab-slug\`. The implementation guide is the durable execution record for the mandatory Rewrite, Planning, Implementation, Evaluation, Feedback, and Iteration stages.

Create a guide safely with:

\`\`\`bash
npx the-production-agent-skill task --id YYYYMMDD-short-kebab-slug --title "Task title"
\`\`\`

Validate progress with:

\`\`\`bash
npx the-production-agent-skill verify-task --id YYYYMMDD-short-kebab-slug --stage rewrite
npx the-production-agent-skill verify-task --id YYYYMMDD-short-kebab-slug --stage planning
npx the-production-agent-skill verify-task --id YYYYMMDD-short-kebab-slug --stage complete
\`\`\`

The task folder may also contain focused research, diagrams, evaluation logs, screenshots, migration notes, and decision records. Keep durable project truth synchronized with the appropriate PRD, FRD, constraints, verdicts, architecture, handbook, runbook, task, development-history, feature, and observability files.
`,
  "harness/prompt-template.md": `# Standard Production Task Prompt

Use this short prompt to activate the full task method without duplicating its rules:

\`\`\`markdown
Treat this request as the starting prompt, not the final working prompt.

Requested outcome:
<describe the outcome>

Known scope and constraints:
<describe known scope, non-goals, deadlines, permissions, and constraints>

Success evidence:
<describe what would prove the outcome>

Follow the numbered rules in the Production Agent Skill. Create or resume the task implementation guide under harness/planning-notes/<task-id>/, run Rewrite, Planning, Implementation, Evaluation, Feedback, and Iteration, and keep affected living harness documents synchronized.
\`\`\`

The canonical detailed structure is generated by:

\`\`\`bash
npx the-production-agent-skill task --id <task-id> --title "<title>"
\`\`\`

Do not copy lifecycle rules into project prompts. Keep them canonical in \`instructions.md\`; put task evidence in the generated implementation guide and durable project decisions in the appropriate harness files.
`,
  "harness/skills.md": `# Skills Registry

This file is the source of truth for project skill commands. A skill is valid only when it is listed here and its referenced file exists under harness/skills/.

When the user sends a command matching pag-{{skill-name}}, run the mandatory six-stage lifecycle from the base guide and load the matching skill as additional specialized instructions. Create or resume the task implementation guide before skill work, record the selected skill and applicable rule IDs, and keep stage evidence in that guide. A skill never replaces Rewrite, Planning, Implementation, Evaluation, Feedback, or Iteration.

## Skills

| Skill | Command | File | Description |
| --- | --- | --- | --- |
| Review | pag-review | harness/skills/review.md | Reviews a project, feature, module, section, workflow, or implementation in depth. |
| Optimise | pag-optimise | harness/skills/optimise.md | Optimises a target feature or workflow against a stated goal such as speed, cost, reliability, UX, or maintainability. |
| Security | pag-security | harness/skills/security.md | Threat-models and hardens a target against security, privacy, abuse, and compliance risks. |
| Deployment | pag-deployment | harness/skills/deployment.md | Plans or reviews deployment, release, rollback, infrastructure, CI/CD, and production readiness. |
| Guide | pag-guide | harness/skills/guide.md | Explains the codebase or a feature end to end for junior developers and non-technical stakeholders. |
| Discovery | pag-discovery | harness/skills/discovery.md | Studies the product, code, docs, dependencies, and ecosystem to produce broad upgrade and improvement recommendations. |
| Compare | pag-compare | harness/skills/compare.md | Compares the project or feature against five strong open-source references and extracts actionable insights. |
| Shield | pag-shield | harness/skills/shield.md | Assesses abuse, misuse, leakage, security, operational, and supply-chain protection across system layers. |
| Idea | pag-idea | harness/skills/idea.md | Generates practical next-step ideas for product, engineering, refactoring, hardening, optimization, and operations. |
| Automations | pag-automations | harness/skills/automations.md | Recommends agent skills, plugins, hooks, monitors, and automations for the project and AI agent surface. |
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
  "harness/skills/security.md": `# Security Skill

## Command

pag-security

## Purpose

Threat-model, review, and improve a project, feature, API, data flow, dependency surface, infrastructure path, CI/CD path, or operational workflow for security, privacy, abuse resistance, and compliance.

## Preflight Questions

Ask before doing security work when the answer cannot be discovered from repository evidence:

- What target should be assessed or hardened: whole system, feature, API, auth, payments, uploads, webhooks, admin tooling, AI features, infrastructure, CI/CD, dependencies, or another area?
- Which risk model matters most: external attacker, malicious tenant, insider misuse, accidental leakage, compliance failure, supply-chain compromise, or operational abuse?
- Should the output be a threat model, prioritized hardening plan, implementation, tests, or a richer document?
- Are there known regulations, incidents, sensitive data classes, or business constraints?

## Workflow

1. Read the skill registry and this file before starting.
2. Load relevant harness rules, code, schemas, auth paths, permissions, logs, deployment files, CI, dependencies, secrets handling, and supply-chain tooling.
3. Map assets, actors, roles, tenants, trust boundaries, sensitive data, secrets, external systems, and privileged workflows.
4. Identify risks across authentication, authorization, validation, injection, data leakage, tenant isolation, rate limits, dependency risk, logging, CI/CD, infrastructure permissions, and operational access.
5. Propose layered mitigations with verification steps before implementing.
6. If implementing, make focused changes and add tests or checks that prove the boundary is safer.

## Output

- Include a risk table with severity, likelihood, evidence, impact, mitigation, owner, and verification.
- Include trust-boundary or abuse-flow diagrams where useful.
- Separate confirmed risks from inferred risks.
- Name any destructive or high-risk actions that require approval before execution.

## Completion Evidence

- Assets, actors, and trust boundaries were mapped.
- Recommendations are tied to repo evidence, standards, or clearly labeled inference.
- Verification steps are concrete and appropriate for the risk.
`,
  "harness/skills/deployment.md": `# Deployment Skill

## Command

pag-deployment

## Purpose

Plan, review, or improve deployment, release, rollback, CI/CD, infrastructure, environment configuration, smoke testing, and production readiness.

## Preflight Questions

Ask before deployment work when missing:

- What target is in scope: whole app, service, feature, migration, environment, CI workflow, infrastructure module, or release?
- Which environment matters: local, preview, staging, production, disaster recovery, or multi-region?
- Is the request for advice, a deployment plan, implementation, infrastructure documentation, or release support?
- What risk tolerance, downtime tolerance, rollback expectation, KPI/SLO target, and approval path apply?

## Workflow

1. Read the skill registry and this file before starting.
2. Load deployment book, CI book, environment docs, architecture docs, package scripts, workflow files, infrastructure files, migrations, feature flags, secrets docs, and relevant code paths.
3. Map the release path from code change to production: build, test, package, provision, deploy, migrate, smoke test, monitor, rollback, and incident response.
4. Check environment parity, secrets boundaries, least-privilege infrastructure, config validation, migration order, rollback compatibility, observability, smoke checks, and support handoff.
5. Propose a deployment or hardening plan with commands, gates, owners, risks, rollback, and verification.
6. If implementing, keep infrastructure as code where the project uses it and document Terraform, Kubernetes, cloud, or platform changes in the relevant harness docs.

## Output

- Include a deployment checklist, environment matrix, risk table, rollback plan, and verification plan.
- Use Mermaid diagrams for deployment flow, CI flow, or rollback flow when useful.
- Call out manual approvals, irreversible operations, and data repair risks.

## Completion Evidence

- Deployment path and rollback path are explicit.
- CI, environment, infrastructure, docs, and smoke checks are synchronized where changed.
- Final report states what was verified and what remains risky.
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
  "harness/skills/automations.md": `# Automations Skill

## Command

pag-automations

## Purpose

Recommend the best agent skills, plugins, hooks, monitors, scheduled checks, CI jobs, and operational automations for the current product, project, team workflow, and AI agent surface such as Codex, Claude, Cursor, Gemini, or Antigravity.

## Preflight Questions

Ask before recommending when missing:

- Which AI agent or surfaces should be optimized: Codex, Claude Code, Cursor, GitHub Copilot, Gemini, Antigravity, multiple agents, or unknown?
- Should recommendations focus on reliability, speed of development, security, observability, documentation, QA, deployments, cost, product discovery, or all of them?
- Is the user asking for advice only, implementation, or a document under harness/?
- Are there tools, budgets, compliance limits, or platforms that must be included or avoided?

## Workflow

1. Read the skill registry and this file before starting.
2. Load README, harness docs, package manifests, CI/deployment files, scripts, observability docs, tasks, codebase map, and agent activation files.
3. Identify project type, stack, risk profile, critical workflows, release process, existing checks, monitoring gaps, and team workflow.
4. Recommend agent-specific setup: skills, rules files, plugins, MCPs, hooks, scheduled automations, background review tasks, CI checks, dashboards, alerts, dependency scans, docs refreshes, and incident/report templates.
5. Prioritize recommendations by impact, effort, risk, tool availability, and maintenance cost.
6. If implementing, keep changes reversible, documented, and synchronized with AGENTS.md, README, harness skills, scripts, CI, and verdicts.

## Output

- Include a recommendation table with agent surface, automation, purpose, setup path, expected benefit, effort, risk, and verification.
- Group recommendations for code quality, security, reliability, observability, deployment, product/docs, and developer speed.
- Mark recommendations that require external accounts, secrets, paid plans, or human approval.

## Completion Evidence

- Recommendations are tailored to inspected project facts.
- Tool assumptions and unavailable evidence are explicit.
- The final report gives a shortlist of highest-value automations and the next setup steps.
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

function createTaskGuideTemplate({ taskId, title }) {
  return `# Implementation Guide: ${title}

## Metadata

- Task ID: \`${taskId}\`
- Status: rewrite
- Current stage: Rewrite
- Risk level: TBD
- Strictness: TBD

## Initial Request

_Record the request verbatim when safe and concise, otherwise write a faithful summary._

## Refined Working Prompt

_Write the researched, product-aware working prompt before planning._

## Context And Evidence

| Source | Why consulted | Material findings | Freshness or limits |
| --- | --- | --- | --- |
| TBD | TBD | TBD | TBD |

## Product And Task Understanding

_Describe users, current behavior, desired outcome, product direction, success criteria, constraints, dependencies, risks, and relevant non-functional needs._

## Scope, Non-Goals, Assumptions, And Open Questions

### Scope

- TBD

### Non-Goals

- TBD

### Assumptions

- TBD

### Open Questions

- TBD

## Task Classification And Rule Register

Task classes: TBD

| Rule ID | Source | Why it applies | Planned evidence | Status |
| --- | --- | --- | --- | --- |
| TBD | TBD | TBD | TBD | Selected |

## Architecture And Design Decisions

_Describe the expected system, boundaries, data flow, patterns, alternatives, tradeoffs, security, reliability, operability, rollout, and rollback._

## Implementation Plan And Change Map

| Order | Change | Files or systems | Dependencies | Verification |
| ---: | --- | --- | --- | --- |
| 1 | TBD | TBD | TBD | TBD |

## Test And Evaluation Matrix

| Requirement or risk | Test level | Method or command | Expected evidence |
| --- | --- | --- | --- |
| TBD | TBD | TBD | TBD |

## Implementation Log

_Record material changes, decisions, deviations, focused checks, and changed files while implementing._

## Evaluation Evidence

| Requirement | Evidence or command | Result | Notes |
| --- | --- | --- | --- |
| TBD | TBD | TBD | TBD |

## Feedback Report

_Summarize what changed, why, system impact, critical review paths, verification, deployment/rollback considerations, manual checks, and incomplete work._

## Iteration, Harness Updates, Residual Risks, And Follow-Ups

_Record evaluation-driven fixes, re-evaluation, durable harness updates, deferred work, residual risks, and final completion status._
`;
}

function printHelp() {
  console.log(`The Production Agent Skill

Usage:
  the-production-agent-skill init [--dry-run] [--root <path>]
  the-production-agent-skill doctor [--root <path>] [--package-root <path>] [--package-only]
  the-production-agent-skill task --id <task-id> [--title <title>] [--root <path>]
  the-production-agent-skill verify-task --id <task-id> [--stage <stage>] [--root <path>]
  the-production-agent-skill recommend [--root <path>] [--agent <name>]
  the-production-agent-skill snippet
  the-production-agent-skill help

Commands:
  init      Create missing harness files and security scripts without overwriting existing files.
  doctor    Check package files, numbered rulebooks, downstream guide files, and security scripts.
  task      Create a non-destructive six-stage task implementation guide.
  verify-task Check required task-guide sections through a lifecycle stage.
  recommend Suggest high-value skills, plugins, and automations for the project and agent surface.
  snippet   Print an activation snippet for AGENTS.md or equivalent agent rules files.
`);
}

function parseArgs(argv) {
  const args = {
    command: argv[2] ?? "help",
    dryRun: false,
    root: process.cwd(),
    packageRoot,
    packageOnly: false,
    agent: "unknown",
    taskId: "",
    title: "",
    stage: "complete"
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

    if (arg === "--agent") {
      args.agent = argv[index + 1] ?? "unknown";
      index += 1;
      continue;
    }

    if (arg === "--id") {
      args.taskId = argv[index + 1] ?? "";
      index += 1;
      continue;
    }

    if (arg === "--title") {
      args.title = argv[index + 1] ?? "";
      index += 1;
      continue;
    }

    if (arg === "--stage") {
      args.stage = (argv[index + 1] ?? "").toLowerCase();
      index += 1;
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
  console.log(`For every project task, read and follow \`node_modules/the-production-agent-skill/instructions.md\`. Treat the user's initial prompt as authoritative intent but incomplete implementation input. Before implementation, create or resume \`harness/planning-notes/<task-id>/implementation-guide.md\`; research the product, current repository, relevant harness and task memory, available agent memory, applicable numbered rulebooks, tools, and current official sources when needed; then write the refined working prompt and implementation-ready plan there. Run all six stages—Rewrite, Planning, Implementation, Evaluation, Feedback, and Iteration—at a depth proportional to risk, but never skip a stage. Take enough time to infer the right rules and architecture instead of optimizing for speed. Record selected \`PAG-*\` rule IDs and evidence, keep affected living harness docs synchronized, preserve unrelated user work, and do not claim completion until evaluation covers the refined goal. Use \`npx the-production-agent-skill task --id <task-id> --title "<title>"\` to create the task guide and \`verify-task --id <task-id> --stage <stage>\` to validate stage evidence. When a \`pag-*\` skill is invoked, load its registry entry and skill file in addition to this lifecycle. When the user explicitly requests \`Update harness\`, follow the numbered harness-maintenance rules in \`instructions.md\`.`);
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

function validateRulebooks(guideRoot) {
  const issues = [];
  const seenIds = new Map();
  const seenRules = new Map();
  const ruleEntries = [];
  const rulePattern = /`?\[(PAG-[A-Z]+-\d{3})\] \[(MUST|SHOULD|MAY)\]`? ([^\n]+)/g;
  const stopWords = new Set(
    "the a an and or to of in for with when where that this it as by from is are be been before after only every must should may do not use keep treat make define ensure relevant project task work behavior rules rule".split(
      " "
    )
  );

  for (const file of rulebookFiles) {
    const absolutePath = join(guideRoot, file);
    if (!existsSync(absolutePath)) continue;

    const content = readFileSync(absolutePath, "utf8");
    const lines = content.split("\n");

    for (let index = 0; index < lines.length; index += 1) {
      const line = lines[index];
      const idsOnLine = line.match(/PAG-[A-Z]+-\d{3}/g) ?? [];
      for (const id of idsOnLine) {
        if (!/\b(MUST|SHOULD|MAY)\b/.test(line)) {
          issues.push(`${file}:${index + 1} gives ${id} no rule strength`);
        }
        if (seenIds.has(id)) {
          issues.push(`${file}:${index + 1} duplicates rule ID ${id} from ${seenIds.get(id)}`);
        } else {
          seenIds.set(id, `${file}:${index + 1}`);
        }
      }

      if (
        /\b(must|must not|should|should not|never|do not|always|required|may not)\b/i.test(line) &&
        idsOnLine.length === 0 &&
        !/^#/.test(line) &&
        !/^\| Rule ID \|/.test(line)
      ) {
        issues.push(`${file}:${index + 1} has unnumbered normative language`);
      }

      if (
        /^- /.test(line) &&
        !/^- `?\[PAG-[A-Z]+-\d{3}\] \[(MUST|SHOULD|MAY)\]`? /.test(line)
      ) {
        issues.push(`${file}:${index + 1} has an unnumbered top-level rule`);
      }
    }

    for (const match of content.matchAll(rulePattern)) {
      const [, id, , text] = match;
      const normalized = text
        .toLowerCase()
        .replace(/`[^`]+`/g, "<code>")
        .replace(/[^a-z0-9<>\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      if (normalized.length >= 45 && seenRules.has(normalized)) {
        issues.push(`${file} duplicates rule text from ${seenRules.get(normalized)}: ${id}`);
      } else {
        seenRules.set(normalized, `${file} (${id})`);
      }

      const tokens = new Set(
        text
          .toLowerCase()
          .replace(/`[^`]+`/g, " ")
          .replace(/[^a-z0-9 ]/g, " ")
          .split(/\s+/)
          .filter((token) => token.length > 2 && !stopWords.has(token))
      );
      ruleEntries.push({ file, id, text, tokens });
    }
  }

  for (let left = 0; left < ruleEntries.length; left += 1) {
    for (let right = left + 1; right < ruleEntries.length; right += 1) {
      const first = ruleEntries[left];
      const second = ruleEntries[right];
      let intersection = 0;
      for (const token of first.tokens) {
        if (second.tokens.has(token)) intersection += 1;
      }
      if (intersection < 8) continue;
      const union = new Set([...first.tokens, ...second.tokens]).size;
      const similarity = union === 0 ? 0 : intersection / union;
      if (similarity >= 0.78) {
        issues.push(
          `${second.file} (${second.id}) is a likely semantic duplicate of ${first.file} (${first.id}); similarity ${similarity.toFixed(2)}`
        );
      }
    }
  }

  const obsoleteConflictPatterns = [
    ["read every harness file", /read (all|every) (current )?`?harness/i],
    ["all rules apply to every task", /all rules .* every task/i],
    ["speed-first execution", /prioriti[sz]e speed|speed is the priority/i],
    ["hardcoded default stack", /the default (backend |frontend )?stack is/i],
    ["hardcoded Safari mandate", /use safari when a browser choice/i]
  ];
  for (const file of rulebookFiles) {
    const absolutePath = join(guideRoot, file);
    if (!existsSync(absolutePath)) continue;
    const content = readFileSync(absolutePath, "utf8");
    for (const [label, pattern] of obsoleteConflictPatterns) {
      if (pattern.test(content)) issues.push(`${file} retains conflicting guidance: ${label}`);
    }
  }

  const corePath = join(guideRoot, "instructions.md");
  if (existsSync(corePath)) {
    const core = readFileSync(corePath, "utf8");
    for (const stage of ["Rewrite", "Planning", "Implementation", "Evaluation", "Feedback", "Iteration"]) {
      if (!core.includes(`### Stage ${["Rewrite", "Planning", "Implementation", "Evaluation", "Feedback", "Iteration"].indexOf(stage) + 1}: ${stage}`)) {
        issues.push(`instructions.md is missing lifecycle stage: ${stage}`);
      }
    }
  }

  const readmePath = join(guideRoot, "README.md");
  if (existsSync(readmePath)) {
    const readme = readFileSync(readmePath, "utf8");
    for (const file of requiredProjectFiles) {
      if (!readme.includes(`\`${file}\``)) {
        issues.push(`README.md does not list required scaffold file: ${file}`);
      }
    }
    for (const command of ["task --id", "verify-task --id"]) {
      if (!readme.includes(command)) issues.push(`README.md does not document CLI command: ${command}`);
    }
  }

  for (const file of requiredGuideFiles) {
    if (typeof templates[file] !== "string") {
      issues.push(`CLI template is missing for required guide file: ${file}`);
    }
  }

  return { issues, ruleCount: seenIds.size };
}

function assertTaskId(taskId) {
  if (!/^\d{8}-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(taskId)) {
    fail("Task ID must use YYYYMMDD-short-kebab-slug.");
  }
}

function createTask({ root, taskId, title }) {
  assertTaskId(taskId);
  const taskTitle = title.trim() || taskId.slice(9).replaceAll("-", " ");
  const path = join(root, "harness", "planning-notes", taskId, "implementation-guide.md");

  if (existsSync(path)) {
    fail(`Task guide already exists and was not overwritten: ${path}`);
  }

  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, createTaskGuideTemplate({ taskId, title: taskTitle }), { flag: "wx" });
  console.log(`Created: ${path}`);
  console.log("Next: complete Rewrite, then run verify-task --stage rewrite.");
}

function getSection(content, heading) {
  const marker = `## ${heading}`;
  const start = content.indexOf(marker);
  if (start === -1) return null;
  const bodyStart = start + marker.length;
  const next = content.indexOf("\n## ", bodyStart);
  return content.slice(bodyStart, next === -1 ? content.length : next).trim();
}

function hasMeaningfulTaskContent(body) {
  if (!body) return false;
  const meaningful = body
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !line.startsWith("_"))
    .filter((line) => !/^\|?[-:|\s]+\|?$/.test(line))
    .filter((line) => !/^(\| )?(Source|Rule ID|Requirement|Order|Task ID)/.test(line))
    .filter((line) => !/^(### (Scope|Non-Goals|Assumptions|Open Questions)|- TBD|Task classes: TBD|\| TBD)/.test(line));
  return meaningful.length > 0;
}

function verifyTask({ root, taskId, stage }) {
  assertTaskId(taskId);
  const requiredSections = taskStageSections[stage];
  if (!requiredSections) {
    fail(`Unknown stage "${stage}". Use rewrite, planning, implementation, evaluation, feedback, iteration, or complete.`);
  }

  const path = join(root, "harness", "planning-notes", taskId, "implementation-guide.md");
  if (!existsSync(path)) fail(`Task guide not found: ${path}`);
  const content = readFileSync(path, "utf8");
  const issues = [];
  const ruleRegister = getSection(content, "Task Classification And Rule Register") ?? "";
  const selectedRuleIds = new Set(ruleRegister.match(/PAG-[A-Z]+-\d{3}/g) ?? []);
  const knownRuleIds = new Set();
  for (const file of rulebookFiles) {
    const absolutePath = join(packageRoot, file);
    if (!existsSync(absolutePath)) continue;
    const matches = readFileSync(absolutePath, "utf8").match(/PAG-[A-Z]+-\d{3}/g) ?? [];
    for (const id of matches) knownRuleIds.add(id);
  }

  for (const heading of requiredSections) {
    const body = getSection(content, heading);
    if (body === null) {
      issues.push(`missing section: ${heading}`);
    } else if (!hasMeaningfulTaskContent(body)) {
      issues.push(`section still lacks task-specific evidence: ${heading}`);
    }
  }

  for (const namespace of taskStageRuleNamespaces[stage]) {
    const prefix = `PAG-${namespace}-`;
    if (![...selectedRuleIds].some((id) => id.startsWith(prefix))) {
      issues.push(`rule register lacks an applicable ${prefix}* rule`);
    }
  }

  for (const id of selectedRuleIds) {
    if (!knownRuleIds.has(id)) issues.push(`rule register references unknown package rule: ${id}`);
  }

  if (stage === "complete") {
    if (!/^- Status: complete$/im.test(content)) issues.push("Metadata Status must be complete");
    if (!/^- Current stage: (Iteration|Complete)$/im.test(content)) {
      issues.push("Metadata Current stage must be Iteration or Complete");
    }
  }

  if (issues.length > 0) {
    console.log(`Task guide: incomplete for ${stage}`);
    for (const issue of issues) console.log(`  - ${issue}`);
    process.exitCode = 1;
    return;
  }

  console.log(`Task guide: ${stage} evidence present`);
  console.log(`  - ${path}`);
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

  const ruleValidation = validateRulebooks(guideRoot);
  if (ruleValidation.issues.length === 0) {
    console.log(`Rule framework: ok (${ruleValidation.ruleCount} numbered rules)`);
  } else {
    console.log("Rule framework: invalid");
    for (const issue of ruleValidation.issues) console.log(`  - ${issue}`);
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

  if (
    missingPackageFiles.length > 0 ||
    missingCustomFiles.length > 0 ||
    ruleValidation.issues.length > 0
  ) {
    process.exitCode = 1;
  }
}

function recommend({ root, agent }) {
  const packageJsonPath = join(root, "package.json");
  const packageJson = existsSync(packageJsonPath)
    ? JSON.parse(readFileSync(packageJsonPath, "utf8"))
    : {};
  const deps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies
  };
  const has = (name) => Object.prototype.hasOwnProperty.call(deps, name);
  const stack = [];

  if (has("next")) stack.push("Next.js");
  if (has("react")) stack.push("React");
  if (has("react-native")) stack.push("React Native");
  if (has("expo")) stack.push("Expo");
  if (has("expo-router")) stack.push("Expo Router");
  if (has("@nestjs/core")) stack.push("NestJS");
  if (has("prisma") || has("@prisma/client")) stack.push("Prisma");
  if (has("typeorm")) stack.push("TypeORM");
  if (has("@playwright/test") || has("playwright")) stack.push("Playwright");
  if (has("vitest")) stack.push("Vitest");
  if (has("jest")) stack.push("Jest");
  if (existsSync(join(root, "terraform")) || existsSync(join(root, "main.tf"))) stack.push("Terraform");
  if (existsSync(join(root, ".github", "workflows"))) stack.push("GitHub Actions");

  const normalizedAgent = agent.toLowerCase();
  const agentTips = [];

  if (normalizedAgent.includes("codex")) {
    agentTips.push("Codex: keep AGENTS.md concise, command-oriented, and synchronized with harness skills; use pag-automations for periodic setup reviews.");
  } else if (normalizedAgent.includes("claude")) {
    agentTips.push("Claude: mirror the activation snippet into CLAUDE.md when that is the active surface and keep project skills as explicit Markdown workflows.");
  } else if (normalizedAgent.includes("cursor")) {
    agentTips.push("Cursor: mirror stable rules into Cursor project rules and keep long operational workflows in harness skills so rules stay focused.");
  } else if (normalizedAgent.includes("antigravity")) {
    agentTips.push("Antigravity: keep agent rules, skills, and automations mapped to the tool's plugin and automation surfaces, then record the mapping in harness/mcp-rules.md.");
  } else {
    agentTips.push("Unknown agent: start with AGENTS.md plus harness skills, then mirror the activation snippet into the tool-specific rule file that the agent actually reads.");
  }

  console.log("# Recommended Agent Skills And Automations");
  console.log("");
  console.log(`Detected stack: ${stack.length > 0 ? stack.join(", ") : "not enough project evidence detected"}`);
  console.log(`Agent surface: ${agent}`);
  console.log("");
  console.log("## Highest-Value Setup");
  console.log("");
  console.log("- Require a task implementation guide for every project task and validate lifecycle evidence with verify-task.");
  console.log("- Add task-guide verification to the project's review or CI workflow when task IDs are available to automation.");
  console.log("- Enable pag-review for focused reviews with clear scope, impact, and evidence.");
  console.log("- Enable pag-optimise for KPI-driven performance, cost, reliability, UX, and maintainability work.");
  console.log("- Enable pag-security and pag-shield for threat modeling, abuse prevention, privacy, and supply-chain hardening.");
  console.log("- Enable pag-deployment for release, rollback, infrastructure, CI/CD, and smoke-test readiness.");
  console.log("- Enable pag-automations to periodically tailor plugins, hooks, checks, dashboards, and alerts to the project.");
  console.log("- Keep Update harness scheduled or repeated after major dependency, architecture, CI, deployment, or product changes.");
  console.log("");
  console.log("## Tool-Specific Notes");
  console.log("");
  for (const tip of agentTips) {
    console.log(`- ${tip}`);
  }
  console.log("");
  console.log("## Automation Backlog");
  console.log("");
  console.log("| Area | Recommended Automation | Evidence To Capture |");
  console.log("| --- | --- | --- |");
  console.log("| Reliability | Health checks, smoke tests, queue-depth alerts, uptime/SLO alerts | observability-book.md and deployment-book.md |");
  console.log("| Security | Dependency audit, secret scanning, permission review, threat-model refresh | security reports and harness/tasks.md |");
  console.log("| Quality | Typecheck, lint, format, unit/integration/E2E gates, codebase consistency codemod dry-runs | CI book and package scripts |");
  console.log("| Product Docs | Feature PRD/FRD/architecture/tasks/workflow/runbook updates | harness/features/<feature>/ |");
  console.log("| Delivery | Draft PR creation, release checklist, rollback checklist, migration preflight | git-workflow.md and deployment-book.md |");
}

function getTemplate(file) {
  if (file === "scripts/supply-chain-audit.mjs") {
    return readFileSync(join(packageRoot, "scripts/supply-chain-audit.mjs"), "utf8");
  }

  if (file === "scripts/codebase-consistency-codemod.mjs") {
    return readFileSync(join(packageRoot, "scripts/codebase-consistency-codemod.mjs"), "utf8");
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
  case "task":
    createTask(args);
    break;
  case "verify-task":
    verifyTask(args);
    break;
  case "recommend":
    recommend(args);
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
