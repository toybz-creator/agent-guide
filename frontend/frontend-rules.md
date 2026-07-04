# Frontend Production Rules

## Purpose

These rules apply to frontend, product UI, browser-facing behavior, design systems, routing, forms, accessibility, client data, and frontend integration work.

These rules are stack-neutral unless a rule names a framework condition explicitly. Project evidence determines the applicable toolchain.

## Frontend Mission

The frontend mission is to align user flows, data contracts, visible states, accessibility, responsiveness, tests, operations, and documentation.

## Architecture

- [PAG-FE-001] [MUST] Organize by feature/domain where practical. Keep feature UI, hooks, schemas, queries, mutations, state, tests, and docs close enough to understand the feature as a unit.
- [PAG-FE-002] [MUST] Keep shared UI primitives, design tokens, layout shells, API clients, telemetry, auth/session helpers, and utility infrastructure in clearly owned shared areas.
- [PAG-FE-003] [MUST] Use bounded feature modules for substantial user workflows that need multiple screens, components, hooks, client/server actions, schemas, stores, realtime bindings, or API integrations. The module should expose a small public surface and keep workflow-specific UI, state ownership, validation, data contracts, tests, and docs together.
- [PAG-FE-005] [SHOULD] Promote a bounded feature module to a shared package or workspace library only when reuse across apps, design-system ownership, independent release cadence, security isolation, or bundle/runtime constraints justify the extra dependency boundary.
- [PAG-FE-006] [SHOULD] Prefer explicit server/client boundaries in Next.js. Use Server Components for server-only data and rendering where useful; use Client Components for interactivity, browser APIs, client state, and event handling.
- [PAG-FE-007] [MUST] Keep server-only clients, admin SDKs, privileged tokens, and secret-backed helpers in server-only modules. Browser clients must expose only the minimum public configuration and user-safe operations.
- [PAG-FE-008] [MUST] Keep route files thin. Move reusable behavior into feature modules, server actions, services, hooks, validation modules, stores, or shared UI components.
- [PAG-FE-009] [MUST] In Next.js projects, use Server Actions or route handlers for trusted mutations when they fit the product and framework version. Mutations must validate input server-side, read the authenticated user or session server-side, enforce authorization, and return typed success/error results.
- [PAG-FE-010] [MUST] Do not leak raw API response shapes throughout the UI. Normalize or validate at the boundary when needed.
- [PAG-FE-011] [MUST] Keep business rules in shared domain helpers or server APIs when they must be consistent across clients.
- [PAG-FE-012] [MUST] Avoid global state by default. Use URL state, server state, component state, or Zustand only where each is the right owner.
- [PAG-FE-013] [MUST] Add abstractions only when they remove real duplication, centralize policy, or match existing project patterns.

## Data And API Contracts

- [PAG-FE-014] [MUST] Use typed API clients and validated schemas for all server communication.
- [PAG-FE-015] [SHOULD] Prefer generated types from OpenAPI, tRPC, GraphQL, or shared Zod schemas when available.
- [PAG-FE-016] [MUST] Validate unknown external data at the boundary with Zod or the project’s established schema tool.
- [PAG-FE-017] [MUST] Keep API wrappers as the only place that knows raw transport details, base URLs, auth headers, retries, timeouts, response envelopes, and error translation.
- [PAG-FE-018] [MUST] Do not scatter `fetch`, `axios`, or SDK calls across components. Route them through project-owned clients/hooks.
- [PAG-FE-019] [MUST] Use stable query keys and colocated query/mutation definitions.
- [PAG-FE-020] [MUST] Define cache invalidation rules when adding mutations.
- [PAG-FE-021] [MUST] Use optimistic updates only when rollback is safe, user expectations are clear, and conflict handling is defined.
- [PAG-FE-022] [MUST] For workflows with versioned backend models, include the known record/workflow version in mutations when stale writes would be unsafe. Handle version-conflict responses by showing a recoverable conflict state, refetching current data, and asking the user to retry or merge when needed.
- [PAG-FE-023] [SHOULD] When the server returns a successful mutation response with enough data to update the current view safely, patch the client cache/state instead of reflexively refetching every related query. Still invalidate or refetch when derived data, permissions, server-calculated totals, or other users' changes could make local computation unsafe.
- [PAG-FE-024] [SHOULD] For groups of related requests such as dashboard data after a transaction, define a cache dependency map: which queries can be patched, which must be invalidated, which can wait for a realtime event, and which should refetch with jitter to avoid thundering herds.
- [PAG-FE-025] [MUST] Handle empty, loading, success, error, unauthorized, forbidden, offline, stale, and partial-data states intentionally.
- [PAG-FE-026] [MUST] When caching aggressively, preserve the product's required accuracy and consistency through explicit freshness, invalidation, conflict, and user-visible stale-state rules.

