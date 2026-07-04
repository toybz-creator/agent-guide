# React Native Application Ecosystem Reference

## Scope And Selection Policy

This reference covers capabilities most production React Native apps need beyond core React Native and Expo. It is a decision guide, not a mandatory dependency list.

- Retrieved: 2026-07-04
- Prefer project-established libraries when they remain supported and fit requirements.
- For a new dependency, verify current release, React Native/Expo compatibility, New Architecture support, platform coverage, maintenance, license, bundle/native size, privacy behavior, supply-chain risk, and migration cost.
- Use official documentation and installed package types as the API source of truth.

Do not install every item. Select the smallest set that meets explicit product and operational requirements.

## Recommended Decision Order

For each capability:

1. Confirm the product behavior and non-functional requirements.
2. Check whether React Native or the installed Expo SDK already provides it.
3. Check whether the project already has an approved abstraction.
4. Compare maintained options against platform, architecture, privacy, performance, and operations constraints.
5. Prototype the riskiest native behavior.
6. Record the choice and rejected alternatives in `harness/mobile-handbook.md` or a feature decision doc.
7. Add tests, telemetry, upgrade notes, and an exit path.

## Navigation

### Expo Router

Best default for new Expo projects needing file-based Android, iOS, and web routing.

- Docs: https://docs.expo.dev/router/introduction/
- Built on React Navigation
- automatic deep-link route mapping
- typed route support
- layouts, stacks, tabs, modals, dynamic routes, and universal web output

### React Navigation

Use when the project prefers explicit navigator configuration, already uses it, or needs navigation structure not suited to file routing.

- Docs: https://reactnavigation.org/docs/getting-started/
- TypeScript: https://reactnavigation.org/docs/typescript/
- Deep linking: https://reactnavigation.org/docs/deep-linking/
- State persistence: https://reactnavigation.org/docs/state-persistence/
- Testing: https://reactnavigation.org/docs/testing/

Navigation decision criteria:

- route typing and refactor safety
- deep-link and web URL needs
- auth gating
- nested navigation complexity
- restoration/persistence
- native transitions and gestures
- testability
- platform back behavior

Do not run two independent navigation roots without a deliberate integration boundary.

## Server State And Networking

### Base Client

Use `fetch` or an established HTTP client behind a typed project adapter. The adapter should own:

- environment/base URL
- headers and correlation IDs
- authentication and single-flight refresh
- timeout and cancellation
- request/response validation
- normalized errors
- safe retries and idempotency
- privacy-safe telemetry

### TanStack Query

A strong default for cached server state, mutations, invalidation, pagination, retry, and persistence.

- Install/current docs: https://tanstack.com/query/latest/docs/framework/react/installation
- React Native guidance: https://tanstack.com/query/latest/docs/framework/react/react-native
- Important defaults: https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults
- Offline queries/mutations: https://tanstack.com/query/latest/docs/framework/react/guides/network-mode
- Persistence: https://tanstack.com/query/latest/docs/framework/react/plugins/persistQueryClient

React Native integration must connect:

- `onlineManager` to real network reachability
- `focusManager` to `AppState`
- query freshness to product semantics
- persistence to a versioned, account-scoped storage policy

Review defaults. Stale queries, retries, garbage collection, focus refetch, and structural sharing may not match every feature.

Alternatives are valid when the project uses GraphQL clients, generated API clients, Redux Toolkit Query, or domain-specific realtime/offline systems.

## Client State

Use the narrowest state mechanism:

| State type | Typical owner |
| --- | --- |
| Server data | Server-state/query client |
| Route/filter in URL | Navigation/router |
| Form draft and validation | Form library/local reducer |
| Small local component state | `useState` / `useReducer` |
| Shared ephemeral app state | Context or lightweight store |
| Durable device state | Versioned persistence layer |

Common lightweight store options include Zustand and established project choices. Redux Toolkit can be appropriate for complex event/state workflows, existing Redux systems, or when its tooling/contracts are required.

