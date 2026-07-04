# React Native Production Rules

## Purpose

This rule pack covers React Native, Expo, native-module, Android, iOS, and universal mobile work and specializes the core and frontend contracts.

The matching packaged references are:

- [PAG-MOB-001] [MUST] Read relevant sections of `docs/ReactNative.md` for React Native runtime, architecture, components, platform behavior, accessibility, performance, and testing.
- [PAG-MOB-002] [MUST] For Expo work, read relevant sections of `docs/Expo.md` for SDK, Router, development builds, Continuous Native Generation, config plugins, device APIs, and upgrades.
- [PAG-MOB-003] [MUST] For EAS work, read relevant sections of `docs/ExpoApplicationServices.md` for Build, Submit, Update, Workflows, Hosting, Metadata, Insights, and Observe.
- [PAG-MOB-004] [SHOULD] Consult `docs/ReactNativeEcosystem.md` when choosing navigation, data, storage, forms, testing, observability, or delivery tools.

Project-specific mobile decisions have their canonical home in `harness/mobile-handbook.md` and `harness/verdicts.md`.

## Mobile Mission

The mobile mission is a correct, useful, responsive, accessible, secure, network-resilient, resource-efficient, observable, and releasable product.

Production readiness spans lifecycle changes, permissions, interrupted flows, offline periods, device sizes, OS versions, release builds, and store-delivered upgrades.

## Start With Product And Platform Decisions

- [PAG-MOB-005] [MUST] Before consequential implementation, discover from project evidence or ask only when unresolved:
  - supported platforms, device classes, and minimum OS versions
  - installed React Native and Expo versions and native workflow
  - navigation and native-directory ownership contracts
  - development, preview, staging, beta, and production distribution
  - offline, sync, conflict, and stale-data expectations
  - authentication, recovery, session, and device-change behavior
  - sensitive data, retention, deletion, consent, and regulation
  - permission-requiring device capabilities
  - startup, interaction, memory, crash-free, network, battery, and app-size budgets
  - OTA/runtime-version, rollout, rollback, and emergency ownership
  - accessibility, localization, RTL, dynamic type, reduced motion, and screen readers
  - store ownership, signing, privacy disclosure, age rating, review access, and release approval

- [PAG-MOB-018] [MUST] Record durable mobile decisions in the mobile handbook, product docs, constraints, deployment book, and verdicts. If a decision is unknown, state the assumption and risk instead of silently choosing.

## Choose The Native Workflow Deliberately

- [PAG-MOB-019] [SHOULD] Prefer Expo with development builds for new React Native apps unless requirements, existing native ownership, unsupported native dependencies, or project verdicts justify another path.
- [PAG-MOB-020] [MUST] Treat Expo Go as a learning and rapid-prototyping environment, not proof that a production app can build or run correctly.
- [PAG-MOB-021] [MUST] Use `npx expo install` for Expo projects so compatible native package versions are selected.
- [PAG-MOB-022] [MUST] Run `npx expo-doctor` after dependency, SDK, config-plugin, or native integration changes.
- [PAG-MOB-023] [MUST] Treat native-code or native-configuration changes as build changes. Rebuild the development client and all affected release profiles.
- [PAG-MOB-024] [MUST] With Continuous Native Generation, express native configuration through app config and config plugins. Do not hand-edit generated `ios/` or `android/` files.
- [PAG-MOB-025] [MUST] If native directories are source-controlled and manually owned, make native edits explicit, review both platforms, run CocoaPods/Gradle checks as applicable, and document upgrade maintenance.
- [PAG-MOB-026] [MUST] Do not mix generated and manually owned native workflows without a documented ownership boundary.
- [PAG-MOB-027] [MUST] Follow the installed React Native version's supported architecture and current official migration guidance. Do not change architecture mode merely to bypass dependency incompatibility without an explicit, time-bounded migration decision.
- [PAG-MOB-028] [MUST] Verify every native library against the installed React Native/Expo version, New Architecture support, platform support, maintenance health, license, privacy impact, and app-size cost.

