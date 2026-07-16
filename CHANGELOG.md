# Changelog

## Unreleased

- Renamed the package, executable command, binary, documentation, and activation paths to Production Agent Guide (`production-agent-guide`) with the short `pag` executable. This is a breaking release for existing consumers.
- Added `CONTRIBUTING.md` with local setup, quality expectations, validation commands, and pull-request guidance.

## 0.2.0

- Added stable numbered `PAG-*` rules with `MUST`, `SHOULD`, and `MAY` strengths.
- Replaced the former task lifecycle with mandatory Rewrite, Planning, Implementation, Evaluation, Feedback, and Iteration stages.
- Added durable per-task implementation guides under `harness/planning-notes/<task-id>/`.
- Added non-destructive `task` creation and stage-aware `verify-task` commands.
- Added rulebook routing, proportional strictness, conflict resolution, memory and research guidance, and rule-to-evidence requirements.
- Removed duplicate domain completion checklists and consolidated shared rules at their canonical source.
- Reconciled hardcoded stack and browser defaults with project-specific routing.
- Expanded package validation to detect duplicate IDs, unnumbered rules, exact and likely semantic duplicates, obsolete conflict phrases, and missing lifecycle stages.
- Added CLI integration tests for scaffolding, task creation, non-overwrite behavior, and stage verification.