Avoid:

- copying query data into a second global store
- a single store that mixes auth secrets, navigation, server cache, forms, and UI
- broad subscriptions that rerender the app
- persistence without schema migration

## Forms And Runtime Validation

React Hook Form is commonly used for performant form state:

- Docs: https://react-hook-form.com/get-started
- React Native usage is supported through `Controller` and controlled native inputs.

Zod is a common TypeScript-first runtime schema option:

- Docs: https://zod.dev/

Rules:

- Keep domain validation independent from visual fields when possible.
- Validate at the trust boundary and again on the server.
- Map server field/general errors into accessible UI.
- Preserve user input across recoverable failures.
- Handle keyboard, autofill, secure entry, password managers, focus, and submission.
- Avoid validating every keystroke with expensive asynchronous work.
- Test locale-sensitive numbers, dates, phone numbers, names, addresses, and right-to-left input where applicable.

Use an established alternative when the project already has one.

## General Persistence

### AsyncStorage

AsyncStorage is asynchronous, persistent, and unencrypted.

- Current docs at retrieval: https://react-native-async-storage.github.io/
- Usage: https://react-native-async-storage.github.io/3.0/api/usage/

Use it for small non-sensitive settings and compatible cache adapters.

Rules:

- never store secrets
- namespace and account-scope keys
- serialize/parse defensively
- version persisted shapes
- batch operations when appropriate
- handle read/write/corruption errors
- define retention and clearing

The current v3 API includes scoped stores and differs from older default-export examples. Use installed-version docs.

### Secure Storage

For Expo apps, `expo-secure-store` provides Keychain/Keystore-backed small-value storage:

- https://docs.expo.dev/versions/latest/sdk/securestore/

For bare apps, select a maintained Keychain/Keystore wrapper compatible with the project.

Secure storage cautions:

- values can be invalidated after biometric enrollment changes
- backup/restore behavior varies
- access-control settings affect background access and UX
- secure storage is not a database
- local secrecy does not replace server revocation

### SQLite And Local-First Data

Expo SQLite:

- https://docs.expo.dev/versions/latest/sdk/sqlite/

Use a structured database when the app needs relational data, large offline datasets, queries, transactions, or migrations.

Require:

- schema version table
- ordered idempotent migrations
- transaction boundaries
- corruption and low-storage handling
- index/query review
- account isolation
- encryption when threat model requires it
- sync/conflict policy
- backup/restore policy

Do not adopt a local-first database without defining server reconciliation and operational recovery.

## Connectivity

Use a maintained reachability package such as the project's approved NetInfo integration:

- https://github.com/react-native-netinfo/react-native-netinfo

Treat connectivity as a hint. "Connected" does not prove DNS, captive portal, backend, authentication, or request success.

Define:

- offline UI
- stale data display
- queued writes
- retry policy
- conflict handling
- manual retry
- connectivity-change behavior

## Lists And Images

### Lists

Start with core `FlatList`/`SectionList`. Consider a maintained specialized virtualized list only after measuring a problem.

FlashList is a common high-performance option:

- https://shopify.github.io/flash-list/

Check current version and migration guidance because API/performance behavior can change between major versions.

### Images

For Expo, `expo-image` is a common production image component:

- https://docs.expo.dev/versions/latest/sdk/image/

Define:

- source size and transformations
- cache policy and eviction expectations
- placeholder and transition
- authentication for protected images
- error and retry
- memory behavior
- accessibility text
- cleanup of generated/local files

## Gestures, Animation, And Graphics

Common choices:

- React Native Gesture Handler: https://docs.swmansion.com/react-native-gesture-handler/
- React Native Reanimated: https://docs.swmansion.com/react-native-reanimated/
- React Native Screens: https://docs.swmansion.com/react-native-screens/
- Skia for advanced 2D graphics: https://shopify.github.io/react-native-skia/