## Architecture And Boundaries

- [PAG-MOB-029] [MUST] Organize code by product feature or domain, with shared primitives separated from feature behavior.
- [PAG-MOB-030] [MUST] Keep screens thin. Put domain rules, API contracts, validation, persistence, telemetry, and native capability adapters outside presentation components.
- [PAG-MOB-031] [MUST] Define typed boundaries for navigation params, deep links, API payloads, storage records, native-module results, notifications, analytics events, and environment config.
- [PAG-MOB-032] [MUST] Validate untrusted runtime data even when TypeScript types exist.
- [PAG-MOB-033] [SHOULD] Isolate platform-specific code behind a small interface. Use `.ios`, `.android`, `.native`, and `.web` files only when behavior genuinely differs.
- [PAG-MOB-034] [SHOULD] Prefer capability detection over scattered OS checks when APIs vary by version or device.
- [PAG-MOB-035] [MUST] Keep native-module access behind adapters so it can be mocked, monitored, replaced, and tested.
- [PAG-MOB-036] [MUST] Avoid a global provider tower that rerenders the entire app. Split providers by responsibility and update frequency.
- [PAG-MOB-037] [MUST] Keep expensive initialization lazy unless the app cannot safely render without it.
- [PAG-MOB-038] [MUST] Design migrations for persisted client state. Never assume old installations begin with a clean store.
- [PAG-MOB-039] [MUST] Version local schemas and provide idempotent, observable, recoverable migrations.

## Navigation, Linking, And Entry Paths

- [PAG-MOB-040] [MUST] Define one navigation source of truth and type all routes and parameters.
- [PAG-MOB-041] [MUST] Make authentication and authorization gates explicit. Do not rely on hidden tabs or unreachable buttons as access control.
- [PAG-MOB-042] [MUST] Treat every externally reachable route as an independent app entrypoint.
- [PAG-MOB-043] [MUST] Validate deep-link, universal-link, app-link, notification, widget, share-extension, and OAuth callback inputs before navigation.
- [PAG-MOB-044] [MUST] Test cold-start, warm-start, background-resume, signed-out, expired-session, malformed-link, and unauthorized deep-link behavior.
- [PAG-MOB-045] [MUST] Preserve expected back behavior on Android and expected modal/dismiss behavior on iOS.
- [PAG-MOB-046] [MUST] Avoid navigation side effects during render. Make redirects deterministic and prevent loops.
- [PAG-MOB-047] [MUST] Persist navigation state only when there is a proven product need; clear incompatible or sensitive state on logout and migration.
- [PAG-MOB-048] [MUST] Provide a safe fallback for unknown or retired links.

## UI And Product Experience

- [PAG-MOB-049] [MUST] Use native interaction patterns where platform expectations materially differ, while preserving the product's design system.
- [PAG-MOB-050] [MUST] Build from reusable design tokens and primitives for color, spacing, typography, radius, elevation, motion, and touch targets.
- [PAG-MOB-051] [MUST] Support compact phones, large phones, tablets, split screen, rotation where allowed, display zoom, font scaling, and safe-area insets.
- [PAG-MOB-052] [MUST] Account for notches, status bars, home indicators, Android edge-to-edge layouts, and software navigation bars.
- [PAG-MOB-053] [MUST] Use keyboard-aware layouts. Test focus, dismissal, return-key behavior, autofill, password managers, validation, and bottom-sheet interactions with real keyboards.
- [PAG-MOB-054] [MUST] Keep primary actions reachable with large text and the keyboard visible.
- [PAG-MOB-055] [MUST] Provide explicit loading, refreshing, empty, stale, offline, partial, permission-denied, error, success, and recovery states.
- [PAG-MOB-056] [MUST] Preserve user input across temporary errors and app backgrounding when safe.
- [PAG-MOB-057] [MUST] Use optimistic UI only when rollback and conflict behavior are clear.
- [PAG-MOB-058] [MUST] Give immediate feedback for taps; prevent accidental duplicate submissions.
- [PAG-MOB-059] [MUST] Use haptics sparingly and never as the only feedback channel.
- [PAG-MOB-060] [MUST] Respect reduced-motion settings and avoid essential information that exists only in animation.
- [PAG-MOB-061] [MUST] Do not copy web layouts directly into mobile. Redesign navigation, density, input, and action placement for touch and constrained screens.

