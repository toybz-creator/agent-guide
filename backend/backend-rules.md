# Backend Production Rules

## Purpose

These rules apply to backend, API, database, infrastructure, job, event, auth, storage, integration, and service-layer work.

These rules are stack-neutral. Apply framework-native patterns, explicit contracts, and project-owned policy boundaries through the stack selected by the project.

## Backend Mission

The backend mission is to keep API behavior, validation, persistence, authorization, failure handling, tests, operations, and documentation aligned.

## Architecture

- [PAG-BE-001] [MUST] Organize by domain/feature when possible. Keep controllers/routes, DTOs, services, policies, persistence adapters, tests, and feature docs close enough to understand the feature as a unit.
- [PAG-BE-002] [MUST] Keep boundaries explicit: controllers handle transport concerns, services handle use cases, domain modules handle business rules, persistence adapters handle storage, and infrastructure modules handle external systems.
- [PAG-BE-003] [MUST] Use bounded feature modules for substantial workflows such as notifications, billing, onboarding, fulfillment, moderation, scheduling, or audit logging when the workflow needs multiple services, adapters, jobs, policies, events, templates, or persistence models. The module should expose a small public API and keep orchestration, invariants, internal data access, retry/idempotency rules, tests, and runbook notes together.
- [PAG-BE-005] [SHOULD] Promote a bounded feature module to a package, workspace library, or separately deployable service only when the project needs independent reuse, ownership, deployment cadence, scaling, security isolation, or runtime failure isolation. Do not split a workflow only because it might grow; start with a clear module boundary and extract later when the boundary proves stable.
- [PAG-BE-006] [MUST] Avoid leaking persistence models, framework request objects, external SDK objects, or low-level client details across module boundaries.
- [PAG-BE-007] [SHOULD] Prefer dependency injection and interfaces for integrations that may change, need testing, or require policy enforcement.
- [PAG-BE-008] [MUST] Use event-driven, queue-based, streaming, or scheduled architectures when they fit the workflow better than synchronous request/response.
- [PAG-BE-009] [MUST] Do not create unnecessary abstraction layers. Add wrappers when they enforce product policy, improve testability, centralize risk, or match existing architecture.
- [PAG-BE-011] [MUST] Keep changes small and reviewable where possible. When a backend task naturally spans schema, API, jobs, UI, and infrastructure, split the plan by dependency order and explain which pieces can land separately.

## API And Communication Contracts

- [PAG-BE-012] [MUST] Use the right communication pattern for the task: REST, GraphQL, WebSockets, Server-Sent Events, gRPC, NATS, message queues, scheduled jobs, webhooks, WebRTC signaling, or domain events.
- [PAG-BE-013] [MUST] Keep public contracts explicit, version-aware, documented, and backward-compatible unless a breaking change is approved.
- [PAG-BE-014] [MUST] For NestJS controllers/routes, include Swagger/OpenAPI documentation when the project exposes or maintains OpenAPI: tags, operation summaries, params, query, body, responses, errors, auth requirements, and important examples.
- [PAG-BE-015] [MUST] Validate every external input: params, query, body, headers, files, webhook payloads, environment variables, queue payloads, and event messages.
- [PAG-BE-016] [MUST] Use DTOs and schemas consistently. Prefer Zod, class-validator/class-transformer, OpenAPI schemas, or the project’s established validation stack.
- [PAG-BE-017] [MUST] Return predictable response envelopes and error shapes when the project uses them. Do not invent a second API style.
- [PAG-BE-018] [MUST] Generate or maintain shared client types where useful so frontend and backend contracts stay aligned.
- [PAG-BE-019] [MUST] Treat webhooks and external callbacks as hostile input: verify signatures, timestamps, replay windows, payload shape, idempotency keys, and source identity.

## Data Access And Persistence

