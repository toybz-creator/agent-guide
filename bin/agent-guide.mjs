#!/usr/bin/env node

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(__dirname, "..");

const requiredGuideFiles = [
  "custom-agent-guide/PRD.md",
  "custom-agent-guide/FRD.md",
  "custom-agent-guide/Non-FRD.md",
  "custom-agent-guide/architectural-guide.md",
  "custom-agent-guide/project-guide.md",
  "custom-agent-guide/verdicts.md",
  "custom-agent-guide/mcp-rules.md",
  "custom-agent-guide/tasks.md",
  "custom-agent-guide/development-history.md",
  "custom-agent-guide/files-directories.md",
  "custom-agent-guide/backend-handbook.md",
  "custom-agent-guide/frontend-handbook.md",
  "custom-agent-guide/environments-cloud-deployments.md"
];

const packageFiles = [
  "README.md",
  "instructions.md",
  "backend/backend-rules.md",
  "frontend/frontend-rules.md",
  "computer-use/computer-use-agent-rules.md",
  "bin/agent-guide.mjs",
  "package.json"
];

const templates = {
  "custom-agent-guide/PRD.md": `# Product Requirements Document

## Product Goal

_Describe the product outcome this repository exists to deliver._

## Users

_List primary users, roles, and jobs-to-be-done._

## Requirements

_Capture product requirements, non-goals, success metrics, and acceptance criteria._
`,
  "custom-agent-guide/FRD.md": `# Functional Requirements Document

## Functional Scope

_Describe feature behavior, workflows, roles, inputs, outputs, edge cases, and negative paths._
`,
  "custom-agent-guide/Non-FRD.md": `# Non-Functional Requirements Document

## Requirements

_Capture scale, availability, latency, reliability, security, privacy, compliance, observability, support, and deployment expectations._
`,
  "custom-agent-guide/architectural-guide.md": `# Architectural Guide

## System Architecture

_Document architecture decisions, domain boundaries, data flow, infrastructure, CI/CD, and deployment topology._
`,
  "custom-agent-guide/project-guide.md": `# Project Guide

## Context

_Capture project history, current state, roadmap notes, links, conventions, and useful context._
`,
  "custom-agent-guide/verdicts.md": `# Agent Verdicts

This file stores final decisions, project preferences, and conflict resolutions for AI coding agents.

## Settings

- is-non-frd-options-set: false
- web-research: optional
- cached-library-documentation: optional
- lint-format-hooks: unset
- observability-provider: unset
`,
  "custom-agent-guide/mcp-rules.md": `# MCP Rules

## Available Tools

_List available MCPs, plugins, credentials boundaries, safety rules, and when to use each tool._
`,
  "custom-agent-guide/tasks.md": `# Tasks

Keep this file forward-only where practical. Add task status, implementation notes, verification steps, and resumable context.
`,
  "custom-agent-guide/development-history.md": `# Development History

Record meaningful technical changes, decisions, dates, reasoning, and verification notes.
`,
  "custom-agent-guide/files-directories.md": `# Files And Directories

Document the current codebase map grouped by feature or domain.
`,
  "custom-agent-guide/backend-handbook.md": `# Backend Handbook

Document backend architecture, dependencies, modules, data access, service flows, and operational notes.
`,
  "custom-agent-guide/frontend-handbook.md": `# Frontend Handbook

Document frontend architecture, routes, state ownership, data flows, UI systems, and integration notes.
`,
  "custom-agent-guide/environments-cloud-deployments.md": `# Environments, Cloud, And Deployments

Document local and remote environments, infrastructure, secrets policy, deployment flows, rollback, monitoring, and support procedures.
`
};

function printHelp() {
  console.log(`Production Coding Agent Skill Guide

Usage:
  agent-guide init [--dry-run] [--root <path>]
  agent-guide doctor [--root <path>] [--package-root <path>] [--package-only]
  agent-guide snippet
  agent-guide help

Commands:
  init      Create missing custom-agent-guide files without overwriting existing files.
  doctor    Check framework package files and downstream custom-agent-guide files.
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
  console.log(`Before every task, read and follow \`node_modules/production-coding-agent-skill-guide/instructions.md\`.

This file is the director for the AI coding agent. Follow it strictly, then load any project-specific rules from \`custom-agent-guide/\`.`);
}

function init({ root, dryRun }) {
  const created = [];
  const skipped = [];

  for (const file of requiredGuideFiles) {
    const absolutePath = join(root, file);

    if (existsSync(absolutePath)) {
      skipped.push(file);
      continue;
    }

    created.push(file);

    if (!dryRun) {
      mkdirSync(dirname(absolutePath), { recursive: true });
      writeFileSync(absolutePath, templates[file], { flag: "wx" });
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
    console.log("All custom-agent-guide files already exist.");
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
    : requiredGuideFiles.filter((file) => !existsSync(join(root, file)));

  if (missingPackageFiles.length === 0) {
    console.log("Package files: ok");
  } else {
    console.log("Package files: missing");
    for (const file of missingPackageFiles) {
      console.log(`  - ${file}`);
    }
  }

  if (packageOnly) {
    console.log("custom-agent-guide: skipped");
  } else if (missingCustomFiles.length === 0) {
    console.log("custom-agent-guide: ok");
  } else {
    console.log("custom-agent-guide: missing");
    for (const file of missingCustomFiles) {
      console.log(`  - ${file}`);
    }
  }

  if (missingPackageFiles.length > 0 || missingCustomFiles.length > 0) {
    process.exitCode = 1;
  }
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
