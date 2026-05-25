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
- For complex business rules, first check whether a reputable open-source library, official standard, or mature reference implementation already exists. Use or adapt it when it is well maintained, licensed acceptably, secure, testable, and aligned with project constraints. Do not hand-roll large standards-heavy rule systems without researching existing options.

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
- Treat ORM models, schema definitions, and persistence mappings as storage contracts, not convenience classes. Explicitly define table names, column names, database types, precision/scale, nullability, defaults, indexes, foreign-key fields, relation ownership, and delete behavior when the stored shape matters.
- Keep raw foreign-key scalar fields visible beside ORM relation fields for important business relations. Pin relation mappings to the stored column name, index lookup/join keys, and document unusual mappings that prevent the ORM from inventing unsafe names.
- Default application-owned foreign keys to restrictive delete behavior such as `NO ACTION` or intentional `SET NULL`. Use cascade delete only for child data that is private to the parent, unaudited, not financially or legally meaningful, and safe to erase as one unit.
- Never expose persistence entities or ORM models directly from public APIs. Map to DTOs/contracts that intentionally include public fields, hide internal metadata and secrets, and preserve backward-compatible response shapes.
- Hide sensitive persisted columns from default ORM selection where the ORM supports it, and still require DTO mapping. Password hashes, token hashes, API keys, reset codes, private notes, and provider secrets must be explicitly selected only in services that need them.
- Treat `undefined`, missing fields, and `null` as different update intents. Patch/update paths must define which fields can be omitted, which fields can be cleared, and which fields must be rejected.
- Use database enums only when values are stable and database-level validity is worth the migration cost. For fast-moving domains, prefer text plus typed validation, transition guards, and tests until the domain settles.
- Use timezone-aware instants for absolute event times and document domain-specific time semantics such as inclusive/exclusive ranges, venue timezones, payment windows, reporting boundaries, and recurring local schedules.
- Use transactions for multi-step writes that must be atomic. Make transaction boundaries visible and avoid hidden nested transaction behavior.
- Keep transactions tight. Do not hold database transactions or row locks while calling payment providers, sending email, uploading files, generating media, waiting on queues/caches, doing expensive CPU work, or calling remote services.
- When a database change and an external side effect must both happen reliably, prefer an outbox, durable job, or event handoff written inside the same transaction as the business change. Process the side effect after commit with retries, idempotency, and visible status.
- Design writes for idempotency where retries, webhooks, jobs, or distributed systems are involved.
- Back idempotency with database uniqueness or another durable constraint when duplicate side effects would harm correctness. Application-only idempotency checks are not enough under concurrency.
- Assume retries happen. Duplicate HTTP requests, user double-clicks, webhook redelivery, queue reprocessing, job restarts, and client reconnects must not create duplicate records or unintended side effects unless the product explicitly requires it.
- Prefer deterministic operation IDs, idempotency keys, unique constraints, natural keys, compare-and-swap checks, or version columns for important writes. If a record or operation already exists, return the existing durable result or a safe no-op response instead of repeating side effects.
- For versioned domain records, use optimistic concurrency where stale updates would corrupt data: clients send the last known version, the server rejects mismatches with a clear conflict response, successful writes increment the version, and clients refetch or reconcile before retrying.
- Avoid unbounded queries. Use pagination, streaming, cursors, limits, projections, and indexes.
- For list endpoints, enforce a default limit, maximum limit, stable ordering, and deterministic tie-breaker. Use cursor pagination for high-volume ordered histories or feeds where offset pagination becomes unreliable or expensive.
- Use query builders or equivalent explicit query APIs when filtering, joins, projections, aggregates, authorization scope, pagination, or performance shape matters. Avoid hidden eager/lazy relation loading and N+1 behavior in production endpoints.
- Keep raw SQL out of normal service code unless the ORM cannot express the operation safely or clearly. Raw SQL must use parameter binding, live in reviewed persistence/migration/backfill/maintenance code, and document database-specific behavior.
- Check query plans for high-risk or high-volume reads/writes. Add indexes deliberately and document expected access patterns.
- Do not default only to B-tree and composite indexes. Choose index strategy by query shape, data type, cardinality, sort/filter pattern, write cost, and database engine capability.
- Consider the full index toolbox where appropriate: composite, covering/include, partial/filtered, unique, expression/function-based, hash, full-text, trigram, GIN, GiST, SP-GiST, BRIN, geospatial, vector/ANN, TTL/expiry, clustered, and engine-specific indexes.
- For every new important query path, document the intended access pattern, expected selectivity, index choice, and tradeoff. Indexes improve reads but add write, storage, migration, and maintenance cost.
- Use `EXPLAIN`, `EXPLAIN ANALYZE`, query profiling, or the database engine equivalent before and after index changes on non-trivial query paths.
- Preserve data integrity with constraints, unique indexes, foreign keys where appropriate, optimistic/pessimistic locking when needed, and clear consistency rules.
- Design concurrency before production traffic exposes it. Use state transition guards, unique constraints, optimistic version fields, pessimistic row locks, advisory locks, short-lived distributed locks, stale-reference rejection, and compensating cleanup according to the conflict being managed.
- Treat tenant, account, business, organization, venue, and ownership scope as part of query shape. Scope reads and writes in the database query whenever possible instead of fetching broad data and authorizing only afterward.

