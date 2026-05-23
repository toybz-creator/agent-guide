# Frontend Production Rules

## Purpose

These rules apply to frontend, product UI, browser-facing behavior, design systems, routing, forms, accessibility, client data, and frontend integration work.

The default stack is TypeScript, React, Next.js, TanStack Query, Zustand, Zod, React Hook Form where useful, utility-first styling where it fits, and mature accessibility-focused UI libraries. Prefer libraries that are actively maintained, easy to reason about, integrate well with the stack, and provide high value with low operational complexity.

## Frontend Mission

Build interfaces that are correct, accessible, fast, resilient, secure, observable, and pleasant to use. A frontend task is complete only when the user flow, data contracts, error states, loading states, accessibility, responsiveness, tests, and docs are aligned.

## Architecture

- Organize by feature/domain where practical. Keep feature UI, hooks, schemas, queries, mutations, state, tests, and docs close enough to understand the feature as a unit.
- Keep shared UI primitives, design tokens, layout shells, API clients, telemetry, auth/session helpers, and utility infrastructure in clearly owned shared areas.
- Prefer explicit server/client boundaries in Next.js. Use Server Components for server-only data and rendering where useful; use Client Components for interactivity, browser APIs, client state, and event handling.
- Keep server-only clients, admin SDKs, privileged tokens, and secret-backed helpers in server-only modules. Browser clients must expose only the minimum public configuration and user-safe operations.
- Keep route files thin. Move reusable behavior into feature modules, server actions, services, hooks, validation modules, stores, or shared UI components.
- In Next.js projects, use Server Actions or route handlers for trusted mutations when they fit the product and framework version. Mutations must validate input server-side, read the authenticated user or session server-side, enforce authorization, and return typed success/error results.
- Do not leak raw API response shapes throughout the UI. Normalize or validate at the boundary when needed.
- Keep business rules in shared domain helpers or server APIs when they must be consistent across clients.
- Avoid global state by default. Use URL state, server state, component state, or Zustand only where each is the right owner.
- Add abstractions only when they remove real duplication, centralize policy, or match existing project patterns.

## Data And API Contracts

- Use typed API clients and validated schemas for all server communication.
- Prefer generated types from OpenAPI, tRPC, GraphQL, or shared Zod schemas when available.
- Validate unknown external data at the boundary with Zod or the project’s established schema tool.
- Keep API wrappers as the only place that knows raw transport details, base URLs, auth headers, retries, timeouts, response envelopes, and error translation.
- Do not scatter `fetch`, `axios`, or SDK calls across components. Route them through project-owned clients/hooks.
- Use stable query keys and colocated query/mutation definitions.
- Define cache invalidation rules when adding mutations.
- Use optimistic updates only when rollback is safe, user expectations are clear, and conflict handling is defined.
- Handle empty, loading, success, error, unauthorized, forbidden, offline, stale, and partial-data states intentionally.

## State Management

- Treat TanStack Query as the owner of server state.
- Treat Zustand as the preferred lightweight store for cross-route or cross-component client state that is not server state.
- Treat component state as the default for local UI behavior.
- Treat URL/search params as the source of truth for shareable filters, pagination, sorting, tabs, and deep-linkable state.
- Avoid duplicating the same state in multiple stores. Derive where possible.
- Keep stores small, typed, and feature-owned. Expose actions instead of allowing arbitrary mutation.
- Do not store session secrets, server-owned records, or persisted business data in client stores as the source of truth.
- Clear sensitive or user-scoped client state on logout, tenant switch, account switch, or permission downgrade.
- Use selectors or equivalent subscription patterns to avoid broad rerenders from shared stores.
- Persist client state only when there is a clear product reason. Version persisted state and handle migration/reset.
- Balance availability and consistency with clear status, loading, stale-data, and refresh indicators so users understand what data is current and what is still updating.

## Routing And Navigation

- Use framework-native routing and metadata APIs.
- Preserve deep links for meaningful product states.
- Keep redirects, auth gating, role gating, and onboarding gates centralized.
- Protect private routes on the server where possible, not only in client-side checks. In Next.js projects, use Middleware, server layouts, route handlers, or server actions as appropriate for route protection and authorization boundaries.
- Ensure navigation is keyboard accessible and screen-reader understandable.
- Show route-level loading and error states that preserve context and do not trap the user.
- Keep routing and interaction feedback responsive. When work cannot complete immediately, show progress without blocking unrelated navigation.

## Forms And Validation

- Use React Hook Form or the project’s established form library for non-trivial forms.
- Use shared schemas for client and server validation when practical.
- Validate on the client for fast feedback and on the server for trust.
- Make errors field-specific, accessible, and actionable.
- Preserve user input on recoverable errors.
- Prevent duplicate submissions and define idempotency for risky mutations.
- Reject invalid numeric, date, email, enum, and identifier inputs at both client and server boundaries. Normalize data before persistence or API submission.
- Handle slow networks, validation races, autosave conflicts, file upload progress, cancellation, and retry behavior where relevant.

