# Changelog

## Unreleased

- Hardened release validation with a committed lockfile, `npm ci`, supply-chain auditing, Node 18/20/22 CI coverage, least-privilege workflow permissions, and immutable GitHub Action revisions.
- Added npm repository, homepage, issue-tracker, and author metadata.
- Expanded README quick start, requirements, CLI reference, consumer-package verification, and migration guidance.
- Expanded contributor guidance with a change-surface matrix, versioning/release policy, lockfile expectations, and responsible security reporting.
- Renamed the package, executable command, binary, documentation, and activation paths to Production Agent Guide (`production-agent-guide`) with the short `pag` executable. This is a breaking release for existing consumers.
- Added `CONTRIBUTING.md` with local setup, quality expectations, validation commands, and pull-request guidance.

## 0.2.0

- Added stable numbered `PAG-*` rules with `MUST`, `SHOULD`, and `MAY` strengths.
- Replaced the former task lifecycle with mandatory Rewrite, Planning, Implementation, Evaluation, Feedback, and Iteration stages.
- Added durable per-task implementation guides under `harness/planning-notes/<task-id>/`.
- Added non-destructive creation and stage-aware validation for task implementation guides.
- Added rulebook routing, proportional strictness, conflict resolution, memory and research guidance, and rule-to-evidence requirements.
- Removed duplicate domain completion checklists and consolidated shared rules at their canonical source.
- Reconciled hardcoded stack and browser defaults with project-specific routing.
- Expanded package validation to detect duplicate IDs, unnumbered rules, exact and likely semantic duplicates, obsolete conflict phrases, and missing lifecycle stages.
- Added CLI integration tests for scaffolding, task creation, non-overwrite behavior, and stage verification.