## ORM And Data Model Discipline

- Keep ORM runtime config and migration/CLI config aligned. Production schema must be changed through reviewed migrations or approved database operations, not runtime metadata synchronization.
- In TypeORM and similar ORMs, keep production `synchronize` disabled. Local convenience must not become production schema mutation.
- Standardize naming for tables, columns, indexes, constraints, timestamp fields, foreign keys, enum values, and deprecated fields before adding new persistence surfaces.
- Keep truly universal fields in base entities/models only when they apply to every table. Do not force business-specific fields such as tenant ID, status, owner ID, or lifecycle state into a base class unless the project contract requires them everywhere.
- Prefer soft delete for records needed for audit, support, reconciliation, reporting, undo, retention, or legal reasons. Define how soft-deleted records affect uniqueness, default queries, restores, indexes, retention, and cleanup jobs.
- Use hard delete for ephemeral records only when retention and audit requirements allow it, such as expired one-time tokens, temporary uploads, draft-only children, or short-lived locks.
- Consider CQRS only when it materially benefits the system, and include edge cases, failure modes, unhappy paths, stale reads, and reconciliation in the design.
- Use CQRS when separate read/write models materially improve performance, search, reporting, or scaling. Writes should protect transactional integrity; reads may use optimized projections, replicas, search indexes, caches, or materialized views. Define lag tolerance, rebuild/replay strategy, stale-read UX, and reconciliation before adopting it.
- Use event sourcing only when the product needs durable event history, auditability, replay, temporal queries, or complex state reconstruction. Define event schemas, ordering, snapshots, replay safety, PII handling, and migration/versioning strategy.
- Keep seed data as part of the data layer. Seeds should be transactional where practical, deterministic, safe for the target environment, idempotent, realistic across domains, include unhappy states, and document the demo/test world they create.

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
- Treat migrations as release artifacts. Generated migrations must be reviewed for data loss, locks, table rewrites, deploy ordering, rollback behavior, and alignment with entities/models, DTOs, services, tests, and docs.
- Prefer expand/backfill/contract for important production schema changes: add backward-compatible shape first, deploy compatible code, backfill safely, verify, then contract or remove old shape in a separately approved cleanup.
- Prefer staged deprecation: make retiring columns nullable if needed, rename old columns to `<column_name>_deprecated`, rename old tables to `<table_name>_deprecated`, migrate consumers, then remove in a separately approved cleanup.
- Migrations must be reversible when practical, reviewed for data loss, and safe for production deployment order.
- Consider zero-downtime deployment: backward-compatible schema first, code rollout second, cleanup later.
- Include data backfill strategy, batching, locks, timeout risk, monitoring, and rollback notes for large migrations.
- Do not add a required column to a populated table in one risky step unless the database can satisfy it safely and instantly. Add it nullable or with a safe default, backfill, verify, then enforce `NOT NULL` or stricter constraints later.
- Do not add unique constraints to dirty data blindly. First find duplicates, resolve them through a product-aware cleanup plan, then add the constraint.
- Avoid direct column renames during rolling deploys when old and new application versions may overlap. Use shadow writes, dual reads, backfill, and delayed deprecation when compatibility matters.
- Make backfills idempotent and rerunnable. They should process bounded batches, log progress, resume after failure, avoid long transactions/table-wide locks, support dry-run when risky, include a verification query, and avoid duplicate external side effects.
- Use application-level backfill or repair jobs when data changes require domain services, side effects, media generation, search indexing, notifications, audit metadata, or queue orchestration.
- Add automated migration safety checks where practical to block obvious destructive operations such as new drops, truncates, and broad deletes, while still requiring human review for subtle risks.

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