Use them only when the interaction needs them.

Rules:

- keep versions aligned with Expo/React Native
- configure required Babel/native plugins
- test New Architecture and both platforms
- respect reduced motion
- profile UI and JS threads
- test gesture conflicts and interruption
- avoid making core actions gesture-only
- clean up shared values/listeners/resources as required

## Authentication

For OAuth/OIDC mobile clients:

- Expo AuthSession: https://docs.expo.dev/versions/latest/sdk/auth-session/
- AppAuth project for bare/native integrations: https://github.com/FormidableLabs/react-native-app-auth
- OAuth 2.0 for Native Apps (RFC 8252): https://www.rfc-editor.org/rfc/rfc8252
- PKCE (RFC 7636): https://www.rfc-editor.org/rfc/rfc7636

Requirements:

- system browser/user-agent
- Authorization Code with PKCE
- exact redirect URI registration
- state and nonce validation
- issuer/audience/time validation
- no client secret in the app
- secure token storage
- refresh rotation and revocation
- single-flight refresh
- logout and account-switch cleanup

Vendor auth SDKs must still satisfy these boundaries.

## Notifications

Choices:

- Expo Notifications and Expo Push Service
- direct APNs/FCM
- an approved notification vendor

Expo sources:

- https://docs.expo.dev/versions/latest/sdk/notifications/
- https://docs.expo.dev/push-notifications/push-notifications-setup/
- https://docs.expo.dev/push-notifications/sending-notifications/

Server responsibilities:

- bind tokens to user/device/install with authorization
- rotate and deduplicate tokens
- process receipts
- remove invalid tokens
- enforce preference/consent and quiet-time policy
- avoid sensitive payload content
- version deep-link payloads
- monitor send, delivery proxy, open, and failure signals

Client responsibilities:

- request permission in context
- configure Android channels
- register/update token
- handle foreground/background/terminated paths
- validate destination
- deduplicate actions
- handle revoked permission

## Observability

A complete mobile stack normally needs:

- JavaScript and native crash/error reporting
- source-map and native-symbol upload
- release/build/update tagging
- production performance monitoring
- structured privacy-safe breadcrumbs
- product analytics with consent
- network/request correlation
- feature-flag exposure context

Sentry is one common cross-platform option:

- React Native docs: https://docs.sentry.io/platforms/react-native/
- Expo guide: https://docs.expo.dev/guides/using-sentry/

Expo also provides EAS Observe for startup/render performance and EAS Insights for usage; see `docs/ExpoApplicationServices.md`.

Rules:

- choose providers deliberately; do not initialize several overlapping SDKs by accident
- upload artifacts for every store build and OTA update
- scrub secrets and personal data
- set sampling and retention from cost/privacy requirements
- test a controlled error in a non-production environment
- link alerts to release and incident runbooks

## Product Analytics And Feature Flags

Common analytics providers include PostHog, Amplitude, Firebase Analytics, and other project-approved platforms. Feature flag providers vary.

Selection criteria:

- consent and regional privacy
- anonymous vs authenticated identity
- offline queue and retry behavior
- event schema governance
- data deletion/export
- retention and residency
- session replay sensitivity
- SDK size and startup cost
- cost at expected event volume
- experiment statistics and assignment stability

Never place secrets or raw sensitive data in events. Record the event dictionary and ownership.

## Testing

### Unit And Component

React Native Testing Library:

- Docs: https://callstack.github.io/react-native-testing-library/
- Queries: https://callstack.github.io/react-native-testing-library/docs/api/queries
- User Event: https://callstack.github.io/react-native-testing-library/docs/api/events/user-event

Prefer:

- `getByRole` plus accessible name
- label/display-value queries for inputs
- visible text where semantic
- `userEvent` for supported realistic interactions
- test IDs only when user-facing queries cannot express the contract or E2E requires a stable selector

RNTL does not run a real native runtime. It cannot prove native permissions, notifications, layout, keyboard, gestures, or device APIs.