- [PAG-BE-020] [MUST] Centralize database access behind project-owned table/repository/data-source adapters. Low-level ORM repositories, raw clients, and query builders should be used only inside the corresponding adapter.
- [PAG-BE-021] [SHOULD] For TypeORM, keep repository and query-builder policy inside the project's established persistence adapter or repository boundary. Do not impose an `EntityNameTable` naming convention unless the project has adopted it.
- [PAG-BE-022] [MUST] Apply the same wrapper rule to Prisma, Drizzle, Knex, Mongoose, Redis clients, search clients, object storage, and analytics stores.
- [PAG-BE-023] [SHOULD] Adapter methods should encode product defaults: pagination, filtering, sorting, tenant scoping, soft deletes, RBAC-aware predicates when appropriate, transactions, timeouts, query hints, and safe defaults.
- [PAG-BE-024] [MUST] Treat ORM models, schema definitions, and persistence mappings as storage contracts, not convenience classes. Explicitly define table names, column names, database types, precision/scale, nullability, defaults, indexes, foreign-key fields, relation ownership, and delete behavior when the stored shape matters.
- [PAG-BE-025] [MUST] Keep raw foreign-key scalar fields visible beside ORM relation fields for important business relations. Pin relation mappings to the stored column name, index lookup/join keys, and document unusual mappings that prevent the ORM from inventing unsafe names.
- [PAG-BE-026] [MUST] Default application-owned foreign keys to restrictive delete behavior such as `NO ACTION` or intentional `SET NULL`. Use cascade delete only for child data that is private to the parent, unaudited, not financially or legally meaningful, and safe to erase as one unit.
- [PAG-BE-027] [MUST] Never expose persistence entities or ORM models directly from public APIs. Map to DTOs/contracts that intentionally include public fields, hide internal metadata and secrets, and preserve backward-compatible response shapes.
- [PAG-BE-028] [SHOULD] Prefer explicit projections/selects for public reads instead of broad relation loading. Fetch only the fields the contract needs, especially when related records may contain secrets, credentials, private notes, internal metadata, or large payloads.
- [PAG-BE-029] [MUST] Hide sensitive persisted columns from default ORM selection where the ORM supports it, and still require DTO mapping. Password hashes, token hashes, API keys, reset codes, private notes, and provider secrets must be explicitly selected only in services that need them.
- [PAG-BE-030] [MUST] Treat `undefined`, missing fields, and `null` as different update intents. Patch/update paths must define which fields can be omitted, which fields can be cleared, and which fields must be rejected.
- [PAG-BE-031] [SHOULD] Prefer nullable-first schema evolution for new persisted fields on existing data. Add the field nullable or with a safe default, backfill and validate it, update code and seed data, then enforce `NOT NULL` only when production data, rollout order, and rollback safety are proven.
- [PAG-BE-032] [MUST] Use database enums only when values are stable and database-level validity is worth the migration cost. For fast-moving domains, prefer text plus typed validation, transition guards, and tests until the domain settles.
- [PAG-BE-033] [MUST] Use timezone-aware instants for absolute event times and document domain-specific time semantics such as inclusive/exclusive ranges, venue timezones, payment windows, reporting boundaries, and recurring local schedules.
- [PAG-BE-034] [MUST] Use transactions for multi-step writes that must be atomic. Make transaction boundaries visible and avoid hidden nested transaction behavior.
- [PAG-BE-035] [MUST] Keep transactions tight. Do not hold database transactions or row locks while calling payment providers, sending email, uploading files, generating media, waiting on queues/caches, doing expensive CPU work, or calling remote services.
- [PAG-BE-036] [SHOULD] When a database change and an external side effect must both happen reliably, prefer an outbox, durable job, or event handoff written inside the same transaction as the business change. Process the side effect after commit with retries, idempotency, and visible status.
- [PAG-BE-037] [MUST] Design writes for idempotency where retries, webhooks, jobs, or distributed systems are involved.
- [PAG-BE-038] [MUST] Back idempotency with database uniqueness or another durable constraint when duplicate side effects would harm correctness. Application-only idempotency checks are not enough under concurrency.
- [PAG-BE-039] [MUST] Assume retries happen. Duplicate HTTP requests, user double-clicks, webhook redelivery, queue reprocessing, job restarts, and client reconnects must not create duplicate records or unintended side effects unless the product explicitly requires it.
- [PAG-BE-040] [SHOULD] Prefer deterministic operation IDs, idempotency keys, unique constraints, natural keys, compare-and-swap checks, or version columns for important writes. If a record or operation already exists, return the existing durable result or a safe no-op response instead of repeating side effects.
- [PAG-BE-041] [MUST] For versioned domain records, use optimistic concurrency where stale updates would corrupt data: clients send the last known version, the server rejects mismatches with a clear conflict response, successful writes increment the version, and clients refetch or reconcile before retrying.
- [PAG-BE-042] [MUST] Avoid unbounded queries. Use pagination, streaming, cursors, limits, projections, and indexes.
- [PAG-BE-043] [MUST] For list endpoints, enforce a default limit, maximum limit, stable ordering, and deterministic tie-breaker. Use cursor pagination for high-volume ordered histories or feeds where offset pagination becomes unreliable or expensive.
- [PAG-BE-044] [MUST] Use query builders or equivalent explicit query APIs when filtering, joins, projections, aggregates, authorization scope, pagination, or performance shape matters. Avoid hidden eager/lazy relation loading and N+1 behavior in production endpoints.
- [PAG-BE-045] [MUST] Keep raw SQL out of normal service code unless the ORM cannot express the operation safely or clearly. Raw SQL must use parameter binding, live in reviewed persistence/migration/backfill/maintenance code, and document database-specific behavior.
- [PAG-BE-046] [MUST] Check query plans for high-risk or high-volume reads/writes. Add indexes deliberately and document expected access patterns.
- [PAG-BE-047] [MUST] Do not default only to B-tree and composite indexes. Choose index strategy by query shape, data type, cardinality, sort/filter pattern, write cost, and database engine capability.
- [PAG-BE-048] [SHOULD] Consider the full index toolbox where appropriate: composite, covering/include, partial/filtered, unique, expression/function-based, hash, full-text, trigram, GIN, GiST, SP-GiST, BRIN, geospatial, vector/ANN, TTL/expiry, clustered, and engine-specific indexes.
- [PAG-BE-049] [MUST] For every new important query path, document the intended access pattern, expected selectivity, index choice, and tradeoff. Indexes improve reads but add write, storage, migration, and maintenance cost.
- [PAG-BE-050] [MUST] Use `EXPLAIN`, `EXPLAIN ANALYZE`, query profiling, or the database engine equivalent before and after index changes on non-trivial query paths.
- [PAG-BE-051] [MUST] Preserve data integrity with constraints, unique indexes, foreign keys where appropriate, optimistic/pessimistic locking when needed, and clear consistency rules.
- [PAG-BE-052] [MUST] Design concurrency before production traffic exposes it. Use state transition guards, unique constraints, optimistic version fields, pessimistic row locks, advisory locks, short-lived distributed locks, stale-reference rejection, and compensating cleanup according to the conflict being managed.
- [PAG-BE-053] [MUST] Treat tenant, account, business, organization, venue, and ownership scope as part of query shape. Scope reads and writes in the database query whenever possible instead of fetching broad data and authorizing only afterward.

