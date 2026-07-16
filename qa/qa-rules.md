# Quality Assurance Rules

## Purpose

Use these rules for every task that changes executable behavior, tests, configuration, infrastructure, data, or release behavior. They define how a project selects, records, implements, runs, and reports its selected test layers. They complement domain rulebooks; the project QA profile in `harness/verdicts.md` determines the baseline for future implementation tasks.

## QA Profile Setup And Enforcement

- [PAG-QA-001] [MUST] During the first meaningful implementation task, inspect existing tests, scripts, CI, environments, and `harness/verdicts.md` for an explicit QA profile before asking the user.
- [PAG-QA-002] [MUST] If `qa-test-profile` is unset, incomplete, or does not answer which test layers are required after implementation tasks, ask the user to choose the required layers before implementing behavior that needs verification. Offer the layers relevant to the project: static checks, unit, component, integration, API or contract, E2E, manual browser or computer-use, accessibility, visual, security, performance or load, stress or soak, resilience, migration or data, compatibility or device, and smoke or release tests.
- [PAG-QA-003] [MUST] Record the user's chosen layers, required commands or methods, test environment and fixture policy, manual-browser expectation, scope exceptions, and date or source of the decision in `harness/verdicts.md`. Keep this decision project-specific; do not change it on a later task without user authorization or a documented conflict-resolution decision.
- [PAG-QA-004] [MUST] For every implementation task, load the recorded QA profile during planning, select every required layer that applies to the changed behavior, add or update meaningful coverage for those layers, and run the recorded command or method before claiming completion. A selected layer is not optional merely because a narrower check passes.
- [PAG-QA-005] [MUST] If the profile selects unit and E2E testing, every behavior-changing task must add or update meaningful unit and E2E coverage and run both layers. If the profile selects manual browser or computer-use testing, every applicable user-facing task must also manually exercise the changed flow using the available browser or computer-use capability, guided by the task's intended end goal rather than only by the automated test steps.
- [PAG-QA-006] [MUST] Do not create superficial tests only to satisfy a count. Each selected test must assert an observable requirement, risk, regression, or contract and fail for a plausible broken implementation.
- [PAG-QA-007] [MUST] Reassess the QA profile when a task introduces a new interface, trust boundary, runtime, data store, release path, scale risk, regulatory requirement, or user journey that the profile does not cover. Ask the user only when the missing choice materially changes effort, tooling, environment, permissions, cost, or release risk; then record the answer in `harness/verdicts.md`.
- [PAG-QA-008] [MUST] A missing environment, fixture, credential, browser capability, or permission does not waive a selected layer. Record the exact blocker, safe alternative evidence, residual risk, and next action in the task guide; do not report full completion unless the user accepts the deferral or the project verdict provides an approved exception.

## Test Strategy And Test Data

- [PAG-QA-009] [MUST] Build a task-specific test matrix before implementation. Map each changed requirement and credible failure mode to the selected test layer, method, expected evidence, owner, environment, fixture, and cleanup requirement.
- [PAG-QA-010] [MUST] Use deterministic, isolated, least-privilege test data. E2E, security, load, destructive, and manual tests must not mutate production data or real customer accounts unless the user explicitly authorizes a controlled production procedure with rollback and audit safeguards.
- [PAG-QA-011] [MUST] Keep test fixtures representative of supported roles, tenants, permissions, lifecycle states, empty states, malformed input, failure responses, and important boundary values. Reset or namespace fixtures so parallel and repeat runs do not leak state.
- [PAG-QA-012] [MUST] Test the behavior enforced at the real boundary. Do not treat mocked unit coverage as proof of database, network, authentication, authorization, browser, provider, deployment, or performance behavior.
- [PAG-QA-013] [MUST] Test relevant success, validation, empty, loading, error, unauthorized, forbidden, conflict, duplicate, timeout, retry, partial-failure, recovery, and rollback paths. Add concurrency, idempotency, ordering, or stale-data scenarios when the changed workflow can suffer those failures.
- [PAG-QA-014] [MUST] Keep tests stable: control time, randomness, network dependencies, test data, process lifecycle, and asynchronous completion; investigate flaky results instead of retrying until green and treating that as evidence.

## Automated Test Layers

