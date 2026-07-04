# Development Arsenal

This catalog helps coding agents identify mature tools that can improve delivery speed, correctness, reliability, security, operability, and product quality. It is a candidate library, not a mandate to install every listed tool.

## How Agents Must Use This Arsenal

The canonical research, decision, installation, evaluation, and reporting workflow is defined by the Rewrite, Planning, Implementation, Evaluation, Feedback, and Iteration stages in `instructions.md`. This catalog adds only the following tool-selection rules:

- `[PAG-ARS-001] [MUST]` Scan only the categories relevant to the capability identified during Rewrite; do not load the full catalog merely to create the appearance of research.
- `[PAG-ARS-002] [MUST]` Treat every listed tool as a discovery candidate, not an approved dependency or default recommendation.
- `[PAG-ARS-003] [MUST]` Compare shortlisted candidates with the project's existing tools, a no-new-tool option, and a small custom implementation when that is realistic.
- `[PAG-ARS-004] [MUST]` Verify current fit through official sources before selection because catalog entries may age faster than the project's rule framework.

## Backend, API, and app architecture

| # | Tool | What it does | Why it is cool |
| ---: | --- | --- | --- |
| 1 | BentoCache | Multi-tier caching for Node.js. | Handles stale data, cache stampedes, tags, namespaces, Redis, memory, Postgres, SQLite. |
| 2 | Hono | Tiny web framework for edge/server runtimes. | Great for APIs, Cloudflare Workers, Bun, Deno, Node. |
| 3 | Elysia | Bun-first TypeScript web framework. | Very fast, typed routes, schema validation. |
| 4 | Fastify | High-performance Node.js web framework. | Great plugin architecture and speed. |
| 5 | tRPC | End-to-end typed API layer. | Frontend calls backend procedures with TypeScript inference. |
| 6 | ts-rest | Contract-first REST API toolkit. | Gives REST APIs tRPC-like type safety. |
| 7 | GraphQL Yoga | Modern GraphQL server. | Easy setup, works with many runtimes. |
| 8 | Pothos | Type-safe GraphQL schema builder. | Strong for complex GraphQL APIs. |
| 9 | Scalar | Beautiful OpenAPI docs and API client. | Cleaner alternative to Swagger UI. |
| 10 | Orval | Generates typed API clients from OpenAPI. | Excellent for Angular/React frontend API clients. |

## Data, databases, and migrations

| # | Tool | What it does | Why it is cool |
| ---: | --- | --- | --- |
| 11 | Debezium | Change data capture from databases. | Streams inserts, updates, deletes without polling. |
| 12 | Drizzle ORM | TypeScript ORM/query builder. | Lightweight, SQL-like, very type-safe. |
| 13 | Kysely | Type-safe SQL query builder. | Great when you want SQL control without heavy ORM magic. |
| 14 | Prisma | Type-safe ORM and migration toolkit. | Strong DX, schema-first modeling. |
| 15 | Atlas | Database schema management. | Treats schema changes like infrastructure-as-code. |
| 16 | Bytebase | Database DevOps platform. | Review, approve, track database changes. |
| 17 | Flyway | Database migration tool. | Mature and simple versioned migrations. |
| 18 | Liquibase | Database change management. | Strong for enterprise audit-heavy environments. |
| 19 | pgvector | Vector search extension for Postgres. | Lets Postgres act as a vector database. |
| 20 | PostGIS | Geospatial extension for Postgres. | Powerful for location-based apps, maps, delivery, booking. |
| 21 | TimescaleDB | Time-series extension/platform on Postgres. | Great for metrics, events, IoT, analytics. |
| 22 | Citus | Distributed Postgres extension. | Helps scale Postgres horizontally. |
| 23 | pg_cron | Cron jobs inside Postgres. | Schedule database-side jobs. |
| 24 | pg_partman | Partition management for Postgres. | Useful for huge tables and time-based data. |
| 25 | pgBouncer | Postgres connection pooler. | Reduces connection pressure on Postgres. |
| 26 | pgBadger | Postgres log analyzer. | Finds slow queries and database pain points. |
| 27 | LiteFS | Distributed SQLite replication. | Makes SQLite surprisingly viable for edge/local deployments. |
| 28 | DuckDB | Embedded analytics database. | “SQLite for analytics”; brilliant for local data analysis. |
| 29 | ClickHouse | Columnar analytics database. | Very fast for logs, events, and analytical workloads. |
| 30 | Meltano | Data integration/ELT platform. | Useful for building analytics pipelines. |