## ORM And Data Model Discipline

- [PAG-BE-054] [MUST] Keep ORM runtime config and migration/CLI config aligned. Production schema must be changed through reviewed migrations or approved database operations, not runtime metadata synchronization.
- [PAG-BE-055] [MUST] In TypeORM and similar ORMs, keep production `synchronize` disabled. Local convenience must not become production schema mutation.
- [PAG-BE-056] [SHOULD] Standardize naming for tables, columns, indexes, constraints, timestamp fields, foreign keys, enum values, and deprecated fields before adding new persistence surfaces.
- [PAG-BE-057] [MUST] Keep truly universal fields in base entities/models only when they apply to every table. Do not force business-specific fields such as tenant ID, status, owner ID, or lifecycle state into a base class unless the project contract requires them everywhere.
- [PAG-BE-058] [SHOULD] Prefer soft delete for records needed for audit, support, reconciliation, reporting, undo, retention, or legal reasons. Define how soft-deleted records affect uniqueness, default queries, restores, indexes, retention, and cleanup jobs.
- [PAG-BE-059] [MUST] Use hard delete for ephemeral records only when retention and audit requirements allow it, such as expired one-time tokens, temporary uploads, draft-only children, or short-lived locks.
- [PAG-BE-060] [SHOULD] Use CQRS only when separate read/write models materially improve performance, search, reporting, or scaling. Define transactional write integrity, lag tolerance, rebuild/replay strategy, stale-read UX, failure modes, and reconciliation before adopting it.
- [PAG-BE-062] [MUST] Use event sourcing only when the product needs durable event history, auditability, replay, temporal queries, or complex state reconstruction. Define event schemas, ordering, snapshots, replay safety, PII handling, and migration/versioning strategy.
- [PAG-BE-063] [MUST] Keep seed data as part of the data layer. Seeds should be transactional where practical, deterministic, safe for the target environment, idempotent, realistic across domains, include unhappy states, and document the demo/test world they create.
- [PAG-BE-064] [MUST] Update seed data whenever schema, constraints, required relationships, roles, permissions, workflow states, or demo/test assumptions change. Seeds should prove the current schema can support realistic success, error, RBAC, empty, edge, and migration scenarios.