## Accessibility

- [PAG-MOB-062] [MUST] Use semantic roles, labels, hints, states, values, headings, and logical focus order.
- [PAG-MOB-063] [SHOULD] Prefer visible text as the accessible name when it is sufficiently descriptive.
- [PAG-MOB-064] [MUST] Every icon-only control must have an accessible name.
- [PAG-MOB-065] [MUST] Ensure touch targets meet the project's platform standards and have adequate spacing.
- [PAG-MOB-066] [MUST] Support screen readers, external keyboards where applicable, switch control, voice control, high contrast, bold text, font scaling, reduced motion, and color-vision differences.
- [PAG-MOB-067] [MUST] Never disable font scaling globally to protect a layout. Fix the layout.
- [PAG-MOB-068] [MUST] Announce important asynchronous status changes without creating noisy repeated announcements.
- [PAG-MOB-069] [MUST] Move focus intentionally after navigation, modal transitions, validation failures, and destructive confirmations.
- [PAG-MOB-070] [MUST] Do not encode state by color, position, gesture, sound, or haptic feedback alone.
- [PAG-MOB-071] [MUST] Test with VoiceOver and TalkBack on representative critical flows; component props alone are not sufficient evidence.
- [PAG-MOB-072] [MUST] Use accessibility-first queries in component tests. Treat test IDs as a final fallback or an E2E contract.

## State, Server Data, Offline, And Sync

- [PAG-MOB-073] [MUST] Separate server state, persisted device state, navigation state, form state, and ephemeral UI state.
- [PAG-MOB-074] [SHOULD] Prefer a server-state library with explicit cache, invalidation, cancellation, retry, and mutation semantics over ad hoc fetch effects.
- [PAG-MOB-075] [MUST] Connect server-state focus and connectivity behavior to React Native `AppState` and network reachability.
- [PAG-MOB-076] [MUST] Set cache freshness from product truth, not a universal default.
- [PAG-MOB-077] [MUST] Cancel obsolete requests and prevent stale responses from overwriting newer state.
- [PAG-MOB-078] [MUST] Retry only operations that are safe to retry. Use bounded backoff with jitter and respect server retry guidance.
- [PAG-MOB-079] [MUST] Give every write an idempotency or deduplication strategy when unreliable networks can repeat it.
- [PAG-MOB-080] [MUST] If offline writes are supported, define queue order, dependency handling, authentication expiry, conflict resolution, partial failure, retry ceilings, user visibility, and dead-letter recovery.
- [PAG-MOB-081] [MUST] Distinguish "offline", "server unavailable", "request timed out", and "permission denied" when the recovery differs.
- [PAG-MOB-082] [MUST] Never claim offline support because cached reads happen to render.
- [PAG-MOB-083] [MUST] Keep pagination cursor-based where data changes frequently, avoid duplicate pages, and restore list position intentionally.
- [PAG-MOB-084] [MUST] Reconcile realtime events with cached state using stable IDs, ordering rules, and deduplication.

## Storage And Sensitive Data

