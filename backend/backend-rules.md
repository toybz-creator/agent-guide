# Backend Production Rules

## Purpose

These rules apply to backend, API, database, infrastructure, job, event, auth, storage, integration, and service-layer work.

The default backend stack is TypeScript with NestJS where applicable, but the principles apply to any production backend. Prefer framework-native patterns, strong typing, explicit contracts, and project-owned wrappers around low-level libraries.

## Backend Mission

Build backend systems that are correct, secure, observable, resilient, efficient, and easy to operate. A backend task is complete only when API behavior, validation, persistence, authorization, failure handling, tests, and docs are aligned.

## Architecture

- Organize by domain/feature when possible. Keep controllers/routes, DTOs, services, policies, persistence adapters, tests, and feature docs close enough to understand the feature as a unit.
- Keep boundaries explicit: controllers handle transport concerns, services handle use cases, domain modules handle business rules, persistence adapters handle storage, and infrastructure modules handle external systems.
- Avoid leaking persistence models, framework request objects, external SDK objects, or low-level client details across module boundaries.
- Prefer dependency injection and interfaces for integrations that may change, need testing, or require policy enforcement.
- Use event-driven, queue-based, streaming, or scheduled architectures when they fit the workflow better than synchronous request/response.
- Do not create unnecessary abstraction layers. Add wrappers when they enforce product policy, improve testability, centralize risk, or match existing architecture.

## API And Communication Contracts

- Use the right communication pattern for the task: REST, GraphQL, WebSockets, Server-Sent Events, gRPC, NATS, message queues, scheduled jobs, webhooks, WebRTC signaling, or domain events.
- Keep public contracts explicit, version-aware, documented, and backward-compatible unless a breaking change is approved.
- For NestJS controllers/routes, include Swagger/OpenAPI documentation: tags, operation summaries, params, query, body, responses, errors, auth requirements, and important examples.
- Validate every external input: params, query, body, headers, files, webhook payloads, environment variables, queue payloads, and event messages.
- Use DTOs and schemas consistently. Prefer Zod, class-validator/class-transformer, OpenAPI schemas, or the project’s established validation stack.
- Return predictable response envelopes and error shapes when the project uses them. Do not invent a second API style.
- Generate or maintain shared client types where useful so frontend and backend contracts stay aligned.
- Treat webhooks and external callbacks as hostile input: verify signatures, timestamps, replay windows, payload shape, idempotency keys, and source identity.

## Data Access And Persistence

- Centralize database access behind project-owned table/repository/data-source adapters. Low-level ORM repositories, raw clients, and query builders should be used only inside the corresponding adapter.
- For TypeORM, expose per-entity access through an `EntityNameTable` or equivalent adapter. Services should call adapter methods rather than injecting `Repository<Entity>` directly.
- Apply the same wrapper rule to Prisma, Drizzle, Knex, Mongoose, Redis clients, search clients, object storage, and analytics stores.
- Adapter methods should encode product defaults: pagination, filtering, sorting, tenant scoping, soft deletes, RBAC-aware predicates when appropriate, transactions, timeouts, query hints, and safe defaults.
- Use transactions for multi-step writes that must be atomic. Make transaction boundaries visible and avoid hidden nested transaction behavior.
- Design writes for idempotency where retries, webhooks, jobs, or distributed systems are involved.
- Avoid unbounded queries. Use pagination, streaming, cursors, limits, projections, and indexes.
- Check query plans for high-risk or high-volume reads/writes. Add indexes deliberately and document expected access patterns.
- Preserve data integrity with constraints, unique indexes, foreign keys where appropriate, optimistic/pessimistic locking when needed, and clear consistency rules.

## Migrations

- Never use destructive `drop*` operations in a new `up()` migration unless explicitly approved.
- Prefer staged deprecation: make retiring columns nullable if needed, rename old columns to `<column_name>_deprecated`, rename old tables to `<table_name>_deprecated`, migrate consumers, then remove in a separately approved cleanup.
- Migrations must be reversible when practical, reviewed for data loss, and safe for production deployment order.
- Consider zero-downtime deployment: backward-compatible schema first, code rollout second, cleanup later.
- Include data backfill strategy, batching, locks, timeout risk, monitoring, and rollback notes for large migrations.

## Wrappers And Policy Enforcement

Use project-owned adapters/facades for:

- database and ORM clients
- cache clients
- queues and job processors
- event buses and pub/sub
- auth providers and RBAC engines
- secrets managers
- email/SMS/push providers
- file/object storage
- payment providers
- external APIs
- feature flags
- search engines
- telemetry/logging/metrics/tracing
- config loaders

Wrappers should enforce shared policy:

- timeouts
- retries and backoff
- circuit breakers when useful
- input/output validation
- idempotency
- tenant and permission scoping
- logging and metrics
- correlation/request IDs
- error translation
- rate limits
- test doubles
- secure defaults