## State Management

- [PAG-FE-027] [MUST] When the project uses TanStack Query, treat it as the owner of server state rather than duplicating that data in client stores.
- [PAG-FE-028] [SHOULD] Use the project's approved lightweight client-state store, such as Zustand, only for cross-route or cross-component client state that is not server state.
- [PAG-FE-029] [MUST] Treat component state as the default for local UI behavior.
- [PAG-FE-030] [MUST] Treat URL/search params as the source of truth for shareable filters, pagination, sorting, tabs, and deep-linkable state.
- [PAG-FE-031] [MUST] Avoid duplicating the same state in multiple stores. Derive where possible.
- [PAG-FE-032] [MUST] Keep stores small, typed, and feature-owned. Expose actions instead of allowing arbitrary mutation.
- [PAG-FE-033] [MUST] Do not store session secrets, server-owned records, or persisted business data in client stores as the source of truth.
- [PAG-FE-034] [MUST] Clear sensitive or user-scoped client state on logout, tenant switch, account switch, or permission downgrade.
- [PAG-FE-035] [MUST] Use selectors or equivalent subscription patterns to avoid broad rerenders from shared stores.
- [PAG-FE-036] [MUST] Persist client state only when there is a clear product reason. Version persisted state and handle migration/reset.
- [PAG-FE-037] [MUST] Balance availability and consistency with clear status, loading, stale-data, and refresh indicators so users understand what data is current and what is still updating.

## Routing And Navigation

- [PAG-FE-038] [MUST] Use framework-native routing and metadata APIs.
- [PAG-FE-039] [MUST] Preserve deep links for meaningful product states.
- [PAG-FE-040] [MUST] Keep redirects, auth gating, role gating, and onboarding gates centralized.
- [PAG-FE-041] [MUST] Protect private routes on the server where possible, not only in client-side checks. In Next.js projects, use Middleware, server layouts, route handlers, or server actions as appropriate for route protection and authorization boundaries.
- [PAG-FE-042] [MUST] Ensure navigation is keyboard accessible and screen-reader understandable.
- [PAG-FE-043] [MUST] Show route-level loading and error states that preserve context and do not trap the user.
- [PAG-FE-044] [MUST] Keep routing and interaction feedback responsive. When work cannot complete immediately, show progress without blocking unrelated navigation.

## Forms And Validation

- [PAG-FE-045] [SHOULD] Use the project's established form library for non-trivial forms; React Hook Form is an option, not a universal requirement.
- [PAG-FE-046] [MUST] Use shared schemas for client and server validation when practical.
- [PAG-FE-047] [MUST] Validate on the client for fast feedback and on the server for trust.
- [PAG-FE-048] [MUST] Make errors field-specific, accessible, and actionable.
- [PAG-FE-049] [MUST] Preserve user input on recoverable errors.
- [PAG-FE-050] [MUST] Prevent duplicate submissions and define idempotency for risky mutations.
- [PAG-FE-051] [MUST] Reject invalid numeric, date, email, enum, and identifier inputs at both client and server boundaries. Normalize data before persistence or API submission.
- [PAG-FE-052] [MUST] Handle slow networks, validation races, autosave conflicts, file upload progress, cancellation, and retry behavior where relevant.

## Realtime, Streaming, And Live Data