## Realtime, Streaming, And Live Data

- Use a typed project-owned boundary for realtime, SSE, WebSocket, polling, broadcast-channel, or vendor SDK integrations.
- Keep components decoupled from raw vendor event payloads. Convert events into feature-level contracts before they reach UI code.
- Use SSE for one-way server-to-client event streams when it fits; use WebSockets only when bidirectional behavior is required; use polling when it is simpler, reliable enough, and cheaper to operate.
- Expose feature-level hooks or services that report connected, reconnecting, disconnected, stale, and error states.
- Filter or verify live events against the authenticated user, tenant, role, and currently visible resource before updating UI.
- Clean up subscriptions on unmount, logout, account switch, route changes, and permission changes.
- Define how live events refresh cached data: invalidate queries, patch cache with rollback, revalidate routes, or refetch affected resources.
- Realtime must degrade gracefully. Core CRUD and navigation should still work when live updates are delayed or unavailable.

## UI, Semantics, And Design Systems

- Use existing design system components before creating new primitives.
- Prefer accessible headless/component libraries with strong React and Next.js support when the project lacks a component.
- If a project declares local screenshots, prototypes, storybook stories, or design files as the UI source of truth, inspect the relevant reference before changing the mapped screen and compare the implemented UI against it during browser verification. Do not use a different design source unless project docs say to.
- Use semantic HTML first: buttons for actions, links for navigation, headings in order, labels for controls, lists/tables where appropriate.
- Use icons for familiar tool actions when available, with accessible labels and tooltips for ambiguous icons.
- Keep UI density appropriate to the product. Enterprise tools should be scan-friendly, predictable, and efficient rather than decorative.
- Avoid card nesting and decorative clutter unless the existing design system explicitly uses it.
- Keep text readable, responsive, and non-overlapping at supported viewport sizes.
- Build complete states for components: default, hover, focus, active, disabled, loading, error, empty, selected, and readonly where relevant.
- Keep design tokens, colors, spacing, typography, radii, shadows, and motion consistent.
- Build actual usable screens, not placeholder landing pages, when the task is to create an app, dashboard, workflow, or tool.
- Use framework image optimization APIs for meaningful images where available. In Next.js, prefer `next/image` unless a documented constraint requires a plain image element.
- Tables and dense data views must include responsive behavior, empty/loading/error states, accessible controls, keyboard-friendly actions, and a mobile strategy.
- Paginate, virtualize, or progressively load long lists instead of fetching and rendering unbounded datasets.
- Charts and dashboards must use shared typed aggregation utilities for business calculations instead of duplicating ad hoc math inside component trees.

## Accessibility

- Meet WCAG-aware expectations for production UI.
- Ensure keyboard access for all interactive elements.
- Provide visible focus states.
- Use accessible names for buttons, links, inputs, icons, dialogs, menus, tabs, toasts, and live regions.
- Use ARIA only when semantic HTML is insufficient, and use it correctly.
- Preserve focus management in modals, drawers, menus, route transitions, and async flows.
- Announce important async updates with appropriate live regions.
- Do not make toast notifications the only place critical errors, validation failures, or destructive-action outcomes appear.
- Do not rely on color alone to communicate status.
- Respect reduced-motion preferences.
- Check contrast, hit targets, form labels, error associations, and screen-reader reading order.

## Interaction And Communication

- Give users immediate feedback for actions.
- Use loading states that preserve layout and communicate progress.
- Use error messages that explain what happened and what the user can do next.
- Use confirmations for destructive or expensive actions.
- Use undo, draft, or recovery patterns where they improve safety.
- Do not hide long-running operations. Show status and make refresh/retry behavior clear.
- Keep optimistic UI honest. Never show irreversible success before durable confirmation unless the product explicitly supports compensation.
- Make offline or degraded states understandable where applicable.

## Security And Privacy

- Never trust client-side authorization as the only protection.
- Avoid exposing secrets, private environment variables, internal IDs, sensitive payloads, or debug data in the browser.
- Use framework-approved environment variable patterns. In Next.js, expose only intentionally public `NEXT_PUBLIC_*` values.
- Sanitize or safely render user-generated content. Avoid unsafe HTML unless it is sanitized and justified.
- Protect against XSS, CSRF where relevant, open redirects, clickjacking-sensitive flows, token leakage, and insecure storage.
- Store tokens and session data according to the project security model. Prefer secure HTTP-only cookies when appropriate.
- Do not trust client-provided ownership fields, roles, computed totals, prices, permissions, or other authority-sensitive values. Recompute or verify them on the server.
- Redact sensitive data from logs, telemetry, error reports, screenshots, and analytics.

## Performance