## Messaging, jobs, workflows, and reliability

| # | Tool | What it does | Why it is cool |
| ---: | --- | --- | --- |
| 31 | Temporal | Durable workflow execution. | Great for long-running, failure-resistant business processes. It preserves workflow state and resumes after crashes. |
| 32 | Inngest | Event-driven background jobs. | Simple serverless-friendly workflows. |
| 33 | Trigger.dev | Background jobs for TypeScript. | Great DX for scheduled jobs, retries, and long-running tasks. |
| 34 | Hatchet | Open-source task queue/workflow engine. | Good for durable background jobs. |
| 35 | BullMQ | Redis-backed queue for Node.js. | Mature queue system for jobs, retries, rate limits. |
| 36 | Graphile Worker | Postgres-backed job queue. | Nice when you already trust Postgres. |
| 37 | NATS | Lightweight messaging system. | Excellent for simple pub/sub, request/reply, streams. |
| 38 | Redpanda | Kafka-compatible streaming platform. | Kafka-like API without ZooKeeper complexity. |
| 39 | Apache Pulsar | Distributed pub/sub and streaming. | Strong multi-tenant messaging architecture. |
| 40 | RabbitMQ Streams | Stream processing mode for RabbitMQ. | Adds log-style streaming to RabbitMQ ecosystems. |

## Testing, mocking, benchmarking, and quality

| # | Tool | What it does | Why it is cool |
| ---: | --- | --- | --- |
| 41 | tinyBench | Tiny JavaScript benchmarking library. | Great for measuring function-level performance. |
| 42 | Vitest | Fast Vite-native test runner. | Jest-like DX but faster and modern. |
| 43 | Playwright | End-to-end browser testing. | Reliable browser automation across Chromium, Firefox, WebKit. |
| 44 | MSW | API mocking via service workers/interceptors. | Mock APIs without changing application code. |
| 45 | Pact | Contract testing. | Prevents frontend/backend API mismatch. |
| 46 | Schemathesis | Property-based API testing from OpenAPI. | Finds weird API edge cases automatically. |
| 47 | Testcontainers | Spins up real dependencies in containers for tests. | Test against real Postgres, Redis, Kafka, LocalStack, and more instead of fragile mocks. |
| 48 | LocalStack | Local AWS cloud emulator. | Test AWS services locally. |
| 49 | WireMock | API mocking and service virtualization. | Great for mocking third-party APIs. |
| 50 | Mockoon | Desktop/CLI mock API server. | Fast way to fake APIs during frontend/backend work. |
| 51 | Bruno | Git-friendly API client. | Postman-like, but stores collections as files. |
| 52 | Hoppscotch | Open-source API client. | Lightweight REST/GraphQL/WebSocket testing. |
| 53 | k6 | Load testing tool. | Script performance tests in JavaScript. |
| 54 | Autocannon | HTTP benchmarking for Node.js. | Simple API/server stress testing. |
| 55 | Lighthouse CI | Automated web performance audits. | Catch frontend performance regressions in CI. |

## Observability, monitoring, logs, and analytics

