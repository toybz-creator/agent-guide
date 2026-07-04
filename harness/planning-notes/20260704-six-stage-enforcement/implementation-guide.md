# Implementation Guide: Six-Stage Rule Enforcement

## Metadata

- Task ID: `20260704-six-stage-enforcement`
- Status: complete
- Current stage: Complete
- Risk level: Medium
- Strictness: Standard
- Owner: Repository maintainer

## Initial Request

Optimize the Production Agent Skill by numbering rules, removing duplicate rules, resolving conflicts, teaching agents to infer the rulebooks needed for a task, prioritizing thorough planning over speed, and mandating a durable Rewrite, Planning, Implementation, Evaluation, Feedback, and Iteration workflow for every project task.

## Refined Working Prompt

Evolve the package from a prose-only rule collection into a coherent, numbered, inspectable execution framework. Establish stable `PAG-*` rule IDs and strengths; make rule selection task-specific; remove duplicate lifecycle and completion instructions; resolve known conflicts between universal and conditional guidance; require every project task to create `harness/planning-notes/<task-id>/implementation-guide.md`; define six mandatory stages whose depth is proportional to risk; synchronize public docs, activation, CLI scaffolds, and package behavior; add non-destructive task creation and stage verification; and validate unique IDs, likely semantic duplicates, obsolete conflict phrases, required lifecycle stages, task artifacts, and CLI behavior.

## Context And Evidence

| Source | Why consulted | Material findings | Freshness or limits |
| --- | --- | --- | --- |
| `AGENTS.md` | Repository contract | Public behavior, CLI templates, README, and validation must stay synchronized | Current checkout |
| `README.md` | Public activation contract | Activation was a dense paragraph asking agents to obey everything | Current checkout |
| `instructions.md` | Core behavior | Lifecycle, docs, tool selection, safety, and completion rules overlapped | Current checkout |
| Domain rulebooks | Conditional rules | Backend, frontend, mobile, computer-use, and arsenal guidance lacked stable IDs and contained some hardcoded defaults | Current checkout |
| CLI source | Enforcement surface | `doctor` checked file existence only; no task artifact or stage verification existed | Current checkout |
| Package scripts | Validation surface | `validate` only ran package-only doctor; no behavioral CLI tests existed | Current checkout |
| Normalized and Jaccard rule comparison | Duplicate analysis | One high-similarity cross-domain public-module rule was moved to the core canonical source | Current checkout |

## Product And Task Understanding

The product should help an agent reason well, not merely present more text. The core failure mode is attention and enforcement: undifferentiated instructions compete, duplicate guidance dilutes priority, and existence checks do not prove that an agent selected or applied rules. The optimized system therefore needs traceable rule IDs, conditional routing, durable task reasoning, lifecycle gates, and executable validation while remaining stack-neutral and non-destructive.

## Scope, Non-Goals, Assumptions, And Open Questions

### Scope

- Number shipped core and domain rules.
- Define rule strengths, conflict priority, rulebook routing, and proportional strictness.
- Implement the six-stage lifecycle and durable task artifact.
- Synchronize activation, README, CLI scaffold, and prompt template.
- Add rule-framework validation and CLI integration tests.

### Non-Goals

- Build a model-specific runtime that can force an external agent process to read files.
- Publish the npm package or modify downstream repositories.
- Select project-specific technologies for package consumers.

### Assumptions

- The package can enforce observable artifacts and validators, while instruction adherence inside an external model remains partly probabilistic.
- `standard` is the default strictness.
- Every project task uses all stages, while small tasks use concise evidence.

### Open Questions

- A future release may add machine-readable JSON output and CI-specific task-receipt validation.

## Task Classification And Rule Register

Task classes: package behavior, CLI, documentation, agent workflow, testing

| Rule ID | Source | Why it applies | Planned evidence | Status |
| --- | --- | --- | --- | --- |
| `PAG-CORE-008` | `instructions.md` | Each rule needs one canonical home | Duplicate analysis and rewritten rulebooks | Applied |
| `PAG-CORE-025` | `instructions.md` | All six stages govern this task | This implementation guide | Applied |
| `PAG-RWR-016` | `instructions.md` | Refined prompt must precede planning | Refined prompt section | Applied |
| `PAG-PLN-012` | `instructions.md` | Plan and change map must be durable | Plan section | Applied |
| `PAG-IMP-001` | `instructions.md` | Implementation follows the rule register | Diff and implementation log | In progress |
| `PAG-EVL-008` | `instructions.md` | Validators must cover claimed requirements | CLI integration tests and manual audit | Planned |
| `PAG-FDB-004` | `instructions.md` | Verification must be reported as evidence | Feedback report | Planned |
| `PAG-ITR-004` | `instructions.md` | Reusable workflow findings belong in the harness | Package and task-guide updates | In progress |
| `PAG-DONE-005` | `instructions.md` | Evaluation scope must match requirement scope | Completion audit | Planned |

## Architecture And Design Decisions

- `instructions.md` is the canonical lifecycle and cross-cutting rule source.
- Domain rulebooks contain only domain-specialized requirements and use stable namespaces: `PAG-BE`, `PAG-FE`, `PAG-MOB`, `PAG-CU`, and `PAG-ARS`.
- The CLI owns safe task-guide creation, scaffold generation, package rule validation, and stage-evidence verification.
- `harness/planning-notes/<task-id>/implementation-guide.md` is task evidence; product-wide harness files remain durable project truth.
- Stage depth is risk-proportional, but stage presence is invariant.
- Rule validation uses exact normalized comparison plus high-threshold token-set similarity to catch likely duplicates without treating related but distinct rules as duplicates.