## Query Analysis And Indexing

- [PAG-BE-065] [MUST] Treat query performance as part of feature design, not as a late optimization pass.
- [PAG-BE-066] [MUST] Every table/collection that can grow meaningfully should have a documented access pattern: primary lookups, list queries, search queries, joins, ordering, tenant scoping, archival access, and admin/reporting access.
- [PAG-BE-067] [MUST] Match index type to behavior:
  - B-tree for equality, ranges, ordering, and common relational lookups.
  - Composite indexes for multi-column filters and sorts, ordered by real query predicates and selectivity.
  - Covering/include indexes when avoiding table lookups materially improves hot reads.
  - Partial/filtered indexes for sparse states, soft-delete filters, tenant subsets, queue states, or high-value conditional queries.
  - Unique indexes for data integrity, idempotency keys, natural keys, and duplicate prevention.
  - Expression/function indexes for normalized email, lowercased search keys, computed statuses, JSON paths, and date buckets.
  - Full-text, trigram, search-engine, or vector indexes for search and semantic retrieval instead of forcing relational indexes to solve search problems.
  - GIN/GiST/SP-GiST/BRIN/geospatial/hash or engine-specific indexes when the data shape and database support them.
- [PAG-BE-068] [MUST] Be careful with index ordering and left-prefix behavior. Ensure composite indexes match actual filter/sort order.
- [PAG-BE-069] [MUST] Avoid redundant, unused, or overlapping indexes. Review index usage metrics and remove only through an approved migration/cleanup plan.
- [PAG-BE-070] [MUST] For multi-tenant systems, confirm indexes support tenant scoping and do not enable expensive cross-tenant scans by default.
- [PAG-BE-071] [MUST] For soft-delete systems, indexes should account for active rows, deleted rows, uniqueness among active rows, and restore behavior.

## Migrations

- [PAG-BE-072] [MUST] Never use destructive `drop*` operations in a new `up()` migration unless explicitly approved.
- [PAG-BE-073] [MUST] Treat migrations as release artifacts. Generated migrations must be reviewed for data loss, locks, table rewrites, deploy ordering, rollback behavior, and alignment with entities/models, DTOs, services, tests, and docs.
- [PAG-BE-074] [SHOULD] Prefer expand/backfill/contract for important production schema changes: add backward-compatible shape first, deploy compatible code, backfill safely, verify, then contract or remove old shape in a separately approved cleanup.
- [PAG-BE-075] [SHOULD] Prefer staged deprecation: make retiring columns nullable if needed, rename old columns to `<column_name>_deprecated`, rename old tables to `<table_name>_deprecated`, migrate consumers, then remove in a separately approved cleanup.
- [PAG-BE-076] [MUST] Migrations must be reversible when practical, reviewed for data loss, and safe for production deployment order.
- [PAG-BE-077] [SHOULD] Consider zero-downtime deployment: backward-compatible schema first, code rollout second, cleanup later.
- [PAG-BE-078] [MUST] Include data backfill strategy, batching, locks, timeout risk, monitoring, and rollback notes for large migrations.
- [PAG-BE-079] [MUST] Do not add a required column to a populated table in one risky step unless the database can satisfy it safely and instantly. Add it nullable or with a safe default, backfill, verify, then enforce `NOT NULL` or stricter constraints later.
- [PAG-BE-080] [MUST] Do not add unique constraints to dirty data blindly. First find duplicates, resolve them through a product-aware cleanup plan, then add the constraint.
- [PAG-BE-081] [MUST] Avoid direct column renames during rolling deploys when old and new application versions may overlap. Use shadow writes, dual reads, backfill, and delayed deprecation when compatibility matters.
- [PAG-BE-082] [MUST] Make backfills idempotent and rerunnable. They should process bounded batches, log progress, resume after failure, avoid long transactions/table-wide locks, support dry-run when risky, include a verification query, and avoid duplicate external side effects.
- [PAG-BE-083] [MUST] Use application-level backfill or repair jobs when data changes require domain services, side effects, media generation, search indexing, notifications, audit metadata, or queue orchestration.
- [PAG-BE-084] [MUST] Add automated migration safety checks where practical to block obvious destructive operations such as new drops, truncates, and broad deletes, while still requiring human review for subtle risks.
- [PAG-BE-085] [MUST] For production databases, document backup, restore, point-in-time recovery, replication, and rollback expectations with every significant schema or data migration. Verify that backups exist before risky migrations and that rollback code remains compatible with the live data shape.
- [PAG-BE-086] [MUST] Identify migration and deployment checkpoints that require human review, live monitoring, or explicit approval. Offer to monitor them when the user requests operational assistance and the available tools permit it.

