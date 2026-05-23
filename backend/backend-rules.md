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
- For TypeORM, expose per-entity access through an `EntityNameTable` or equivalent adapter. Services should inject and call adapter methods rather than injecting `Repository<Entity>` directly.
- Apply the same wrapper rule to Prisma, Drizzle, Knex, Mongoose, Redis clients, search clients, object storage, and analytics stores.
- Adapter methods should encode product defaults: pagination, filtering, sorting, tenant scoping, soft deletes, RBAC-aware predicates when appropriate, transactions, timeouts, query hints, and safe defaults.
- Use transactions for multi-step writes that must be atomic. Make transaction boundaries visible and avoid hidden nested transaction behavior.
- Design writes for idempotency where retries, webhooks, jobs, or distributed systems are involved.
- Avoid unbounded queries. Use pagination, streaming, cursors, limits, projections, and indexes.
- Check query plans for high-risk or high-volume reads/writes. Add indexes deliberately and document expected access patterns.
- Do not default only to B-tree and composite indexes. Choose index strategy by query shape, data type, cardinality, sort/filter pattern, write cost, and database engine capability.
- Consider the full index toolbox where appropriate: composite, covering/include, partial/filtered, unique, expression/function-based, hash, full-text, trigram, GIN, GiST, SP-GiST, BRIN, geospatial, vector/ANN, TTL/expiry, clustered, and engine-specific indexes.
- For every new important query path, document the intended access pattern, expected selectivity, index choice, and tradeoff. Indexes improve reads but add write, storage, migration, and maintenance cost.
- Use `EXPLAIN`, `EXPLAIN ANALYZE`, query profiling, or the database engine equivalent before and after index changes on non-trivial query paths.
- Preserve data integrity with constraints, unique indexes, foreign keys where appropriate, optimistic/pessimistic locking when needed, and clear consistency rules.

## Query Analysis And Indexing

- Treat query performance as part of feature design, not as a late optimization pass.
- Every table/collection that can grow meaningfully should have a documented access pattern: primary lookups, list queries, search queries, joins, ordering, tenant scoping, archival access, and admin/reporting access.
- Match index type to behavior:
  - B-tree for equality, ranges, ordering, and common relational lookups.
  - Composite indexes for multi-column filters and sorts, ordered by real query predicates and selectivity.
  - Covering/include indexes when avoiding table lookups materially improves hot reads.
  - Partial/filtered indexes for sparse states, soft-delete filters, tenant subsets, queue states, or high-value conditional queries.
  - Unique indexes for data integrity, idempotency keys, natural keys, and duplicate prevention.
  - Expression/function indexes for normalized email, lowercased search keys, computed statuses, JSON paths, and date buckets.
  - Full-text, trigram, search-engine, or vector indexes for search and semantic retrieval instead of forcing relational indexes to solve search problems.
  - GIN/GiST/SP-GiST/BRIN/geospatial/hash or engine-specific indexes when the data shape and database support them.
- Be careful with index ordering and left-prefix behavior. Ensure composite indexes match actual filter/sort order.
- Avoid redundant, unused, or overlapping indexes. Review index usage metrics and remove only through an approved migration/cleanup plan.
- For multi-tenant systems, confirm indexes support tenant scoping and do not enable expensive cross-tenant scans by default.
- For soft-delete systems, indexes should account for active rows, deleted rows, uniqueness among active rows, and restore behavior.

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
- product-specific defaults that prevent unsafe direct library usage

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
- Prefer soft delete for user/business data unless legal, privacy, storage, or domain requirements demand hard deletion. Ensure uniqueness, queries, restore behavior, retention, and cleanup jobs handle soft-deleted records correctly.
- Include health checks, readiness checks, and liveness checks for critical dependencies.
- For NestJS services, use `@nestjs/terminus` or the project-approved NestJS health package to expose health endpoints. Health checks should cover the HTTP process, database, cache, queues, storage, external critical dependencies, disk/memory where relevant, and build/version metadata when safe.
- Keep health endpoints safe: do not leak secrets, internal topology, credentials, customer data, or detailed dependency errors to public callers. Expose deeper diagnostics only behind appropriate auth/network controls.

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
- Support environment-gated database query analysis. When enabled in development or staging, database adapters should log safe `EXPLAIN` or `EXPLAIN ANALYZE` output for relevant queries so engineers can debug plans, indexes, scans, joins, and cost regressions.
- Query-analysis logs must be structured, correlated to request/job IDs, redacted, sampled or bounded, and disabled by default in production unless an incident/debug policy explicitly allows it.
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
- Add a typed database query-analysis config when the project has meaningful database usage. It should control whether query `EXPLAIN` wrapping/logging is enabled, which environments may use it, sampling rate, slow-query threshold, maximum logged payload size, redaction behavior, and whether `EXPLAIN ANALYZE` is allowed.
- Never enable expensive query analysis globally in production by accident. Production use must be temporary, explicit, bounded, observable, and safe for sensitive data.
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
- edge cases, blind spots are managed, abuse/malicious intents are prevented
- auth/RBAC/tenant checks are correct
- errors are translated into safe, documented responses
- retries, timeouts, idempotency, and dead-letter behavior are defined where relevant
- database indexes match real access patterns and query plans have been checked for high-risk paths
- health/readiness endpoints exist for services with operational dependencies
- query-analysis/EXPLAIN config is available when useful and safely disabled or bounded by environment
- logs, metrics, traces, and audit events exist where useful
- migrations are safe and non-destructive unless approved
- tests cover happy paths, negative paths, and important failure modes
- docs and handbooks are updated