## Implementation Plan And Change Map

| Order | Change | Files or systems | Dependencies | Verification |
| ---: | --- | --- | --- | --- |
| 1 | Replace core lifecycle and conflict contract | `instructions.md` | Repository rules | Rule validator |
| 2 | Number and reconcile domain rules | backend, frontend, mobile, computer-use, arsenal | Core taxonomy | Unique-ID and similarity checks |
| 3 | Add task workspace and stage verifier | CLI templates and commands | Task contract | Integration tests |
| 4 | Synchronize public activation and setup | `README.md`, CLI snippet, prompt template | CLI behavior | Snippet/help/scaffold inspection |
| 5 | Strengthen package validation | `package.json`, tests | CLI | `npm run validate` |
| 6 | Run publish-facing and scaffold audit | Package and temporary downstream project | All changes | pack, dry-run, doctor, task verification |

## Test And Evaluation Matrix

| Requirement or risk | Test level | Method or command | Expected evidence |
| --- | --- | --- | --- |
| Unique numbered rules | Integration | `npm run validate` | Rule framework passes with a count |
| Duplicate prevention | Integration | Rule validator exact and similarity checks | No duplicate issue |
| Non-destructive task creation | Integration | `npm test` | Existing guide is not overwritten |
| Incomplete planning detection | Integration | `verify-task --stage rewrite` on template | Non-zero result |
| Completed planning acceptance | Integration | Populate evidence and verify planning | Zero result |
| Scaffold synchronization | Integration | `init` then `doctor` in temporary root | Harness is complete |
| Publish contents | Package | `npm run pack`, `npm run publish:dry-run` | Expected files included |
| Activation synchronization | Inspection | Compare README and `snippet` output | Same lifecycle contract |

## Implementation Log

- Replaced the former eleven-step lifecycle with six mandatory stages and proportional depth.
- Added core rule strength, conflict, routing, artifact, quality, safety, and completion contracts.
- Numbered domain rules and removed duplicate completion checklists.
- Removed hardcoded default backend/frontend stacks and the Safari mandate.
- Consolidated duplicate backend/frontend module-public-API rules into `PAG-IMP-014`.
- Replaced the duplicated long prompt template with a short activation prompt pointing to the canonical task guide.
- Added `task` and `verify-task` CLI commands.
- Added unique-ID, missing-strength, unnumbered-rule, unnumbered-normative-language, exact-duplicate, near-duplicate, conflict-pattern, scaffold-sync, and lifecycle-stage validation.
- Added CLI integration tests, activation drift checks, and expanded `npm run validate`.
- Reduced the core guide from 6,364 to 4,021 words while making its lifecycle and evidence contract explicit.

## Evaluation Evidence

| Requirement | Evidence or command | Result | Notes |
| --- | --- | --- | --- |
| CLI syntax | `node --check bin/the-production-agent-skill.mjs` | Pass | No syntax errors |
| Numbered framework | `npm run validate` | Pass | 715 unique numbered rules; strength, normative-language, duplicate, conflict, scaffold, and lifecycle checks pass |
| CLI behavior | `npm test` | Pass | Six integration tests pass |
| Downstream scaffold | fresh `init` then `doctor --root <temp> --package-root .` | Pass | 40 files created; package, numbered rules, and harness pass |
| Empty artifact enforcement | `verify-task --stage rewrite` on a new guide | Expected failure | Missing rewrite evidence and required rule namespaces reported |
| Completed artifact enforcement | integration test for `verify-task --stage complete` | Pass | All lifecycle sections and namespaces accepted |
| Package contents | `npm run pack` | Pass | 22 expected files; tests and changelog included |
| Publish contract | `npm run publish:dry-run` | Pass | `the-production-agent-skill@0.2.0`; authentication warning is expected for dry-run |
| Activation synchronization | README/CLI integration test | Pass | README activation equals `snippet` output |
| Diff hygiene | `git diff --check` | Pass | No whitespace errors |

## Feedback Report

The package is now a versioned `0.2.0` execution framework rather than a prose-only collection. Every shipped normative rule has a stable ID and strength. The core guide owns conflict resolution, task routing, the six stages, task artifacts, quality gates, safety, and terminal completion. Domain rulebooks retain specialized engineering detail without duplicate completion checklists. Agents are instructed to treat the initial prompt as incomplete implementation input, gather product/repository/harness/memory/web evidence, select the smallest complete rule set, write the refined working prompt and architecture into a durable task guide, implement from it, evaluate the actual end goal, report evidence, and iterate both product and harness.

The CLI now makes compliance observable: `task` creates the artifact without overwriting existing work; `verify-task` checks section evidence, required lifecycle rule namespaces, known package IDs, and completion metadata; `doctor` validates the package rule framework and scaffold synchronization. Package integration tests exercise activation drift, scaffold creation, non-overwrite behavior, incomplete-stage rejection, planning acceptance, and complete-lifecycle acceptance.

## Iteration, Harness Updates, Residual Risks, And Follow-Ups

- The current repository task guide demonstrates the new durable workflow.
- All affected public docs, CLI templates, package metadata, validation, tests, and domain rulebooks were synchronized.
- Model-internal compliance cannot be made deterministic by an npm package alone. The artifact, rule register, stage verifier, package doctor, and tests make non-compliance visible and provide a foundation for CI gating.
- A future release can add machine-readable `doctor --json`, a CI task-receipt schema, and cross-agent behavioral evaluation fixtures; these are enhancements rather than missing requirements for this objective.