- [PAG-MOB-085] [MUST] Treat AsyncStorage and similar general key-value stores as unencrypted. Do not store passwords, raw access tokens, private keys, payment data, health data, or other high-value secrets there.
- [PAG-MOB-086] [MUST] Store the minimum secret material in Keychain/Keystore-backed secure storage and understand backup, biometric-change, device-transfer, and accessibility semantics.
- [PAG-MOB-087] [MUST] Keep server authorization authoritative; local roles and flags are hints for UX, not trust boundaries.
- [PAG-MOB-088] [MUST] Encrypt sensitive databases or files when the threat model requires it, and manage keys separately from ciphertext.
- [PAG-MOB-089] [MUST] Namespace storage keys, validate decoded values, version schemas, and handle corruption without boot loops.
- [PAG-MOB-090] [MUST] Clear account-scoped caches, files, notifications, and analytics identity on logout or account switch as policy requires.
- [PAG-MOB-091] [MUST] Avoid logging tokens, authorization headers, personal data, precise location, notification payloads, or sensitive storage contents.
- [PAG-MOB-092] [MUST] Implement product-approved retention, export, account deletion, consent, and privacy-choice behavior end to end.
- [PAG-MOB-093] [MUST] Assume files, screenshots, clipboard content, backups, and notification previews can leak data; apply platform protections based on the threat model.

## Authentication And Authorization

- [PAG-MOB-094] [SHOULD] Prefer system browser or platform-approved authentication sessions for OAuth/OIDC. Do not collect third-party credentials in an embedded WebView.
- [PAG-MOB-095] [MUST] Use Authorization Code with PKCE for public mobile clients.
- [PAG-MOB-096] [MUST] Validate callback scheme, state, nonce, issuer, audience, and token timing as required by the protocol.
- [PAG-MOB-097] [MUST] Keep client secrets out of mobile binaries. A value embedded in the app is public even when obfuscated or stored in an environment variable.
- [PAG-MOB-098] [MUST] Define access-token refresh, refresh-token rotation, revocation, logout, session expiry, device loss, and account recovery.
- [PAG-MOB-099] [MUST] Prevent simultaneous refresh storms and ensure failed refresh cannot trap the app in a loop.
- [PAG-MOB-100] [MUST] Require server authorization for every protected operation and object.
- [PAG-MOB-101] [MUST] Use biometrics as a local user-presence gate, not a replacement for server authentication.
- [PAG-MOB-102] [MUST] Test role changes, tenant switches, revoked sessions, disabled accounts, and deep links into protected screens.

## Permissions And Device Capabilities

- [PAG-MOB-103] [MUST] Request a permission only at the moment a user invokes a feature that needs it.
- [PAG-MOB-104] [MUST] Explain the user benefit before the system dialog when context is not already obvious.
- [PAG-MOB-105] [MUST] Handle undetermined, granted, limited, denied, permanently denied, restricted, unavailable, and revoked states.
- [PAG-MOB-106] [MUST] Provide a path to settings when the OS will not show the prompt again.
- [PAG-MOB-107] [MUST] Keep the core product usable when optional permissions are denied.
- [PAG-MOB-108] [MUST] Match app-store privacy disclosures, platform usage descriptions, Android permissions, iOS entitlements, and actual runtime behavior.
- [PAG-MOB-109] [MUST] Minimize background location, Bluetooth scanning, microphone, camera, contacts, photo-library, and tracking scope.
- [PAG-MOB-110] [MUST] Stop sensors, subscriptions, listeners, and background work when no longer needed.
- [PAG-MOB-111] [MUST] Test capability absence and simulator limitations. Verify hardware-dependent flows on real devices.

## Performance And Resource Efficiency