## Wrappers And Policy Enforcement

- [PAG-BE-087] [MUST] Use project-owned adapters or facades when they centralize policy for:
  - database and ORM clients
  - cache clients
  - queues and job processors
  - event buses and pub/sub
  - auth providers and RBAC engines
  - secrets managers
  - email, SMS, and push providers
  - file and object storage
  - payment providers
  - external APIs
  - feature flags
  - search engines
  - telemetry, logging, metrics, and tracing
  - config loaders

- [PAG-BE-101] [MUST] Put applicable shared policy in those boundaries:
  - timeouts
  - retries and backoff
  - circuit breakers
  - input and output validation
  - idempotency
  - tenant and permission scoping
  - logging and metrics
  - correlation and request IDs
  - error translation
  - rate limits
  - test doubles
  - secure and product-specific defaults

- [PAG-BE-113] [SHOULD] Prevent direct low-level client use with the project's appropriate combination of module exports, lint rules, architecture tests, conventions, or code ownership.
- [PAG-BE-114] [MUST] Make wrappers policy gateways in high-risk domains: persistence boundaries enforce authorization scope and safe query behavior; request clients enforce resilience, redaction, correlation, and typed errors; security boundaries expose intention-revealing checks that services cannot accidentally bypass.

## Reliability And Async Work

- [PAG-BE-117] [MUST] Model async/stateful flows with explicit states and transitions.
- [PAG-BE-118] [MUST] Keep lifecycle state changes behind intention-revealing service methods. Controllers, jobs, and webhooks should not freestyle generic status updates when business invariants, audit trails, cache invalidation, or events depend on the transition.
- [PAG-BE-119] [MUST] For important state machines, define allowed transitions, actor identity, source metadata, audit fields, emitted events, cache invalidation, API response effects, and invalid-transition tests.
- [PAG-BE-120] [MUST] Every job, event handler, webhook, and scheduled task should define idempotency, retry policy, timeout, dead-letter behavior, concurrency limits, and observability.
- [PAG-BE-121] [MUST] Use exponential backoff with jitter for retriable failures. Do not retry validation errors, auth errors, or known permanent failures.
- [PAG-BE-122] [MUST] Use dead-letter queues or failure tables for work that cannot be safely dropped.
- [PAG-BE-123] [MUST] Protect downstream systems with rate limits, bulkheads, queue concurrency, circuit breakers, and timeouts.
- [PAG-BE-124] [MUST] Use saga/compensating transaction patterns for multi-service workflows where distributed transactions are not available or not appropriate. Define each step, durable state, retry behavior, compensation action, timeout, manual repair path, and audit trail.
- [PAG-BE-125] [MUST] Use the outbox pattern when database changes must reliably publish events. Write domain state and the outbox record in the same transaction, publish after commit, mark delivery status, and make consumers idempotent.
- [PAG-BE-126] [MUST] Use competing consumers for scalable queue processing, dead-letter queues for poison messages, and backpressure/concurrency controls so slow downstream systems do not exhaust memory or connection pools.
- [PAG-BE-127] [MUST] Use the bulkhead pattern to isolate critical resource pools such as database connections, external provider clients, job queues, and expensive workflows so one failing area does not starve the whole system.
- [PAG-BE-128] [SHOULD] For NestJS projects, evaluate project-approved resilience libraries and patterns such as `@nestjs/terminus` for health checks, `@nestjs/schedule` or queue libraries for durable work, `@nestjs/cqrs` where CQRS fits, resilience helpers for retries/circuit breakers, and Effect/Effect-TS style workflows when they improve typed error handling, retries, and composition. Add these only when they fit the team and reduce risk.
- [PAG-BE-129] [MUST] Make partial failure visible and recoverable.
- [PAG-BE-130] [MUST] Avoid hidden background work from request handlers unless it is durable, observable, and safe to retry.
- [PAG-BE-131] [MUST] Use locks, uniqueness constraints, idempotency keys, or compare-and-swap patterns to prevent duplicate side effects.
- [PAG-BE-132] [SHOULD] Prefer soft delete for user/business data unless legal, privacy, storage, or domain requirements demand hard deletion. Ensure uniqueness, queries, restore behavior, retention, and cleanup jobs handle soft-deleted records correctly.
- [PAG-BE-133] [MUST] Include health checks, readiness checks, and liveness checks for critical dependencies.
- [PAG-BE-134] [SHOULD] For NestJS services, use `@nestjs/terminus` or the project-approved NestJS health package to expose health endpoints. Health checks should cover the HTTP process, database, cache, queues, storage, external critical dependencies, disk/memory where relevant, and build/version metadata when safe.
- [PAG-BE-135] [MUST] Keep health endpoints safe: do not leak secrets, internal topology, credentials, customer data, or detailed dependency errors to public callers. Expose deeper diagnostics only behind appropriate auth/network controls.