For high-risk domains, wrappers should become policy gateways, not thin pass-throughs. Examples:

- Custom repositories should enforce tenant scope, RBAC predicates, allowed ordering/filtering, pagination, version checks, soft-delete behavior, projections, cache invalidation, audit metadata, and safe errors.
- Request/service clients should enforce timeouts, retries, exponential backoff with jitter, circuit breakers, correlation IDs, rate limits, redaction, and typed error translation.
- Security and authorization wrappers should expose intention-revealing checks so services cannot accidentally bypass the project policy model.

## Reliability And Async Work

- Model async/stateful flows with explicit states and transitions.
- Keep lifecycle state changes behind intention-revealing service methods. Controllers, jobs, and webhooks should not freestyle generic status updates when business invariants, audit trails, cache invalidation, or events depend on the transition.
- For important state machines, define allowed transitions, actor identity, source metadata, audit fields, emitted events, cache invalidation, API response effects, and invalid-transition tests.
- Every job, event handler, webhook, and scheduled task should define idempotency, retry policy, timeout, dead-letter behavior, concurrency limits, and observability.
- Use exponential backoff with jitter for retriable failures. Do not retry validation errors, auth errors, or known permanent failures.
- Use dead-letter queues or failure tables for work that cannot be safely dropped.
- Protect downstream systems with rate limits, bulkheads, queue concurrency, circuit breakers, and timeouts.
- Use saga/compensating transaction patterns for multi-service workflows where distributed transactions are not available or not appropriate. Define each step, durable state, retry behavior, compensation action, timeout, manual repair path, and audit trail.
- Use the outbox pattern when database changes must reliably publish events. Write domain state and the outbox record in the same transaction, publish after commit, mark delivery status, and make consumers idempotent.
- Use competing consumers for scalable queue processing, dead-letter queues for poison messages, and backpressure/concurrency controls so slow downstream systems do not exhaust memory or connection pools.
- Use the bulkhead pattern to isolate critical resource pools such as database connections, external provider clients, job queues, and expensive workflows so one failing area does not starve the whole system.
- For NestJS projects, evaluate project-approved resilience libraries and patterns such as `@nestjs/terminus` for health checks, `@nestjs/schedule` or queue libraries for durable work, `@nestjs/cqrs` where CQRS fits, resilience helpers for retries/circuit breakers, and Effect/Effect-TS style workflows when they improve typed error handling, retries, and composition. Add these only when they fit the team and reduce risk.
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
- Log thrown and handled errors with stack traces in trusted server logs when available, while redacting secrets and returning safe error responses to clients. Preserve the cause chain when wrapping errors.
- Emit metrics for latency, throughput, errors, retries, queue depth, job age, dead letters, cache hit rate, dependency health, and business-critical events.
- Use tracing across service boundaries and async workflows where supported.
- Make operational states visible: pending, processing, retrying, failed, completed, cancelled, expired, and compensated.
- Maintain audit trails for business-critical transitions as operator-facing product features, not passive dumps. Store action names, old/new state where useful, actor, actor type, source, structured metadata, and queryable indexes for timeline/reporting paths.
- Support environment-gated database query analysis. When enabled in development or staging, database adapters should log safe `EXPLAIN` or `EXPLAIN ANALYZE` output for relevant queries so engineers can debug plans, indexes, scans, joins, and cost regressions.
- Query-analysis logs must be structured, correlated to request/job IDs, redacted, sampled or bounded, and disabled by default in production unless an incident/debug policy explicitly allows it.
- Add alerts for user-impacting failures, saturation, SLO breaches, queue buildup, dependency failures, and security-sensitive anomalies.
- Keep logs useful and bounded. Avoid noisy logs, high-cardinality metrics, and sensitive data leakage.
- Use project-owned observability wrappers around product analytics, bug capture, monitoring, and DevOps tools. Examples may include Amplitude for product analytics, Jam.dev for user bug reports and console/network context, Lens or Kubernetes-native tools for operations, and OpenTelemetry-compatible logging/metrics/tracing. These are examples, not base-guide mandates; record the chosen tools in `verdicts.md` and environment docs.