- [PAG-MOB-112] [MUST] Establish budgets for cold start, warm start, time to first render, time to interactive, screen transition, input response, dropped frames, memory, app size, network bytes, and battery-sensitive work.
- [PAG-MOB-113] [MUST] Measure release/profile builds on representative low- and mid-tier devices. Development-mode speed is not production evidence.
- [PAG-MOB-114] [MUST] Keep the JavaScript and UI threads free of long synchronous work. Schedule or move heavy computation deliberately.
- [PAG-MOB-115] [MUST] Avoid unnecessary rerenders, unstable context values, broad subscriptions, and expensive work in render.
- [PAG-MOB-116] [MUST] Virtualize long or unbounded collections. Use stable keys, memoized row boundaries where measured, pagination, and known-layout hints when available.
- [PAG-MOB-117] [MUST] Do not put long datasets in `ScrollView`.
- [PAG-MOB-118] [SHOULD] Optimize images by display size, format, caching policy, decode cost, and memory footprint. Avoid shipping oversized assets.
- [PAG-MOB-119] [SHOULD] Prefer native-thread or UI-thread animation paths for continuous gestures and transitions. Profile complex animation on both platforms.
- [PAG-MOB-120] [MUST] Keep startup dependencies small; defer analytics, noncritical SDKs, and optional data until after the first useful interaction where safe.
- [PAG-MOB-121] [MUST] Remove development logging and debug tooling from production behavior.
- [PAG-MOB-122] [MUST] Clean up timers, subscriptions, observers, listeners, animation work, and native resources.
- [PAG-MOB-123] [MUST] Batch network work where it improves efficiency, but do not create giant payloads or block the first useful screen.
- [PAG-MOB-124] [MUST] Respect low-data, low-power, reduced-motion, and background-execution constraints where the platform exposes them.
- [PAG-MOB-125] [MUST] Use bundle analysis and dependency review before accepting a large SDK for a small feature.

## Reliability And App Lifecycle

- [PAG-MOB-126] [MUST] Model `active`, `inactive`, and `background` transitions where they affect security, timers, data freshness, media, location, or pending work.
- [PAG-MOB-127] [MUST] Assume the OS can terminate the app at any time without a cleanup callback.
- [PAG-MOB-128] [MUST] Persist only the minimum recoverable workflow state before critical transitions.
- [PAG-MOB-129] [MUST] Make boot resilient to corrupted cache, failed migrations, expired auth, unavailable backend, missing update, and interrupted initialization.
- [PAG-MOB-130] [MUST] Never leave the splash screen indefinitely. Put timeouts and fallbacks around startup gates.
- [PAG-MOB-131] [MUST] Revalidate security-sensitive state after returning from background.
- [PAG-MOB-132] [MUST] Handle clock changes, timezone changes, locale changes, connectivity changes, low storage, and interrupted uploads where relevant.
- [PAG-MOB-133] [MUST] Use background tasks only for platform-supported, deferrable work. Do not promise exact execution timing.
- [PAG-MOB-134] [MUST] Make uploads resumable or restartable for large or important data and show progress/recovery.
- [PAG-MOB-135] [MUST] Design push handling for foreground, background, terminated, duplicated, delayed, out-of-order, expired, revoked-token, and permission-denied cases.
- [PAG-MOB-136] [MUST] Process push receipts and remove invalid device tokens on the server.

## Expo And EAS Rules

- [PAG-MOB-137] [MUST] Keep `app.json`, `app.config.*`, config plugins, `eas.json`, environment definitions, runtime versions, and native ownership synchronized.
- [PAG-MOB-138] [MUST] Inspect the public Expo config with `npx expo config --type public`; never put secrets in public app config or `EXPO_PUBLIC_` variables.
- [PAG-MOB-139] [MUST] Use distinct application IDs, display names, icons, schemes, channels, credentials, and backends for development, preview/staging, and production when simultaneous installs or isolation are required.
- [PAG-MOB-140] [MUST] Pin build images and tool versions when reproducibility requires it; record intentional exceptions.
- [PAG-MOB-141] [MUST] Use EAS Build profiles for development, preview/internal distribution, staging/beta, and production.
- [PAG-MOB-142] [MUST] Keep signing credentials in approved secret stores and limit account access. Never commit credentials.
- [PAG-MOB-143] [MUST] Treat EAS Update as a code deployment system. Require compatible runtime versions, staging verification, release notes, monitoring, gradual rollout where risk warrants it, and a tested rollback path.
- [PAG-MOB-144] [MUST] Never ship native-incompatible JavaScript to an existing runtime.
- [PAG-MOB-145] [MUST] Use update code signing when the threat model or release policy requires authenticity beyond transport security.
- [PAG-MOB-146] [SHOULD] Prefer promotion or republishing of the exact staged update over rebuilding different production bits.
- [PAG-MOB-147] [MUST] Use EAS Submit only after store metadata, privacy disclosures, review access, versioning, screenshots, and release notes are ready.
- [PAG-MOB-148] [MUST] Treat preview or beta EAS services as change-prone. Verify current limitations before making them critical dependencies and provide a fallback.