| # | Tool | What it does | Why it is cool |
| ---: | --- | --- | --- |
| 56 | OpenTelemetry | Vendor-neutral observability framework. | Standardizes traces, metrics, and logs across tools. |
| 57 | Prometheus | Metrics collection and alerting. | The default open-source metrics powerhouse. |
| 58 | Grafana | Dashboards and visualization. | Brings metrics, logs, traces, and alerts together. |
| 59 | Loki | Log aggregation system. | Like Prometheus-style labels, but for logs. |
| 60 | Tempo | Distributed tracing backend. | Pairs nicely with Grafana and OpenTelemetry. |
| 61 | VictoriaMetrics | Fast metrics database. | Efficient Prometheus-compatible storage. |
| 62 | SigNoz | Open-source observability platform. | APM, logs, metrics, traces in one stack. |
| 63 | Uptrace | OpenTelemetry-native APM. | Good for traces and performance debugging. |
| 64 | OpenObserve | Logs, metrics, traces, analytics. | Open-source alternative to expensive observability stacks. |
| 65 | HyperDX | Developer-friendly observability. | Session replay, logs, traces, errors together. |
| 66 | Sentry | Error tracking and performance monitoring. | Great for frontend/backend crash visibility. |
| 67 | GlitchTip | Open-source error tracking. | Sentry-like, self-hostable option. |
| 68 | PostHog | Product analytics and feature flags. | Useful for funnels, events, experiments, recordings. |
| 69 | Umami | Privacy-friendly web analytics. | Simple alternative to Google Analytics. |
| 70 | Metabase | Business intelligence dashboarding. | Lets teams query and visualize data quickly. |

## DevOps, local dev, CI/CD, and platform engineering

| # | Tool | What it does | Why it is cool |
| ---: | --- | --- | --- |
| 71 | Taskfile | Modern cross-platform task runner. | Cleaner alternative to Makefiles; supports task dependencies and smart caching. |
| 72 | Just | Command runner. | Simple justfile recipes for project commands. |
| 73 | Mise | Runtime/tool version manager. | Manage Node, Python, Go, Java, env vars, tasks. |
| 74 | Volta | Node.js toolchain manager. | Pins Node/npm/yarn versions per project. |
| 75 | Corepack | Package manager manager for Node. | Helps pin npm, pnpm, yarn versions. |
| 76 | Dagger | Programmable CI/CD pipelines. | Write pipelines as code, portable across CI providers. |
| 77 | Earthly | Reproducible builds. | Dockerfile-like build automation. |
| 78 | Devbox | Nix-powered dev environments. | Reproducible dev shells without learning all of Nix first. |
| 79 | Nix Flakes | Reproducible development/build environments. | Strong for consistent local and CI environments. |
| 80 | Tilt | Local Kubernetes dev workflow. | Auto-rebuild/redeploy services while developing. |
| 81 | Skaffold | Kubernetes development workflow. | Build, push, deploy loop for K8s apps. |
| 82 | Telepresence | Local-to-cluster development. | Run one service locally while connected to a real cluster. |
| 83 | OpenTofu | Terraform-compatible IaC tool. | Open-source infrastructure-as-code alternative. |
| 84 | Pulumi | Infrastructure as code with real languages. | Use TypeScript, Go, Python, C#, Java. |
| 85 | SST | Full-stack AWS framework. | Strong DX for serverless apps. |

## Frontend, TypeScript, monorepos, and build tooling

| # | Tool | What it does | Why it is cool |
| ---: | --- | --- | --- |
| 86 | Biome | Formatter and linter. | Fast alternative to ESLint + Prettier for many projects. |
| 87 | Knip | Finds unused files, exports, dependencies. | Cleans dead code in TypeScript repos. |
| 88 | Lefthook | Git hooks manager. | Fast pre-commit/pre-push hooks. |
| 89 | Changesets | Versioning and changelog management. | Excellent for packages and monorepos. |
| 90 | Nx | Monorepo build system. | Great for Angular/NestJS/React monorepos. |
| 91 | Turborepo | High-speed monorepo task runner. | Caching and parallel execution for JS/TS repos. |
| 92 | Rspack | Rust-based web bundler. | Webpack-compatible but much faster. |
| 93 | Rolldown | Rust-based bundler from the Vite ecosystem. | Future-facing build speed play. |
| 94 | tsup | TypeScript bundler. | Simple way to bundle libraries/packages. |
| 95 | unplugin | Universal plugin system. | Write plugins that work across Vite, Webpack, Rollup, Rspack. |

