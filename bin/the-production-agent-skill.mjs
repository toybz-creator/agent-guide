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
  "harness/prompt-template.md"
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
  console.log(`Prior to initiating any coding task, you must first access, read and strictly comply with all requirements outlined in \`node_modules/the-production-agent-skill/instructions.md\`. This file serves as the official operational directive for the AI coding agent and must be followed in its entirety without omission. After completing the review of the core guide, proceed to load and integrate all project-specific rules contained within the \`harness/\` directory. All rules specified in both the core guide and project-specific guides are binding contractual requirements that must be fully adhered to in all applicable scenarios. Under no circumstances may any rule be skipped, disregarded, or incompletely implemented. You are required to validate compliance with every relevant rule before executing any coding work and during first review to ensure full alignment with the established standards. When the user says \`Update harness\` or a clear variant, you must follow the \`Update Harness Command\` workflow in \`instructions.md\`: inspect the project and harness, brief the user on planned updates, wait for agreement, update project memory, cache important official library documentation, strengthen local agent instructions, add useful automation where appropriate, verify the changes, and provide a comprehensive report.`);
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