- [PAG-FE-053] [MUST] Use a typed project-owned boundary for realtime, SSE, WebSocket, polling, broadcast-channel, or vendor SDK integrations.
- [PAG-FE-054] [MUST] Keep components decoupled from raw vendor event payloads. Convert events into feature-level contracts before they reach UI code.
- [PAG-FE-055] [MUST] Use SSE for one-way server-to-client event streams when it fits; use WebSockets only when bidirectional behavior is required; use polling when it is simpler, reliable enough, and cheaper to operate.
- [PAG-FE-056] [MUST] Expose feature-level hooks or services that report connected, reconnecting, disconnected, stale, and error states.
- [PAG-FE-057] [MUST] Filter or verify live events against the authenticated user, tenant, role, and currently visible resource before updating UI.
- [PAG-FE-058] [MUST] Clean up subscriptions on unmount, logout, account switch, route changes, and permission changes.
- [PAG-FE-059] [MUST] Define how live events refresh cached data: invalidate queries, patch cache with rollback, revalidate routes, or refetch affected resources.
- [PAG-FE-060] [MUST] When many clients receive the same realtime update, avoid synchronized refetch storms. Use scoped invalidation, local patching where safe, server-provided versions, random client-side refetch jitter, and cache headers/server cache so the first cold request can warm shared cache.
- [PAG-FE-061] [SHOULD] Realtime read models may use Firestore-like reactive stores, SSE, WebSockets, broadcast channels, or polling. Keep the backend as the authority for writes, versioning, authorization, and reconciliation; the frontend subscribes to scoped read data and treats live updates as eventually consistent unless the product contract says otherwise.
- [PAG-FE-062] [MUST] Realtime must degrade gracefully. Core CRUD and navigation should still work when live updates are delayed or unavailable.

## UI, Semantics, And Design Systems

- [PAG-FE-063] [MUST] Use existing design system components before creating new primitives.
- [PAG-FE-064] [SHOULD] Prefer accessible headless/component libraries with strong React and Next.js support when the project lacks a component.
- [PAG-FE-065] [MUST] If a project declares local screenshots, prototypes, storybook stories, or design files as the UI source of truth, inspect the relevant reference before changing the mapped screen and compare the implemented UI against it during browser verification. Do not use a different design source unless project docs say to.
- [PAG-FE-066] [MUST] Use semantic HTML first: buttons for actions, links for navigation, headings in order, labels for controls, lists/tables where appropriate.
- [PAG-FE-067] [MUST] Use icons for familiar tool actions when available, with accessible labels and tooltips for ambiguous icons.
- [PAG-FE-068] [MUST] Keep UI density appropriate to the product. Enterprise tools should be scan-friendly, predictable, and efficient rather than decorative.
- [PAG-FE-069] [MUST] Avoid card nesting and decorative clutter unless the existing design system explicitly uses it.
- [PAG-FE-070] [MUST] Keep text readable, responsive, and non-overlapping at supported viewport sizes.
- [PAG-FE-071] [MUST] Build complete states for components: default, hover, focus, active, disabled, loading, error, empty, selected, and readonly where relevant.
- [PAG-FE-072] [MUST] Keep design tokens, colors, spacing, typography, radii, shadows, and motion consistent.
- [PAG-FE-073] [MUST] Build actual usable screens, not placeholder landing pages, when the task is to create an app, dashboard, workflow, or tool.
- [PAG-FE-074] [MUST] Use framework image optimization APIs for meaningful images where available. In Next.js, prefer `next/image` unless a documented constraint requires a plain image element.
- [PAG-FE-075] [MUST] Tables and dense data views must include responsive behavior, empty/loading/error states, accessible controls, keyboard-friendly actions, and a mobile strategy.
- [PAG-FE-076] [MUST] Paginate, virtualize, or progressively load long lists instead of fetching and rendering unbounded datasets.
- [PAG-FE-077] [MUST] Charts and dashboards must use shared typed aggregation utilities for business calculations instead of duplicating ad hoc math inside component trees.

## Accessibility

- [PAG-FE-078] [MUST] Meet WCAG-aware expectations for production UI.
- [PAG-FE-079] [MUST] Ensure keyboard access for all interactive elements.
- [PAG-FE-080] [MUST] Provide visible focus states.
- [PAG-FE-081] [MUST] Use accessible names for buttons, links, inputs, icons, dialogs, menus, tabs, toasts, and live regions.
- [PAG-FE-082] [MUST] Use ARIA only when semantic HTML is insufficient, and use it correctly.
- [PAG-FE-083] [MUST] Preserve focus management in modals, drawers, menus, route transitions, and async flows.
- [PAG-FE-084] [MUST] Announce important async updates with appropriate live regions.
- [PAG-FE-085] [MUST] Do not make toast notifications the only place critical errors, validation failures, or destructive-action outcomes appear.
- [PAG-FE-086] [MUST] Do not rely on color alone to communicate status.
- [PAG-FE-087] [MUST] Respect reduced-motion preferences.
- [PAG-FE-088] [MUST] Check contrast, hit targets, form labels, error associations, and screen-reader reading order.

## Interaction And Communication

