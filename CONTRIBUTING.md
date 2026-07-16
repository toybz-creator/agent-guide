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

3. Install the supported Node.js version (Node 18 or later) and dependencies:

   ```bash
   npm install
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

## Validate Your Work

Run the checks that match your change. Before opening a pull request, run at least:

```bash
npm run validate
npm run pack
npm run publish:dry-run
```

For changes to the published file list, package metadata, or CLI, also create and inspect a local package archive:

```bash
npm pack
```

Do not commit generated `.tgz` archives unless a maintainer explicitly requests a release artifact. Remove the archive after inspection if it is untracked.

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