## AI engineering, auth, policy, and “new stack” tools

| # | Tool | What it does | Why it is cool |
| ---: | --- | --- | --- |
| 96 | Langfuse | LLM observability and tracing. | Track prompts, generations, latency, cost, evaluations. |
| 97 | LiteLLM | Unified interface/proxy for LLM providers. | Switch between OpenAI, Anthropic, Gemini, local models, and more. |
| 98 | Ollama | Run local LLMs. | Great for local AI experiments and privacy-sensitive workflows. |
| 99 | OpenFGA | Fine-grained authorization engine. | Useful for complex permissions like teams, roles, ownership, sharing. |
| 100 | Cerbos | Authorization/policy engine. | Keep access rules outside application code. |

## Local-first databases and sync

| # | Tool | What it does | Why it is interesting |
| ---: | --- | --- | --- |
| 101 | ElectricSQL | Local-first sync layer for Postgres. | Lets apps sync subsets of Postgres data to local clients for fast offline-first experiences. ElectricSQL is especially interesting for mobile/web apps that need “instant UI + eventual server sync.” |
| 102 | PowerSync | Local-first sync engine for Postgres, MongoDB, and SQLite-style local stores. | Strong for mobile apps where offline mode is not an afterthought. |
| 103 | Replicache | Client-side sync engine. | Great for multiplayer-feeling apps with optimistic updates. |
| 104 | Zero | Local-first database/sync layer from Rocicorp. | A newer direction for building highly responsive synced apps. |
| 105 | PGlite | Postgres compiled to WebAssembly. | Run a Postgres-like database inside the browser or edge-like environments. |
| 106 | SQLite Cloud | Managed SQLite sync/cloud platform. | Interesting for small apps that want SQLite simplicity with cloud sync. |
| 107 | Turso | Distributed SQLite database platform. | Useful when you want low-latency reads close to users. |
| 108 | libSQL | SQLite fork behind Turso. | Adds server/client features around SQLite. |
| 109 | RxDB | Reactive local database for JavaScript apps. | Good for offline-first web, Ionic, Electron, and mobile-style apps. |
| 110 | WatermelonDB | High-performance reactive database for React Native/web. | Built for large local datasets and sync-heavy apps. |

## Databases, storage, search, and data engines

| # | Tool | What it does | Why it is interesting |
| ---: | --- | --- | --- |
| 111 | Valkey | Open-source key-value datastore, forked from Redis. | Useful for caching, queues, pub/sub, and high-performance key-value workloads. Backed by the Linux Foundation. |
| 112 | KeyDB | Redis-compatible multithreaded database. | Can be a faster Redis-like option in some workloads. |
| 113 | DragonflyDB | Modern Redis/Memcached-compatible datastore. | Designed for high throughput and memory efficiency. |
| 114 | FerretDB | MongoDB-compatible layer on Postgres. | Interesting when you want Mongo-like APIs but Postgres underneath. |
| 115 | Meilisearch | Fast search engine. | Great for instant search in apps without Elasticsearch complexity. |
| 116 | Typesense | Search engine focused on speed and typo tolerance. | Excellent for marketplace, booking, ecommerce, and directory search. |
| 117 | ZincSearch | Lightweight search engine. | Useful for logs and text search without heavy infra. |
| 118 | Qdrant | Vector database. | Strong for semantic search, recommendations, and AI memory. |
| 119 | Weaviate | Vector database with hybrid search. | Useful for AI-native search and knowledge apps. |
| 120 | Milvus | Large-scale vector database. | Good when vector workloads become serious. |
| 121 | LanceDB | Embedded/serverless vector database. | Nice for AI apps that want local or lightweight vector search. |
| 122 | ParadeDB | Postgres-based search and analytics tooling. | Makes Postgres more capable for search-heavy workloads. |
| 123 | Hydra | Columnar Postgres extension/warehouse direction. | Useful idea: analytical workloads without leaving Postgres too early. |
| 124 | Apache Iceberg | Open table format for large analytics datasets. | Strong for lakehouse-style data architecture. |
| 125 | Delta Lake | Storage layer for reliable data lakes. | Adds ACID-like reliability to data lake workflows. |
| 126 | Apache Hudi | Data lake storage framework. | Useful for streaming ingestion and upserts on data lakes. |
| 127 | MinIO | S3-compatible object storage. | Great for self-hosted file/media/object storage. |
| 128 | SeaweedFS | Distributed file/object storage. | Lightweight alternative for large file storage. |
| 129 | Rclone | Cloud storage sync tool. | Swiss army knife for moving files across S3, Drive, Dropbox, servers. |
| 130 | Restic | Encrypted backup tool. | Simple, reliable backups to many storage backends. |