- [PAG-FE-089] [MUST] Give users immediate feedback for actions.
- [PAG-FE-090] [MUST] Use loading states that preserve layout and communicate progress.
- [PAG-FE-091] [MUST] Use error messages that explain what happened and what the user can do next.
- [PAG-FE-092] [MUST] Use confirmations for destructive or expensive actions.
- [PAG-FE-093] [MUST] Use undo, draft, or recovery patterns where they improve safety.
- [PAG-FE-094] [MUST] Do not hide long-running operations. Show status and make refresh/retry behavior clear.
- [PAG-FE-095] [MUST] Keep optimistic UI honest. Never show irreversible success before durable confirmation unless the product explicitly supports compensation.
- [PAG-FE-096] [MUST] Make offline or degraded states understandable where applicable.

## Security And Privacy

- [PAG-FE-097] [MUST] Never trust client-side authorization as the only protection.
- [PAG-FE-098] [MUST] Avoid exposing secrets, private environment variables, internal IDs, sensitive payloads, or debug data in the browser.
- [PAG-FE-099] [MUST] Use framework-approved environment variable patterns. In Next.js, expose only intentionally public `NEXT_PUBLIC_*` values.
- [PAG-FE-100] [MUST] Sanitize or safely render user-generated content. Avoid unsafe HTML unless it is sanitized and justified.
- [PAG-FE-101] [MUST] Protect against XSS, CSRF where relevant, open redirects, clickjacking-sensitive flows, token leakage, and insecure storage.
- [PAG-FE-102] [MUST] Store tokens and session data according to the project security model. Prefer secure HTTP-only cookies when appropriate.
- [PAG-FE-103] [MUST] Do not trust client-provided ownership fields, roles, computed totals, prices, permissions, or other authority-sensitive values. Recompute or verify them on the server.
- [PAG-FE-104] [MUST] Redact sensitive data from logs, telemetry, error reports, screenshots, and analytics.

## Performance

- [PAG-FE-105] [MUST] Optimize for real user experience: startup, interaction latency, navigation, data freshness, and visual stability.
- [PAG-FE-106] [MUST] Use Next.js image, font, metadata, caching, streaming, and route segment features appropriately.
- [PAG-FE-107] [SHOULD] Split code by route/feature and avoid shipping large libraries to the client unnecessarily.
- [PAG-FE-108] [MUST] Keep Client Components small and intentional.
- [PAG-FE-109] [SHOULD] Lazy-load heavy components, charts, editors, maps, media, and rarely used panels when that reduces initial cost without harming core usability.
- [PAG-FE-110] [MUST] Monitor bundle size before release when adding large dependencies, charting libraries, editors, rich UI kits, or broad client-side imports.
- [PAG-FE-111] [MUST] Avoid unnecessary re-renders with stable props, memoization only where useful, and localized state.
- [PAG-FE-112] [MUST] Use pagination, virtualization, streaming, or progressive rendering for large lists/data.
- [PAG-FE-113] [MUST] Avoid layout shift by reserving stable dimensions for media, grids, tables, toolbars, and skeletons.
- [PAG-FE-114] [MUST] Measure before optimizing complex performance issues.

## Observability

- [PAG-FE-115] [MUST] Capture frontend errors with useful context and source maps where the project supports it.
- [PAG-FE-116] [MUST] Track key user journeys, conversion events, failure states, latency, API errors, and feature usage.
- [PAG-FE-117] [MUST] Use correlation IDs or request IDs where available to connect frontend errors to backend traces.
- [PAG-FE-118] [MUST] Keep telemetry privacy-aware and avoid high-cardinality or sensitive fields.
- [PAG-FE-119] [MUST] Add logging/analytics through project-owned wrappers, not scattered vendor SDK calls.
- [PAG-FE-120] [MUST] Add configs to show or hide logs and log levels.
- [PAG-FE-121] [MUST] Use project-owned wrappers for analytics, product events, session replay, bug capture, and console/network log collection. Examples may include Amplitude for analytics and Jam.dev for user-submitted bug context, but the chosen provider must be recorded in project docs and must respect consent, privacy, retention, and environment boundaries.

## Reliability