- [PAG-QA-015] [MUST] For selected static checks, run the project formatter, linter, type checker, build, schema validation, and generated-file checks that apply to the change. Treat a passing build as only one layer of evidence.
- [PAG-QA-016] [MUST] For selected unit tests, cover deterministic domain logic, validators, transformations, policies, state transitions, error mapping, and boundary conditions in isolation. Prefer direct inputs and outputs over implementation-call assertions.
- [PAG-QA-017] [MUST] For selected component tests, verify meaningful UI states, accessible roles and names, keyboard interaction, validation, loading, empty, error, and permission states without coupling assertions to implementation details.
- [PAG-QA-018] [MUST] For selected integration tests, exercise real module boundaries such as routes, services, databases, caches, queues, files, webhooks, and provider adapters using an isolated environment or high-fidelity controlled substitute. Verify serialization, validation, auth, authorization, persistence, transactions, and error contracts together.
- [PAG-QA-019] [MUST] For selected API or contract tests, verify request and response schemas, versioning, authentication, authorization, pagination, errors, webhooks, event payloads, and consumer expectations. Run provider and consumer checks whenever a shared contract changes.
- [PAG-QA-020] [MUST] For selected E2E tests, drive critical user or operator journeys through production-like entrypoints and verify the visible outcome plus the necessary persisted or external effect. Cover relevant roles, key navigation, forms, redirects, and high-risk regressions with deterministic fixtures.
- [PAG-QA-021] [MUST] For selected migration or data tests, prove schema creation or upgrade, backward-compatible deploy order where required, constraints, backfills, reruns, rollback or repair, and representative legacy data. Verify no unsupported data loss, lock, or integrity regression is hidden by an empty test database.
- [PAG-QA-022] [MUST] For selected smoke or release tests, validate the deployed artifact, configuration, health/readiness, critical dependencies, and one safe end-to-end path in the target environment after release.

## Manual Browser, Computer-Use, Visual, And Accessibility Testing

- [PAG-QA-023] [MUST] For selected manual browser or computer-use testing, derive a concise exploratory charter from the changed behavior, product goal, expected end state, affected roles, and known risks. Exercise the real flow, inspect visible states and errors, and verify the outcome a user or operator would rely on; do not merely repeat a happy-path click sequence.
- [PAG-QA-024] [MUST] For user-facing changes, manually check the applicable happy path, validation and error recovery, navigation, role or permission behavior, persistence or refresh behavior, keyboard basics, and responsive layout. Also inspect browser console and relevant network requests when they can reveal task-related failures.
- [PAG-QA-025] [MUST] Use browser or computer-use safely: prefer local or approved test environments, use test accounts, avoid destructive actions, redact sensitive screenshots, and obtain explicit confirmation before production-impacting actions.
- [PAG-QA-026] [MUST] For selected visual testing, compare affected screens at the project-approved desktop and mobile viewports against declared design references or existing design language. Record viewport, state, reference, and any intentional deviation.
- [PAG-QA-027] [MUST] For selected accessibility testing, combine automated checks with manual keyboard, focus, semantic, label, contrast, zoom or reflow, and screen-reader-relevant inspection proportional to the changed UI. Automated accessibility checks alone are insufficient evidence for a complex interaction.

## Security, Performance, And Resilience Testing

- [PAG-QA-028] [MUST] For selected security testing, test the real trust boundaries affected by the change: authentication, authorization, tenant isolation, input validation, output encoding, CSRF, rate limits, file handling, secrets exposure, dependency risk, logging redaction, and abuse paths. Use only authorized targets and non-destructive payloads unless the user explicitly authorizes a controlled security exercise.
- [PAG-QA-029] [MUST] For selected performance or load testing, define a realistic workload, data shape, concurrency, duration, target environment, budgets, and success thresholds before running. Measure latency distribution, throughput, errors, saturation, and resource or cost signals; compare results to a baseline where one exists.
- [PAG-QA-030] [MUST] For selected stress, spike, soak, or endurance testing, intentionally test behavior at and beyond expected capacity, sudden traffic changes, and sustained operation. Define stop conditions, protect shared environments, observe recovery, and record degradation, data integrity, queue buildup, memory, connection, and cost effects.
- [PAG-QA-031] [MUST] For selected resilience or chaos testing, inject controlled dependency, network, timeout, retry, restart, failover, and partial-failure conditions. Verify user-visible degradation, idempotency, recovery, alerts, repair paths, and absence of duplicate or lost effects.

## Evidence, CI, And Completion

- [PAG-QA-032] [MUST] Make selected automated test layers repeatable through documented project commands and run them in CI when the project has CI. Keep local commands, package scripts, CI workflows, and `harness/verdicts.md` synchronized.
- [PAG-QA-033] [MUST] Record per-layer command or method, environment, fixture, result, relevant logs or screenshots, failures, skips, and residual risk in the task guide. Report what the evidence proves and what it does not prove.
- [PAG-QA-034] [MUST] Review changed tests for false confidence: confirm that they fail under a plausible regression, assert the intended contract, isolate external state, and do not mask failures through broad mocks, retries, weak assertions, or skipped branches.
- [PAG-QA-035] [MUST] Update `harness/verdicts.md`, CI documentation, test runbooks, feature docs, and task history when the task establishes a new QA command, fixture, environment, browser workflow, quality threshold, or recurring test failure rule.