## Data movement, ETL, CDC, analytics pipelines

| # | Tool | What it does | Why it is interesting |
| ---: | --- | --- | --- |
| 131 | Airbyte | Open-source data integration platform. | Move data between apps, databases, warehouses, and analytics systems. |
| 132 | Dagster | Data orchestration platform. | Great for typed, observable data pipelines. |
| 133 | Prefect | Workflow orchestration for data jobs. | Friendly Python-first orchestration. |
| 134 | Kestra | Declarative orchestration platform. | Workflows as YAML/code across APIs, scripts, jobs, and infra. |
| 135 | Benthos / Redpanda Connect | Stream processor and data pipeline tool. | Fantastic for transforming, routing, and connecting event streams. |
| 136 | Fluvio | Distributed streaming platform. | Developer-friendly event streaming, lighter than Kafka in some use cases. |
| 137 | Materialize | Streaming SQL database. | Lets you create real-time materialized views over streams. |
| 138 | RisingWave | Streaming database. | SQL-based real-time stream processing. |
| 139 | Bytewax | Python stream processing. | Useful for real-time data transformations and AI pipelines. |
| 140 | Estuary Flow | Real-time ETL and CDC platform. | Good for connecting operational data to warehouses/search/analytics. |

## Authorization, identity, secrets, and security

| # | Tool | What it does | Why it is interesting |
| ---: | --- | --- | --- |
| 141 | SpiceDB | Fine-grained authorization database inspired by Google Zanzibar. | Great for “can user X do action Y on resource Z?” permission systems. |
| 142 | Permify | Authorization service. | Good for RBAC/ABAC/ReBAC style permissions. |
| 143 | Oso | Authorization as code. | Embed complex authorization rules in application logic cleanly. |
| 144 | Casbin | Authorization library. | Mature access-control library supporting many models. |
| 145 | Open Policy Agent | Policy engine. | Good for infra policies, API authorization, Kubernetes rules, compliance. |
| 146 | Cedar | Policy language by AWS. | Designed for fine-grained app authorization. |
| 147 | Zitadel | Open-source identity platform. | Alternative to Auth0/Okta-style auth platforms. |
| 148 | Authentik | Open-source identity provider. | Useful for SSO, internal tools, and self-hosted identity. |
| 149 | Keycloak | Identity and access management. | Powerful enterprise-grade auth, SSO, federation. |
| 150 | SuperTokens | Auth solution for apps. | Good for sessions, social login, passwordless, multi-tenant auth. |
| 151 | Infisical | Secrets management. | Developer-friendly alternative to manually juggling .env files. |
| 152 | Doppler | Secrets management platform. | Nice DX for syncing secrets across environments. |
| 153 | SOPS | Encrypt secrets in Git. | Great for GitOps and config files. |
| 154 | Mozilla SOPS + age | File encryption workflow. | Simple secure secret storage in repos. |
| 155 | TruffleHog | Secret scanner. | Finds leaked keys and credentials in repos/history. |
| 156 | Gitleaks | Secret scanner. | Good for CI checks before secrets hit production. |
| 157 | Semgrep | Static analysis and security scanning. | Custom rules for catching bugs and insecure code patterns. |
| 158 | CodeQL | Semantic code analysis. | Deep security analysis, especially strong in GitHub workflows. |
| 159 | Syft | Generates software bills of materials. | Useful for supply chain visibility. |
| 160 | Grype | Vulnerability scanner for containers/filesystems/SBOMs. | Pairs nicely with Syft. |

