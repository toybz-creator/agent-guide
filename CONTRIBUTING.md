# Contributing to Production Agent Guide

Thank you for improving Production Agent Guide. This repository ships both an npm package and guidance that coding agents will follow, so each contribution must be precise, testable, and safe for downstream projects.

## Before You Start

1. Read `AGENTS.md` and the files relevant to your change.
2. Search for existing rules, commands, and documentation before adding new ones.
3. Open an issue or start a discussion before a large behavior, package-contract, or architecture change so maintainers can agree on the direction.
4. Keep one pull request focused on one coherent outcome. Do not include unrelated cleanup.

## Local Setup

1. Fork the repository on GitHub and clone your fork.
2. Create a branch from the current default branch:

   ```bash
   git checkout -b feat/short-description
   ```

3. Install a supported Node.js version (18, 20, or 22) and dependencies:

   ```bash
   npm ci
   ```

4. Confirm the starting point:

   ```bash
   npm run validate
   ```

## Make a Change

- Follow the repository instructions in `AGENTS.md`.
- Preserve stable `PAG-*` rule IDs. Add a new ID for new guidance; do not repurpose an existing ID.
- Keep public documentation, CLI help, scaffold templates, validation, and tests synchronized when the package contract changes.
- Keep `init` non-destructive: it must create missing downstream files without overwriting existing user work.
- Add or update focused tests for CLI behavior changes.
- Use clear, direct Markdown. Write rules that explain when they apply, the action required, what to avoid, and the completion evidence.

## Choose The Right Change Surface

Use this matrix before editing so the published package remains internally consistent.

| Change | Update and verify |
| --- | --- |
| Rule behavior | The canonical rulebook, rule IDs, `instructions.md` routing, affected stack guides, and relevant task-guide validation. |
| CLI or scaffold behavior | `bin/pag.mjs`, CLI help, README command reference, generated templates, focused tests, and package file list. |
| Public package contract | `package.json`, README, CHANGELOG, pack output, consumer-style install check, and release notes. |
| Documentation only | The source-of-truth document, mirrored summaries, local links, examples, and any claims about commands or CI. |
| Release workflow | `.github/workflows/`, supported Node matrix, lockfile, least-privilege permissions, and a dry-run package check. |

## Versioning, Changelog, And Releases

- Keep `CHANGELOG.md` under `Unreleased` while work is in progress. Move user-facing changes into a versioned section when preparing a release.
- Use a new npm version for every release-worthy package change; npm versions cannot be overwritten.
- Describe behavior changes, CLI/scaffold compatibility, and migrations in the changelog and pull request.
- Commit the package-manager lockfile. CI uses `npm ci` so that validation runs against the reviewed dependency graph.
- Do not publish from a local machine unless a maintainer explicitly authorizes it. The release workflow publishes from `main` after validation.

## Validate Your Work

Run the checks that match your change. Before opening a pull request, run at least:

```bash
npm run validate
npm run pack
npm run publish:dry-run
npm run security:supply-chain
```

For changes to the published file list, package metadata, or CLI, also create and inspect a local package archive:

```bash
npm pack
```

Do not commit generated `.tgz` archives unless a maintainer explicitly requests a release artifact. Remove the archive after inspection if it is untracked.

For a release or package-contract change, also prove that a consumer can use the packed result:

```bash
npm pack
# Install the generated archive into a temporary project, then run:
npx pag help
npx pag init --dry-run
```

## Open a Pull Request

1. Rebase or merge the current default branch into your branch and resolve conflicts.
2. Review the complete diff and confirm unrelated files were not changed.
3. Push your branch to your fork:

   ```bash
   git push -u origin feat/short-description
   ```

4. Open a pull request against the repository's default branch.
5. Use a concise, outcome-focused title and include:
   - the problem and the intended outcome;
   - the files and behavior changed;
   - validation commands and their results;
   - compatibility or migration notes, especially for package, CLI, scaffold, or rule-ID changes;
   - known limitations or follow-up work.
6. Respond to review feedback with focused commits, re-run affected checks, and update the pull request description when the behavior changes.

## Reporting Issues

Include the package version or commit, Node.js version, operating system, exact command, expected result, actual result, and a minimal reproduction when reporting a bug. Do not include secrets, access tokens, or private project data.

## Reporting Security Issues

Do not open a public issue for a suspected vulnerability that could expose users, repositories, credentials, or systems. Contact the maintainers privately with the affected version or commit, impact, reproduction steps, and any safe mitigation. Do not include secrets or exploit payloads in the report.