## Security

- [PAG-BE-136] [MUST] Enforce authentication and authorization at the correct boundary. Protected routes, services, jobs, and events must not rely on UI-only checks.
- [PAG-BE-137] [MUST] Use RBAC, ABAC, tenant scoping, or policy checks consistently with the project model.
- [PAG-BE-138] [MUST] Validate and sanitize inputs. Encode outputs in the appropriate context.
- [PAG-BE-139] [MUST] Keep secrets in environment/secret managers only. Never log secrets, tokens, passwords, private keys, session cookies, or sensitive payloads.
- [PAG-BE-140] [MUST] Store passwords only with strong one-way hashing using accepted algorithms and parameters.
- [PAG-BE-141] [MUST] Use secure cookie/session settings and CSRF protection where relevant.
- [PAG-BE-142] [MUST] Add rate limits and abuse prevention for auth, search, uploads, mutations, webhooks, and expensive endpoints.
- [PAG-BE-143] [MUST] Verify file uploads for type, size, malware policy where applicable, storage permissions, and safe URLs.
- [PAG-BE-144] [MUST] Avoid SSRF, path traversal, SQL injection, command injection, insecure deserialization, confused deputy problems, and privilege escalation.
- [PAG-BE-145] [MUST] Maintain audit logs for sensitive actions, permission changes, data exports, admin actions, auth events, and destructive operations.


## Observability And Operations

- [PAG-BE-146] [MUST] Use structured logs with stable event names, severity, request/correlation IDs, actor IDs when safe, tenant IDs when safe, and important domain identifiers.
- [PAG-BE-147] [MUST] Log thrown and handled errors with stack traces in trusted server logs when available, while redacting secrets and returning safe error responses to clients. Preserve the cause chain when wrapping errors.
- [PAG-BE-148] [SHOULD] Emit metrics for latency, throughput, errors, retries, queue depth, job age, dead letters, cache hit rate, dependency health, and business-critical events.
- [PAG-BE-149] [MUST] Use tracing across service boundaries and async workflows where supported.
- [PAG-BE-150] [MUST] Make operational states visible: pending, processing, retrying, failed, completed, cancelled, expired, and compensated.
- [PAG-BE-151] [MUST] Maintain audit trails for business-critical transitions as operator-facing product features, not passive dumps. Store action names, old/new state where useful, actor, actor type, source, structured metadata, and queryable indexes for timeline/reporting paths.
- [PAG-BE-152] [MUST] Support environment-gated database query analysis. When enabled in development or staging, database adapters should log safe `EXPLAIN` or `EXPLAIN ANALYZE` output for relevant queries so engineers can debug plans, indexes, scans, joins, and cost regressions.
- [PAG-BE-153] [MUST] Query-analysis logs must be structured, correlated to request/job IDs, redacted, sampled or bounded, and disabled by default in production unless an incident/debug policy explicitly allows it.
- [PAG-BE-154] [MUST] Add alerts for user-impacting failures, saturation, SLO breaches, queue buildup, dependency failures, and security-sensitive anomalies.
- [PAG-BE-155] [MUST] Keep logs useful and bounded. Avoid noisy logs, high-cardinality metrics, and sensitive data leakage.
- [PAG-BE-156] [MUST] Use project-owned observability wrappers around product analytics, bug capture, monitoring, and DevOps tools. Examples may include Amplitude for product analytics, Jam.dev for user bug reports and console/network context, Lens or Kubernetes-native tools for operations, and OpenTelemetry-compatible logging/metrics/tracing. These are examples, not base-guide mandates; record the chosen tools in `verdicts.md` and environment docs.