## Containers, Kubernetes, deployment, and platform tools

| # | Tool | What it does | Why it is interesting |
| ---: | --- | --- | --- |
| 161 | K3s | Lightweight Kubernetes distribution. | Great for small clusters, edge, local labs. |
| 162 | k3d | Runs K3s in Docker. | Easy local Kubernetes clusters. |
| 163 | Kind | Kubernetes in Docker. | Great for local testing Kubernetes manifests/operators. |
| 164 | Rancher Desktop | Desktop Kubernetes/container environment. | Alternative to Docker Desktop. |
| 165 | Colima | Lightweight container runtime for macOS/Linux. | Docker-compatible local dev without Docker Desktop. |
| 166 | Podman | Daemonless container engine. | Docker alternative with rootless containers. |
| 167 | Buildah | Build OCI container images. | Useful for secure/container-native build pipelines. |
| 168 | Kaniko | Build container images in Kubernetes. | Useful where Docker daemon is not available. |
| 169 | Ko | Build Go apps into containers. | Very fast containerization for Go services. |
| 170 | werf | CI/CD and GitOps tool for Kubernetes. | Handles building, deploying, and releasing apps to K8s. |
| 171 | Argo CD | GitOps continuous deployment. | Keeps Kubernetes state synced from Git. |
| 172 | Flux CD | GitOps deployment toolkit. | Another strong GitOps option. |
| 173 | Crossplane | Cloud infrastructure control plane on Kubernetes. | Manage cloud resources using Kubernetes APIs. |
| 174 | KubeVela | Application delivery platform. | Abstracts app deployment across Kubernetes environments. |
| 175 | External Secrets Operator | Sync external secrets into Kubernetes. | Pull secrets from Vault, AWS Secrets Manager, GCP Secret Manager, etc. |
| 176 | Sealed Secrets | Encrypt Kubernetes secrets safely for Git. | GitOps-friendly secret management. |
| 177 | Kyverno | Kubernetes policy engine. | Validate/mutate/generate Kubernetes resources. |
| 178 | Cilium | eBPF-based networking/security for Kubernetes. | Powerful networking, observability, and security layer. |
| 179 | Hubble | Network observability for Cilium. | See service-to-service traffic clearly. |
| 180 | Karpenter | Kubernetes node autoscaler. | Smarter cluster scaling, especially on AWS. |

## Observability, profiling, tracing, and debugging

| # | Tool | What it does | Why it is interesting |
| ---: | --- | --- | --- |
| 181 | Grafana Beyla | eBPF-based auto-instrumentation. | Captures RED metrics and basic traces for HTTP/gRPC services without changing app code. |
| 182 | Grafana Alloy | OpenTelemetry Collector distribution. | Collect logs, metrics, traces, and profiles. |
| 183 | Pixie | Kubernetes observability using eBPF. | Debug live clusters without manually instrumenting everything. |
| 184 | Parca | Continuous profiling. | Helps find CPU/memory hotspots over time. |
| 185 | Pyroscope | Continuous profiling. | Useful for profiling production services. |
| 186 | Grafana Faro | Frontend observability SDK. | Capture frontend errors, performance, sessions, web vitals. |
| 187 | Jaeger | Distributed tracing system. | Classic tool for tracing microservices. |
| 188 | Zipkin | Distributed tracing. | Older but still useful tracing system. |
| 189 | Vector | Observability data pipeline. | Collect, transform, and route logs/metrics. |
| 190 | Fluent Bit | Lightweight log processor. | Very common for Kubernetes logging. |
| 191 | Fluentd | Log collection and routing. | Mature log pipeline tool. |
| 192 | OpenReplay | Open-source session replay. | Replay frontend user sessions for debugging. |
| 193 | Highlight.io | Open-source monitoring/session replay. | Combines errors, logs, traces, and sessions. |
| 194 | Logto | Auth plus product/user identity workflows. | Useful for SaaS-style authentication and identity. |
| 195 | Checkly | Synthetic monitoring. | Monitor APIs and browser flows from outside your infra. |