- Optimize for real user experience: startup, interaction latency, navigation, data freshness, and visual stability.
- Use Next.js image, font, metadata, caching, streaming, and route segment features appropriately.
- Split code by route/feature and avoid shipping large libraries to the client unnecessarily.
- Keep Client Components small and intentional.
- Lazy-load heavy components, charts, editors, maps, media, and rarely used panels when that reduces initial cost without harming core usability.
- Monitor bundle size before release when adding large dependencies, charting libraries, editors, rich UI kits, or broad client-side imports.
- Avoid unnecessary re-renders with stable props, memoization only where useful, and localized state.
- Use pagination, virtualization, streaming, or progressive rendering for large lists/data.
- Avoid layout shift by reserving stable dimensions for media, grids, tables, toolbars, and skeletons.
- Measure before optimizing complex performance issues.

## Observability

- Capture frontend errors with useful context and source maps where the project supports it.
- Track key user journeys, conversion events, failure states, latency, API errors, and feature usage.
- Use correlation IDs or request IDs where available to connect frontend errors to backend traces.
- Keep telemetry privacy-aware and avoid high-cardinality or sensitive fields.
- Add logging/analytics through project-owned wrappers, not scattered vendor SDK calls.
- Add configs to show or hide logs and log level

## Reliability

- Gracefully handle API failures, timeouts, offline states, stale data, expired sessions, forbidden actions, and partial responses.
- Use retries carefully. Retry safe reads more readily than writes; avoid retry storms.
- Provide recovery actions: retry, refresh, edit, save draft, contact support, or navigate back.
- Treat date, time, and timezone behavior as domain logic when it affects status, scheduling, deadlines, billing, or reporting. Test boundary cases explicitly.
- Use error boundaries for route and component failures.
- Ensure Suspense/loading boundaries are intentional and do not create blank screens.
- Keep feature flags and experiments safe with defaults and fallback UI.

## Internationalization And Content

- Keep user-facing text centralized or easy to extract when the project needs i18n.
- Avoid hardcoded locale-specific date, time, currency, number, and pluralization logic.
- Use clear, concise product language.
- Make content accessible to screen readers and translation workflows.

## Testing

- Unit test pure helpers, schemas, stores, reducers, and complex component logic.
- Unit test business-relevant client stores, validation schemas, data-formatting helpers, date/time logic, and aggregation utilities.
- Component test important UI states, interactions, accessibility roles, keyboard behavior, and error/loading/empty states.
- Integration test feature flows with realistic API mocks.
- Integration test trusted mutation paths for server-side validation, authorization, cache invalidation, and user-visible success/failure states.
- E2E test critical user journeys, auth/role behavior, forms, navigation, and high-risk regressions.
- E2E tests must avoid production data. Use a dedicated test environment, seeded fixtures, mocked backend, or other deterministic strategy approved by the project.
- Add accessibility checks using the project’s testing tools where available.
- For visual/product UI changes, verify relevant desktop and mobile viewports in a browser. When a project has declared design references, compare spacing, layout, hierarchy, responsive behavior, and visible states against the matching reference.
- Manually exercise each developed user-facing feature when feasible, including happy path, validation failures, loading, empty, error, unauthorized/forbidden, and destructive-action paths.
- Tests should assert user-visible behavior, not implementation trivia.

## Config And Tooling

- Keep TypeScript strict and avoid `any` unless isolated and justified.
- Use linting, formatting, import ordering, import boundaries, and type checks to enforce consistency.
- Keep environment configuration typed and validated.
- Use package choices that are actively maintained, widely adopted, and compatible with the framework.
- Prefer Zustand over Redux for lightweight app state unless the project already has Redux or needs Redux-specific capabilities.
- Prefer TanStack Query over ad hoc fetching for cached server state.
- Prefer Zod for shared runtime validation where it fits.

## Documentation

- Update `frontend-handbook.md` after meaningful frontend changes.
- Document routes, state ownership, data flow, design-system additions, accessibility notes, and integration contracts.
- Update `development-history.md`, `tasks.md`, and `files-directories.md` when changes are meaningful.
- Document new environment variables, browser verification requirements, design-reference gaps, realtime strategies, server/client boundaries, and test strategy changes.
- Keep component docs concise and focused on purpose, props, states, accessibility, and integration cautions.

## Frontend Completion Checklist

Before marking frontend work complete, confirm:

- UI matches product requirements and expected user/admin flows
- responsive layouts work at supported viewport sizes
- loading, empty, error, unauthorized, forbidden, and success states are handled
- forms validate accessibly on client and server
- API types and schemas match backend contracts
- server state, client state, and URL state have clear ownership
- accessibility basics are covered
- telemetry/error reporting is added where useful
- tests cover important behavior and regressions
- docs and handbooks are updated
- browser verification was performed for UI changes, or the final handoff names the blocker and remaining visual risk