Prevent direct low-level client use by convention, lint rules, code ownership, module exports, or architectural tests where practical.

## Reliability And Async Work

- Model async/stateful flows with explicit states and transitions.
- Every job, event handler, webhook, and scheduled task should define idempotency, retry policy, timeout, dead-letter behavior, concurrency limits, and observability.
- Use exponential backoff with jitter for retriable failures. Do not retry validation errors, auth errors, or known permanent failures.
- Use dead-letter queues or failure tables for work that cannot be safely dropped.
- Protect downstream systems with rate limits, bulkheads, queue concurrency, circuit breakers, and timeouts.
- Make partial failure visible and recoverable.
- Avoid hidden background work from request handlers unless it is durable, observable, and safe to retry.
- Use locks, uniqueness constraints, idempotency keys, or compare-and-swap patterns to prevent duplicate side effects.
- Include health checks and readiness checks for critical dependencies.

## Security

- Enforce authentication and authorization at the correct boundary. Protected routes, services, jobs, and events must not rely on UI-only checks.
- Use RBAC, ABAC, tenant scoping, or policy checks consistently with the project model.
- Validate and sanitize inputs. Encode outputs in the appropriate context.
- Keep secrets in environment/secret managers only. Never log secrets, tokens, passwords, private keys, session cookies, or sensitive payloads.
- Store passwords only with strong one-way hashing using accepted algorithms and parameters.
- Use secure cookie/session settings and CSRF protection where relevant.
- Add rate limits and abuse prevention for auth, search, uploads, mutations, webhooks, and expensive endpoints.
- Verify file uploads for type, size, malware policy where applicable, storage permissions, and safe URLs.
- Avoid SSRF, path traversal, SQL injection, command injection, insecure deserialization, confused deputy problems, and privilege escalation.
- Maintain audit logs for sensitive actions, permission changes, data exports, admin actions, auth events, and destructive operations.

## Observability And Operations

- Use structured logs with stable event names, severity, request/correlation IDs, actor IDs when safe, tenant IDs when safe, and important domain identifiers.
- Emit metrics for latency, throughput, errors, retries, queue depth, job age, dead letters, cache hit rate, dependency health, and business-critical events.
- Use tracing across service boundaries and async workflows where supported.
- Make operational states visible: pending, processing, retrying, failed, completed, cancelled, expired, and compensated.
- Add alerts for user-impacting failures, saturation, SLO breaches, queue buildup, dependency failures, and security-sensitive anomalies.
- Keep logs useful and bounded. Avoid noisy logs, high-cardinality metrics, and sensitive data leakage.

## Performance And Efficiency

- Avoid blocking operations in hot paths.
- Use caching deliberately with clear keys, TTLs, invalidation strategy, stampede protection, and tenant/user scoping.
- Prefer batching, pagination, projections, streaming, compression, and background processing when they reduce load safely.
- Watch for N+1 queries, unbounded joins, large payloads, synchronous external calls, and memory-heavy transformations.
- Use connection pools, timeouts, and resource limits deliberately.
- Treat cost as an engineering concern: retries, logs, traces, storage, queues, and external API calls must be bounded.

## Config And Environment

- Validate all configuration at startup with typed schemas.
- Keep environment-specific behavior explicit and documented.
- Fail fast on missing required configuration.
- Avoid hardcoded URLs, credentials, timeouts, limits, feature flags, or environment names.
- Prefer central config modules that expose typed values and shared defaults.
- Document local, staging, production, and preview environment differences in `custom-agent-guide/environments-cloud-deployments.md`.

## Testing

- Unit test domain logic, services, policies, validators, and adapters.
- Integration test database access, API endpoints, auth/RBAC, queues, cache, webhooks, and external integration wrappers.
- E2E test critical user and admin flows.
- Include negative tests for validation, authorization, missing resources, duplicate requests, concurrency, and dependency failures.
- Use deterministic fixtures and test data builders.
- Avoid tests that only assert mocks were called when behavior can be asserted.
- For migrations, test forward migration and rollback where practical.

## Documentation

- Keep Swagger/OpenAPI docs accurate for all controllers/routes and public backend interfaces.
- Document feature architecture, data model, events/jobs, operational behavior, and failure modes in the relevant custom guide files.
- Update `backend-handbook.md` after meaningful backend changes.
- Update `development-history.md` with what changed and why.
- Update `tasks.md` with status and verification steps.

## Backend Completion Checklist

Before marking backend work complete, confirm:

- contracts, DTOs, validation, controllers/routes, services, persistence, and generated/shared types are aligned
- auth/RBAC/tenant checks are correct
- errors are translated into safe, documented responses
- retries, timeouts, idempotency, and dead-letter behavior are defined where relevant
- logs, metrics, traces, and audit events exist where useful
- migrations are safe and non-destructive unless approved
- tests cover happy paths, negative paths, and important failure modes
- docs and handbooks are updated