## Frontend, UI, design systems, and developer experience

| # | Tool | What it does | Why it is interesting |
| ---: | --- | --- | --- |
| 196 | TanStack Query | Server-state management. | One of the best tools for API data caching, retries, invalidation. |
| 197 | TanStack Router | Type-safe router. | Strong routing with search params, loaders, route typing. |
| 198 | TanStack Table | Headless table engine. | Great for complex data tables. |
| 199 | TanStack Form | Form state management. | Type-safe forms with validation-first thinking. |
| 200 | TanStack Virtual | Virtualized lists/grids. | Render huge lists without killing performance. |
| 201 | Valtio | Proxy-based state management. | Minimal and reactive state management. |
| 202 | Jotai | Atomic state management. | Nice for splitting state into small composable atoms. |
| 203 | XState | State machines and statecharts. | Great for complex flows: onboarding, checkout, booking, KYC. |
| 204 | Zag.js | Headless UI state machines. | Build accessible UI primitives across frameworks. |
| 205 | Ark UI | Headless component library built on Zag. | Accessible components without styling lock-in. |
| 206 | Radix UI | Headless React UI primitives. | Excellent accessibility primitives. |
| 207 | shadcn/ui | Copy-paste component system. | Gives you ownership of components instead of dependency prison. |
| 208 | Melt UI | Headless UI for Svelte. | Good design-system building block. |
| 209 | Floating UI | Positioning engine for tooltips/popovers/dropdowns. | Handles annoying UI positioning problems elegantly. |
| 210 | Vaul | Drawer component library. | Great mobile-style drawers for web apps. |

## TypeScript, validation, code generation, and repo hygiene

| # | Tool | What it does | Why it is interesting |
| ---: | --- | --- | --- |
| 211 | Zod | TypeScript schema validation. | Great for DTOs, forms, API validation, env validation. |
| 212 | Valibot | Lightweight validation library. | Smaller/faster alternative to heavier schema validators. |
| 213 | ArkType | TypeScript-native runtime validation. | Interesting because it feels close to writing TypeScript types. |
| 214 | TypeBox | JSON Schema builder with TypeScript types. | Great for Fastify and schema-first APIs. |
| 215 | Effect | TypeScript effect system. | Powerful for typed errors, dependency injection, retries, concurrency. |
| 216 | ts-pattern | Pattern matching for TypeScript. | Cleaner branching for complex states and discriminated unions. |
| 217 | ts-morph | TypeScript AST manipulation. | Build codemods, generators, analyzers. |
| 218 | jscodeshift | JavaScript/TypeScript codemods. | Automate large refactors. |
| 219 | Hygen | Code generator. | Scaffold components, services, modules, tests consistently. |
| 220 | Plop | Micro-generator framework. | Great for enforcing project patterns. |
| 221 | GraphQL Code Generator | Generates typed GraphQL clients/resolvers. | Removes hand-written GraphQL types. |
| 222 | OpenAPI Generator | Generates clients/servers from OpenAPI. | Useful for multi-language API SDKs. |
| 223 | Buf | Protobuf tooling. | Linting, breaking-change detection, codegen for protobuf APIs. |
| 224 | ConnectRPC | Modern RPC framework. | Simpler gRPC-like APIs for browsers and servers. |
| 225 | Protobuf-ES | TypeScript protobuf implementation. | Strong when using protobuf in JS/TS systems. |

## Testing, reliability, chaos, and performance