## Performance And Efficiency

- Avoid blocking operations in hot paths.
- Use caching deliberately with clear keys, TTLs, invalidation strategy, stampede protection, and tenant/user scoping.
- Cache keys must include every query dimension that changes the result, such as tenant, user, role, filters, date range, timezone, page/cursor, inventory item, and permission scope. The service that owns a write should own or trigger invalidation for affected read models.
- Design caching as part of the workflow contract. Define which reads can be client cached, CDN cached, server cached, materialized, or realtime-refreshed; define when writes update local state, invalidate caches, publish events, or require refetch.
- For client-aware version caching, key domain models can expose monotonically increasing version fields. On app or workflow load, clients may compare local versions with server versions before fetching full data. Mutations should send the expected version when stale writes would be unsafe; successful writes return the new version and emit the relevant cache/realtime update.
- For realtime read models, the backend can update a reactive store, pub/sub channel, SSE stream, or document database projection while the frontend subscribes to scoped changes. Keep the transactional source of truth server-owned and define replay, authorization, backfill, and stale-data behavior.
- Use cache-aside, write-through, write-behind, refresh-ahead, read replicas, CDC, Redis streams, or search indexes only when their consistency and failure tradeoffs are documented. For Redis multi-key independent reads, consider pipelining or batching to reduce round trips.
- Prefer batching, pagination, projections, streaming, compression, and background processing when they reduce load safely.
- Watch for N+1 queries, unbounded joins, large payloads, synchronous external calls, and memory-heavy transformations.
- Use connection pools, timeouts, and resource limits deliberately.
- Treat cost as an engineering concern: retries, logs, traces, storage, queues, and external API calls must be bounded.
- For search-heavy workflows, prefer CQRS-style search indexes or dedicated search services when relational queries become slow, broad, or user-facing at scale. Update indexes asynchronously through events, outbox, CDC, or jobs; define lag, rebuild, deletion, authorization, and backfill behavior.
- Use specialized data systems only when the workload justifies them: Examples: Redis for cache/streams/coordination, Kafka or equivalent for event streaming, Flink or equivalent for stream processing, Cassandra or wide-column stores for high-scale write/read patterns, CockroachDB or distributed SQL for multi-region consistency needs, and object/CDN storage for large immutable assets. Document the operational cost and team ownership before adopting. NB: These are examples, not base-guide mandates. Point is suggest or use the best optimal tool when it benefits the system

## Config And Environment

- Validate all configuration at startup with typed schemas.
- Keep environment-specific behavior explicit and documented.
- Fail fast on missing required configuration.
- Avoid hardcoded URLs, credentials, timeouts, limits, feature flags, or environment names.
- Prefer central config modules that expose typed values and shared defaults.
- If read replicas are used, document read-after-write expectations. Use the primary for flows that require fresh reads after writes, such as payments, booking confirmation, token rotation, idempotency checks, and scarce-inventory updates.
- Add a typed database query-analysis config when the project has meaningful database usage. It should control whether query `EXPLAIN` wrapping/logging is enabled, which environments may use it, sampling rate, slow-query threshold, maximum logged payload size, redaction behavior, and whether `EXPLAIN ANALYZE` is allowed.
- Never enable expensive query analysis globally in production by accident. Production use must be temporary, explicit, bounded, observable, and safe for sensitive data.
- Document local, staging, production, and preview environment differences in `custom-agent-guide/environments-cloud-deployments.md`.

## Testing

- Unit test domain logic, services, policies, validators, and adapters.
- Integration test database access, API endpoints, auth/RBAC, queues, cache, webhooks, and external integration wrappers.
- E2E test critical user and admin flows.
- Include negative tests for validation, authorization, missing resources, duplicate requests, concurrency, and dependency failures.
- For persistence changes, test the contract that can break in production: migration builds a fresh schema, relation mappings match real columns, unique constraints reject duplicates, authorization scopes filter rows, soft-delete behavior is consistent, status transitions write audit records, backfills repair legacy rows, and DTOs do not leak internal columns.
- Use multi-tenant or multi-owner fixtures when testing scoped access. Single-tenant test data cannot prove isolation.
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