## Security And Supply Chain

- [PAG-MOB-149] [MUST] Threat-model authentication, deep links, WebViews, local storage, clipboard, screenshots, notification content, files, uploads, device APIs, native modules, OTA updates, analytics, and release credentials.
- [PAG-MOB-150] [MUST] Allowlist external URLs and schemes. Do not pass untrusted strings directly to `Linking.openURL`.
- [PAG-MOB-151] [MUST] Avoid rendering untrusted remote HTML. If a WebView is required, constrain origins, navigation, messaging, file access, mixed content, and JavaScript capabilities.
- [PAG-MOB-152] [MUST] Validate files by content, size, type, and destination on the server; client checks are usability controls only.
- [PAG-MOB-153] [MUST] Review native dependencies for abandonment, malicious install scripts, excessive permissions, tracking, binary downloads, transitive risk, and New Architecture compatibility.
- [PAG-MOB-154] [MUST] Keep lockfiles committed and CI installs reproducible.
- [PAG-MOB-155] [MUST] Run dependency, secret, static-analysis, and native platform checks appropriate to the project.
- [PAG-MOB-156] [MUST] Use platform network-security configuration and certificate pinning only when the threat model justifies the operational risk; plan certificate rotation and recovery.
- [PAG-MOB-157] [MUST] Do not invent custom cryptography, token protocols, or update-signing schemes.

## Observability, Analytics, And Support

- [PAG-MOB-158] [MUST] Capture crashes, handled errors, native failures, failed startup stages, API failures, update identity, app version/build, platform, OS, device class, network class, and breadcrumbs without collecting unnecessary personal data.
- [PAG-MOB-159] [MUST] Upload JavaScript source maps and native debug symbols for every release and OTA update.
- [PAG-MOB-160] [MUST] Tag events with release, build, runtime version, update ID/channel, environment, and feature flag state.
- [PAG-MOB-161] [MUST] Measure user-visible performance in production, especially startup and critical screens.
- [PAG-MOB-162] [MUST] Define crash-free user/session targets, startup percentiles, ANR/hang targets, API error budgets, and critical-flow completion metrics.
- [PAG-MOB-163] [MUST] Keep analytics event names, properties, consent, identity, retention, and deletion documented.
- [PAG-MOB-164] [MUST] Do not initialize optional tracking before the required consent decision.
- [PAG-MOB-165] [MUST] Provide in-app support paths with safe diagnostic context, app version, and correlation IDs; never attach secrets by default.
- [PAG-MOB-166] [MUST] Monitor staged releases before increasing rollout and compare metrics to the prior stable release.

## Testing And Verification

Evaluation combines the smallest useful test layer with native-runtime evidence when behavior depends on the native runtime.

- [PAG-MOB-167] [MUST] Unit test domain logic, schemas, migrations, serializers, reducers/stores, conflict resolution, retry policy, date/time behavior, and link parsing.
- [PAG-MOB-168] [MUST] Component test visible states, accessibility semantics, forms, keyboard behavior that can be simulated, and user interactions with React Native Testing Library.
- [PAG-MOB-169] [MUST] Integration test navigation, providers, server-state behavior, auth expiry, persistence, notifications, permissions adapters, and offline transitions with realistic fakes.
- [PAG-MOB-170] [MUST] E2E test critical journeys on Android and iOS using a maintained device-level runner.
- [PAG-MOB-171] [MUST] Native capability tests must run on a simulator/emulator or real device; JavaScript renderers do not implement the native runtime.
- [PAG-MOB-172] [MUST] Test at least one supported low-end or constrained device profile and representative current devices.
- [PAG-MOB-173] [MUST] Verify release builds, not only debug builds.
- [PAG-MOB-174] [MUST] Test fresh install, upgrade from the oldest supported app/schema version, logout/account switch, reinstall behavior, and OTA update/rollback where used.
- [PAG-MOB-175] [MUST] Test weak/offline network, timeout, duplicate response, delayed response, partial response, server error, auth expiry, low storage, permission denial/revocation, background/resume, process death, and malformed deep links.
- [PAG-MOB-176] [MUST] Run VoiceOver and TalkBack checks for critical flows.
- [PAG-MOB-177] [MUST] Run performance traces for startup, lists, navigation, and high-interaction screens when changed.
- [PAG-MOB-178] [MUST] Build Android and iOS in CI or an approved remote build service for meaningful native/config changes.
- [PAG-MOB-179] [MUST] Keep E2E fixtures deterministic and isolated from production data.