| # | Tool | What it does | Why it is interesting |
| ---: | --- | --- | --- |
| 226 | Artillery | Load testing toolkit. | Good for HTTP, WebSocket, Socket.io, and serverless load tests. |
| 227 | Vegeta | HTTP load testing. | Simple command-line load testing. |
| 228 | wrk | HTTP benchmarking. | Very fast low-level HTTP benchmarking. |
| 229 | Locust | Python load testing. | Great for user-behavior-based load simulation. |
| 230 | Gatling | Load testing platform. | Strong for serious performance testing. |
| 231 | Toxiproxy | Network failure simulation. | Test latency, timeouts, connection drops, flaky dependencies. |
| 232 | Chaos Mesh | Chaos engineering for Kubernetes. | Intentionally break things to validate resilience. |
| 233 | LitmusChaos | Cloud-native chaos engineering. | Useful for Kubernetes reliability testing. |
| 234 | Pumba | Chaos testing for Docker. | Kill containers, add network delay, simulate failure locally. |
| 235 | Comcast | Network chaos testing. | Simulate poor networks. |
| 236 | Faker.js | Generate fake data. | Great for tests, seeds, demos. |
| 237 | Fishery | Test factory library. | Cleaner test data factories in TypeScript. |
| 238 | Sinon | Test spies, stubs, mocks. | Useful for unit testing behavior. |
| 239 | Nock | HTTP mocking for Node.js. | Mock external HTTP services. |
| 240 | Polly.js | Record/replay HTTP interactions. | Useful for tests against third-party APIs. |

## AI engineering and LLM app infrastructure

| # | Tool | What it does | Why it is interesting |
| ---: | --- | --- | --- |
| 241 | LangGraph | Graph-based LLM workflows. | Better for agentic flows than simple chains. |
| 242 | LlamaIndex | Data framework for LLM apps. | Good for RAG, document ingestion, retrieval workflows. |
| 243 | Haystack | LLM/RAG pipeline framework. | Strong for search + retrieval + generation systems. |
| 244 | DSPy | Programmatic prompt/LLM optimization. | Lets you optimize prompts and pipelines more scientifically. |
| 245 | Instructor | Structured outputs from LLMs. | Great for getting validated JSON/Pydantic-style responses. |
| 246 | Outlines | Structured generation for LLMs. | Constrain LLM output to schemas/patterns. |
| 247 | Guidance | Control LLM generation. | Useful for templated, constrained generation. |
| 248 | vLLM | High-throughput LLM serving. | Great for serving open models efficiently. |
| 249 | TGI | Text Generation Inference by Hugging Face. | Production-grade open model serving. |
| 250 | llama.cpp | Run LLMs locally efficiently. | Huge for local/private AI workflows. |
| 251 | LM Studio | Desktop app for local LLMs. | Friendly local model testing. |
| 252 | Open WebUI | Self-hosted UI for local/remote LLMs. | Good interface around Ollama and other providers. |
| 253 | Ragas | Evaluate RAG pipelines. | Measure faithfulness, context relevance, answer quality. |
| 254 | DeepEval | LLM evaluation framework. | Unit-test AI outputs. |
| 255 | Promptfoo | Prompt testing and evals. | Regression-test prompts across models. |

## Docs, collaboration, architecture diagrams, and knowledge systems

| # | Tool | What it does | Why it is interesting |
| ---: | --- | --- | --- |
| 256 | Docusaurus | Documentation site generator. | Great for product/dev docs. |
| 257 | Nextra | Next.js-powered docs framework. | Beautiful docs with MDX. |
| 258 | Starlight | Astro docs framework. | Fast, clean docs sites. |
| 259 | MkDocs Material | Python Markdown docs site. | Excellent for internal engineering docs. |
| 260 | Mintlify | Modern documentation platform. | Great-looking API/product docs. |
| 261 | Mermaid | Diagrams as text. | Architecture diagrams inside markdown. |
| 262 | PlantUML | Text-based UML diagrams. | Useful for system design documentation. |
| 263 | Structurizr | C4 architecture modeling. | Strong for serious architecture diagrams. |
| 264 | Excalidraw | Hand-drawn style diagrams. | Great for explaining ideas quickly. |
| 265 | Tldraw | Whiteboard/canvas SDK. | Build collaborative canvas features into apps. |