## Performance And Efficiency

- [PAG-BE-157] [MUST] Avoid blocking operations in hot paths.
- [PAG-BE-158] [MUST] Use caching deliberately with clear keys, TTLs, invalidation strategy, stampede protection, and tenant/user scoping.
- [PAG-BE-159] [SHOULD] For backend applications that need a shared CacheManager abstraction, prefer a production-grade cache manager with stampede protection and clear failure behavior. Use `ZiggyCreatures/FusionCache` for .NET backends or Bento Cache for Node/TypeScript backends when the project stack fits, unless the downstream project has already selected an equivalent cache manager. Record the chosen cache manager, backing store, TTL policy, fail-safe behavior, and invalidation ownership in the backend handbook or `verdicts.md`.
- [PAG-BE-160] [MUST] Cache keys must include every query dimension that changes the result, such as tenant, user, role, filters, date range, timezone, page/cursor, inventory item, and permission scope. The service that owns a write should own or trigger invalidation for affected read models.
- [PAG-BE-161] [MUST] Design caching as part of the workflow contract. Define which reads can be client cached, CDN cached, server cached, materialized, or realtime-refreshed; define when writes update local state, invalidate caches, publish events, or require refetch.
- [PAG-BE-162] [MAY] For client-aware version caching, key domain models can expose monotonically increasing version fields. On app or workflow load, clients may compare local versions with server versions before fetching full data. Mutations should send the expected version when stale writes would be unsafe; successful writes return the new version and emit the relevant cache/realtime update.
- [PAG-BE-163] [MAY] For realtime read models, the backend can update a reactive store, pub/sub channel, SSE stream, or document database projection while the frontend subscribes to scoped changes. Keep the transactional source of truth server-owned and define replay, authorization, backfill, and stale-data behavior.
- [PAG-BE-164] [MUST] Use cache-aside, write-through, write-behind, refresh-ahead, read replicas, CDC, Redis streams, or search indexes only when their consistency and failure tradeoffs are documented. For Redis multi-key independent reads, consider pipelining or batching to reduce round trips.
- [PAG-BE-165] [SHOULD] Prefer batching, pagination, projections, streaming, compression, and background processing when they reduce load safely.
- [PAG-BE-166] [MUST] Watch for N+1 queries, unbounded joins, large payloads, synchronous external calls, and memory-heavy transformations.
- [PAG-BE-167] [MUST] Use connection pools, timeouts, and resource limits deliberately.
- [PAG-BE-168] [MUST] Treat cost as an engineering concern: retries, logs, traces, storage, queues, and external API calls must be bounded.
- [PAG-BE-169] [MUST] For high-traffic or region-sensitive systems, design the full serving path, not only application code: load balancing, regional routing, database topology, read replicas, sharding or partitioning, cache layers, queue backpressure, rate limits, failover, data residency, and operational runbooks. Use infrastructure-as-code when infrastructure changes are in scope.
- [PAG-BE-170] [MUST] Tie every meaningful performance or scale design to a KPI. Record expected endpoint hit rate, latency budget, database/query budget, queue/job volume, cache expectations, and alert thresholds in `harness/Non-FRD.md`, the feature `observability.md`, or the relevant runbook.
- [PAG-BE-171] [MUST] If code changes alone cannot meet the KPI, propose infrastructure or architecture work instead of pretending the code path is enough. Consider sharding, partitioning, read replicas, load balancing, CDN/edge caches, async queues, event streams, outbox, materialized views, CQRS, search indexes, bulkheads, rate limits, autoscaling, and Terraform/IaC changes.
- [PAG-BE-172] [SHOULD] For search-heavy workflows, prefer CQRS-style search indexes or dedicated search services when relational queries become slow, broad, or user-facing at scale. Update indexes asynchronously through events, outbox, CDC, or jobs; define lag, rebuild, deletion, authorization, and backfill behavior.
- [PAG-BE-173] [MUST] Use replication for read efficiency, failover, reporting, analytics, or backups only when the consistency and operational tradeoffs are explicit. Define replica lag tolerance, primary-read paths, promotion/failover behavior, backup validation, restore testing, monitoring, and stale-read user experience.
- [PAG-BE-174] [MUST] Use specialized data systems only when the workload justifies them: Examples: Redis for cache/streams/coordination, Kafka or equivalent for event streaming, Apache Spark or equivalent for large batch analytics, Flink or equivalent for stream processing, Neo4j or graph databases for relationship-heavy graph traversal, Cassandra or wide-column stores for high-scale write/read patterns, CockroachDB or distributed SQL for multi-region consistency needs, and object/CDN storage for large immutable assets. Document the operational cost and team ownership before adopting. These are examples, not base-guide mandates; choose the tool that best fits the workload and constraints.