Minimum release evidence for a meaningful mobile feature:

| Rule ID | Strength | Area | Evidence |
| --- | --- | --- | --- |
| `PAG-MOB-203` | `MUST` | Correctness | Unit/component/integration tests for business and UI states |
| `PAG-MOB-204` | `MUST` | Native behavior | Android and iOS device or simulator verification |
| `PAG-MOB-205` | `MUST` | Accessibility | Semantic tests plus screen-reader checks on critical paths |
| `PAG-MOB-206` | `MUST` | Resilience | Offline, failure, lifecycle, permission, and retry checks |
| `PAG-MOB-207` | `MUST` | Performance | Release-build measurements against recorded budgets |
| `PAG-MOB-208` | `MUST` | Security/privacy | Data, permission, auth, storage, deep-link, and logging review |
| `PAG-MOB-209` | `MUST` | Delivery | Successful build, install, smoke test, version/update compatibility, rollback notes |
| `PAG-MOB-210` | `MUST` | Operations | Crash/error/performance signals and support path documented |

## Store And Release Readiness

- [PAG-MOB-180] [MUST] Keep semantic app version and platform build numbers monotonically correct for the release process.
- [PAG-MOB-181] [MUST] Review Apple and Google requirements at release time; store policies change independently of framework versions.
- [PAG-MOB-182] [MUST] Keep app name, description, screenshots, privacy policy, support URL, age rating, data-safety/privacy answers, export compliance, review notes, and test credentials accurate.
- [PAG-MOB-183] [MUST] Validate icons, splash assets, adaptive icons, edge-to-edge rendering, permission descriptions, entitlements, URL associations, and notification credentials in signed builds.
- [PAG-MOB-184] [MUST] Use internal distribution and store beta tracks before production.
- [PAG-MOB-185] [MUST] Define phased release, halt criteria, rollback, customer communication, and on-call ownership.
- [PAG-MOB-186] [MUST] Remember that store binaries cannot be instantly recalled. Keep server-side compatibility and feature flags for older supported clients.
- [PAG-MOB-187] [MUST] Maintain an API compatibility window and forced-upgrade policy. Forced upgrades must have a safe, accessible, localized user experience and an emergency bypass plan.

## Documentation

- [PAG-MOB-188] [MUST] After meaningful mobile work, update the affected durable sources:
  - `harness/mobile-handbook.md`
  - feature PRD, FRD, architecture, workflow, runbook, observability, and decisions
  - environment, deployment, CI, incident, and observability books
  - tasks, development history, and file map

- [PAG-MOB-194] [MUST] Keep mobile documentation explicit about:
  - supported platforms and OS versions
  - React Native and Expo versions and native ownership
  - routes, deep links, and external entrypoints
  - state, cache, offline, sync, and storage ownership
  - permissions and privacy
  - build profiles, app IDs, environments, signing, and store tracks
  - runtime/update policy, rollout, rollback, and monitoring
  - test devices, E2E flows, accessibility, and performance budgets
  - native dependencies, config plugins, entitlements, and upgrade cautions

Mobile completion is governed by the selected `PAG-MOB-*` rules and the terminal completion test in `instructions.md`; this rulebook does not maintain a duplicate completion checklist.