- [PAG-FE-122] [MUST] Gracefully handle API failures, timeouts, offline states, stale data, expired sessions, forbidden actions, and partial responses.
- [PAG-FE-123] [MUST] Use retries carefully. Retry safe reads more readily than writes; avoid retry storms.
- [PAG-FE-124] [MUST] Provide recovery actions: retry, refresh, edit, save draft, contact support, or navigate back.
- [PAG-FE-125] [MUST] Treat date, time, and timezone behavior as domain logic when it affects status, scheduling, deadlines, billing, or reporting. Test boundary cases explicitly.
- [PAG-FE-126] [MUST] Use error boundaries for route and component failures.
- [PAG-FE-127] [MUST] Ensure Suspense/loading boundaries are intentional and do not create blank screens.
- [PAG-FE-128] [MUST] Keep feature flags and experiments safe with defaults and fallback UI.

## Internationalization And Content

- [PAG-FE-129] [MUST] Keep user-facing text centralized or easy to extract when the project needs i18n.
- [PAG-FE-130] [MUST] Avoid hardcoded locale-specific date, time, currency, number, and pluralization logic.
- [PAG-FE-131] [MUST] Use clear, concise product language.
- [PAG-FE-132] [MUST] Make content accessible to screen readers and translation workflows.

## Testing

- [PAG-FE-133] [MUST] Unit test pure helpers, schemas, stores, reducers, and complex component logic.
- [PAG-FE-134] [MUST] Unit test business-relevant client stores, validation schemas, data-formatting helpers, date/time logic, and aggregation utilities.
- [PAG-FE-135] [MUST] Component test important UI states, interactions, accessibility roles, keyboard behavior, and error/loading/empty states.
- [PAG-FE-136] [MUST] Integration test feature flows with realistic API mocks.
- [PAG-FE-137] [MUST] Integration test trusted mutation paths for server-side validation, authorization, cache invalidation, and user-visible success/failure states.
- [PAG-FE-138] [MUST] Include security and bad-request scenarios for forms, route guards, server actions, API clients, upload flows, redirects, auth expiry, role changes, tenant switches, and malformed or malicious server responses.
- [PAG-FE-139] [MUST] Treat no-regression coverage as part of feature work. Tests should protect existing supported behavior, not only the newly added happy path.
- [PAG-FE-140] [MUST] E2E test critical user journeys, auth/role behavior, forms, navigation, and high-risk regressions.
- [PAG-FE-141] [MUST] E2E tests must avoid production data. Use a dedicated test environment, seeded fixtures, mocked backend, or other deterministic strategy approved by the project.
- [PAG-FE-142] [MUST] Add accessibility checks using the project’s testing tools where available.
- [PAG-FE-143] [MUST] For visual/product UI changes, verify relevant desktop and mobile viewports in a browser. When a project has declared design references, compare spacing, layout, hierarchy, responsive behavior, and visible states against the matching reference.
- [PAG-FE-144] [SHOULD] Manually exercise each developed user-facing feature when feasible, including happy path, validation failures, loading, empty, error, unauthorized/forbidden, and destructive-action paths.
- [PAG-FE-145] [MUST] Tests should assert user-visible behavior, not implementation trivia.

## Config And Tooling

- [PAG-FE-146] [MUST] Keep TypeScript strict and avoid `any` unless isolated and justified.
- [PAG-FE-147] [MUST] Use linting, formatting, import ordering, import boundaries, and type checks to enforce consistency.
- [PAG-FE-148] [MUST] Keep environment configuration typed and validated.
- [PAG-FE-149] [MUST] Use package choices that are actively maintained, widely adopted, and compatible with the framework.
- [PAG-FE-150] [SHOULD] Prefer Zustand over Redux for lightweight app state unless the project already has Redux or needs Redux-specific capabilities.
- [PAG-FE-151] [SHOULD] Prefer TanStack Query over ad hoc fetching for cached server state.
- [PAG-FE-152] [SHOULD] Prefer Zod for shared runtime validation where it fits.

## Documentation

- [PAG-FE-153] [MUST] Update `frontend-handbook.md` after meaningful frontend changes.
- [PAG-FE-154] [MUST] Document routes, state ownership, data flow, design-system additions, accessibility notes, and integration contracts.
- [PAG-FE-155] [MUST] Update `development-history.md`, `tasks.md`, and `files-directories.md` when changes are meaningful.
- [PAG-FE-156] [MUST] Document new environment variables, browser verification requirements, design-reference gaps, realtime strategies, server/client boundaries, and test strategy changes.
- [PAG-FE-157] [MUST] Keep component docs concise and focused on purpose, props, states, accessibility, and integration cautions.

Frontend completion is governed by the selected `PAG-FE-*` rules and the terminal completion test in `instructions.md`; this rulebook does not maintain a duplicate completion checklist.