### Device E2E

Two common options:

- Maestro: https://docs.maestro.dev/
- Detox: https://wix.github.io/Detox/

Decision criteria:

- Android/iOS support
- build integration
- synchronization model
- selector/accessibility support
- native system-dialog handling
- sharding and CI performance
- flake diagnosis
- screenshots/video/artifacts
- team experience

Critical E2E should cover install/launch, auth, primary journey, deep links, offline recovery, permissions, notifications where feasible, logout, and upgrade paths.

### Native Unit/Integration

Native modules and config plugins may require Jest tests for plugin mods plus XCTest/Swift Testing and JUnit/Kotlin tests for native behavior.

## Code Quality And Static Analysis

Typical baseline:

- TypeScript strict mode
- ESLint with project React/React Hooks/React Native rules
- formatter
- dependency and secret scanning
- Expo Doctor or native project health checks
- Android lint
- iOS build warnings/static analyzer as applicable
- API schema generation/validation where used

Do not silence native warnings globally. Fix or document a narrowly scoped exception with owner and removal condition.

## App Stores And Platform Policy

Store requirements change independently of library versions. Review official sources during release work:

- Apple App Review Guidelines: https://developer.apple.com/app-store/review/guidelines/
- Apple privacy: https://developer.apple.com/app-store/app-privacy-details/
- Apple privacy manifests: https://developer.apple.com/documentation/bundleresources/privacy_manifest_files
- Google Play policy center: https://play.google.com/about/developer-content-policy/
- Google Play data safety: https://support.google.com/googleplay/android-developer/answer/10787469
- Android target API requirements: https://developer.android.com/google/play/requirements/target-sdk

For Expo iOS privacy manifests:

- https://docs.expo.dev/guides/apple-privacy/

Keep disclosures synchronized with actual SDK behavior and server-side data use.

## CI And Delivery

Minimum mobile CI for meaningful changes:

- reproducible dependency install
- lint, format, and typecheck
- unit/component/integration tests
- dependency/security checks
- Expo Doctor or native health checks
- Android and iOS builds for native/config changes
- deterministic E2E on release candidates
- source-map/symbol handling
- artifact retention
- version/config evidence

Protect signing and store credentials from untrusted pull requests. Separate preview from production release permissions.

## Capability Checklist

Most production mobile apps should make an explicit decision for:

| Capability | Decision to record |
| --- | --- |
| Navigation | Router/library, links, auth gates, restoration |
| API/data | Client, validation, cache, retry, pagination |
| Offline | Read/write scope, queue, conflict, recovery |
| State | Server/device/form/navigation/UI ownership |
| Storage | General, secure, structured, files, migrations |
| Auth | Protocol, token lifecycle, recovery, logout |
| Forms | State/validation, keyboard, autofill, errors |
| Images/lists | Performance, caching, pagination |
| Permissions | Timing, fallback, disclosures |
| Notifications | Provider, token lifecycle, payload, receipts |
| Observability | Crashes, symbols, performance, release tags |
| Analytics | Consent, schema, retention, deletion, cost |
| Testing | Unit, component, integration, Android/iOS E2E |
| Delivery | Build, signing, beta, stores, OTA, rollback |
| Privacy/security | Data classes, WebViews, links, logs, supply chain |

## Agent Usage

Before adding an ecosystem dependency:

1. Read `mobile/react-native-rules.md`.
2. Inspect the existing stack and project verdicts.
3. Read the dependency's current official installation, platform, Expo, New Architecture, migration, and testing docs.
4. Check React Native Directory where relevant: https://reactnative.directory/
5. Compare at least one credible alternative for high-impact dependencies.
6. State native changes, rebuild requirements, permissions, privacy, bundle size, maintenance, and exit cost.
7. Implement behind a project-owned boundary.
8. Verify on Android and iOS.
9. Document the decision and upgrade path.