## Config And Environment

- [PAG-BE-175] [MUST] Validate all configuration at startup with typed schemas.
- [PAG-BE-176] [MUST] Keep environment-specific behavior explicit and documented.
- [PAG-BE-177] [MUST] Fail fast on missing required configuration.
- [PAG-BE-178] [MUST] Avoid hardcoded URLs, credentials, timeouts, limits, feature flags, or environment names.
- [PAG-BE-179] [SHOULD] Prefer central config modules that expose typed values and shared defaults.
- [PAG-BE-180] [MUST] If read replicas are used, document read-after-write expectations. Use the primary for flows that require fresh reads after writes, such as payments, booking confirmation, token rotation, idempotency checks, and scarce-inventory updates.
- [PAG-BE-181] [MUST] Add a typed database query-analysis config when the project has meaningful database usage. It should control whether query `EXPLAIN` wrapping/logging is enabled, which environments may use it, sampling rate, slow-query threshold, maximum logged payload size, redaction behavior, and whether `EXPLAIN ANALYZE` is allowed.
- [PAG-BE-182] [MUST] Never enable expensive query analysis globally in production by accident. Production use must be temporary, explicit, bounded, observable, and safe for sensitive data.
- [PAG-BE-183] [MUST] Document local, staging, production, and preview environment differences in `harness/environments-cloud-deployments.md`.

## Testing

- [PAG-BE-184] [MUST] Unit test domain logic, services, policies, validators, and adapters.
- [PAG-BE-185] [MUST] Integration test database access, API endpoints, auth/RBAC, queues, cache, webhooks, and external integration wrappers.
- [PAG-BE-186] [MUST] E2E test critical user and admin flows.
- [PAG-BE-187] [MUST] Include negative tests for validation, authorization, missing resources, duplicate requests, concurrency, and dependency failures.
- [PAG-BE-188] [MUST] Include security and bad-request tests at the same layers that enforce behavior: DTO/schema validation, middleware, guards, policies, controllers/routes, services, persistence adapters, and external integration boundaries.
- [PAG-BE-189] [MUST] Test endpoints directly when API behavior changes so transport parsing, DTO validation, middleware, guards, interceptors, filters, auth/RBAC, response mapping, and error contracts are verified together.
- [PAG-BE-190] [MUST] For persistence changes, test the contract that can break in production: migration builds a fresh schema, relation mappings match real columns, unique constraints reject duplicates, authorization scopes filter rows, soft-delete behavior is consistent, status transitions write audit records, backfills repair legacy rows, and DTOs do not leak internal columns.
- [PAG-BE-191] [MUST] Use multi-tenant or multi-owner fixtures when testing scoped access. Single-tenant test data cannot prove isolation.
- [PAG-BE-192] [MUST] Use deterministic fixtures and test data builders.
- [PAG-BE-193] [MUST] Avoid tests that only assert mocks were called when behavior can be asserted.
- [PAG-BE-194] [SHOULD] For migrations, test forward migration and rollback where practical.

## Documentation

- [PAG-BE-195] [MUST] Keep Swagger/OpenAPI docs accurate for all controllers/routes and public backend interfaces.
- [PAG-BE-196] [MUST] Document feature architecture, data model, events/jobs, operational behavior, and failure modes in the relevant harness files.
- [PAG-BE-197] [SHOULD] Comments should explain why a decision exists, not restate what the code already says. Use comments for domain constraints, security concerns, non-obvious performance choices, workarounds, and operational gotchas.
- [PAG-BE-198] [MUST] Update `backend-handbook.md` after meaningful backend changes.
- [PAG-BE-199] [MUST] Update `development-history.md` with what changed and why.
- [PAG-BE-200] [MUST] Update `tasks.md` with status and verification steps.

Backend completion is governed by the selected `PAG-BE-*` rules and the terminal completion test in `instructions.md`; this rulebook does not maintain a duplicate completion checklist.
