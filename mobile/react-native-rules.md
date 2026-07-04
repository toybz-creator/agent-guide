# React Native Production Rules

## Purpose

Use this rule pack for React Native, Expo, native-module, Android, iOS, and universal mobile work. Apply it together with `instructions.md`, `frontend/frontend-rules.md`, and any backend rules required by the feature.

Read the matching packaged references before implementation:

- `docs/ReactNative.md` for React Native runtime, architecture, components, platform behavior, accessibility, performance, and testing.
- `docs/Expo.md` for Expo SDK, Expo Router, development builds, Continuous Native Generation, config plugins, device APIs, and upgrade workflows.
- `docs/ExpoApplicationServices.md` for EAS Build, Submit, Update, Workflows, Hosting, Metadata, Insights, and Observe.
- `docs/ReactNativeEcosystem.md` for common navigation, data, storage, forms, testing, observability, and delivery choices.

Project-specific mobile decisions belong in `harness/mobile-handbook.md` and `harness/verdicts.md`. A project verdict may select a different supported tool, but it may not weaken safety, privacy, accessibility, data integrity, or store compliance.

## Mobile Mission

Build mobile products that are correct, useful, responsive, accessible, secure, resilient to weak devices and unreliable networks, economical with battery and data, observable in production, and releasable through the Apple App Store and Google Play.

Do not judge production readiness from a simulator, Expo Go, or a happy-path screen alone. A production mobile app must behave correctly across app lifecycle changes, permissions, interrupted flows, offline periods, device sizes, OS versions, release builds, and store-delivered upgrades.

## Start With Product And Platform Decisions

Before consequential implementation, discover or ask for:

- supported platforms: Android, iOS, tablets, foldables, web, TV, or desktop
- minimum OS versions and required device classes
- Expo SDK or bare React Native workflow, including the currently installed versions
- Expo Router, React Navigation, or another approved navigation contract
- whether native directories are generated, committed, or owned manually
- development, preview, staging, beta, and production distribution paths
- offline expectations, sync semantics, conflict policy, and maximum stale-data tolerance
- authentication, account recovery, session expiry, and device-change behavior
- sensitive data classes, retention, deletion, analytics consent, and regulatory constraints
- permission-requiring capabilities such as camera, photos, contacts, location, Bluetooth, biometrics, notifications, microphone, health, or background execution
- startup, interaction, memory, crash-free, network, battery, and app-size budgets
- OTA update policy, runtime-version policy, rollout, rollback, and emergency ownership
- accessibility, localization, right-to-left, dynamic type, reduced motion, and screen-reader requirements
- store-account ownership, signing credentials, privacy disclosures, age rating, review credentials, and release approval

Record durable answers in the mobile handbook, product docs, constraints, deployment book, and verdicts. If a decision is unknown, state the assumption and the risk instead of silently choosing.

## Choose The Native Workflow Deliberately

- Prefer Expo with development builds for new React Native apps unless requirements, existing native ownership, unsupported native dependencies, or project verdicts justify another path.
- Treat Expo Go as a learning and rapid-prototyping environment, not proof that a production app can build or run correctly.
- Use `npx expo install` for Expo projects so compatible native package versions are selected.
- Run `npx expo-doctor` after dependency, SDK, config-plugin, or native integration changes.
- Treat native-code or native-configuration changes as build changes. Rebuild the development client and all affected release profiles.
- With Continuous Native Generation, express native configuration through app config and config plugins. Do not hand-edit generated `ios/` or `android/` files.
- If native directories are source-controlled and manually owned, make native edits explicit, review both platforms, run CocoaPods/Gradle checks as applicable, and document upgrade maintenance.
- Do not mix generated and manually owned native workflows without a documented ownership boundary.
- Keep the React Native New Architecture enabled on supported current versions. Do not add a legacy-architecture dependency to avoid fixing compatibility without an explicit, time-bounded migration decision.
- Verify every native library against the installed React Native/Expo version, New Architecture support, platform support, maintenance health, license, privacy impact, and app-size cost.

## Architecture And Boundaries

- Organize code by product feature or domain, with shared primitives separated from feature behavior.
- Keep screens thin. Put domain rules, API contracts, validation, persistence, telemetry, and native capability adapters outside presentation components.
- Define typed boundaries for navigation params, deep links, API payloads, storage records, native-module results, notifications, analytics events, and environment config.
- Validate untrusted runtime data even when TypeScript types exist.
- Isolate platform-specific code behind a small interface. Use `.ios`, `.android`, `.native`, and `.web` files only when behavior genuinely differs.
- Prefer capability detection over scattered OS checks when APIs vary by version or device.
- Keep native-module access behind adapters so it can be mocked, monitored, replaced, and tested.
- Avoid a global provider tower that rerenders the entire app. Split providers by responsibility and update frequency.
- Keep expensive initialization lazy unless the app cannot safely render without it.
- Design migrations for persisted client state. Never assume old installations begin with a clean store.
- Version local schemas and provide idempotent, observable, recoverable migrations.

## Navigation, Linking, And Entry Paths

- Define one navigation source of truth and type all routes and parameters.
- Make authentication and authorization gates explicit. Do not rely on hidden tabs or unreachable buttons as access control.
- Treat every externally reachable route as an independent app entrypoint.
- Validate deep-link, universal-link, app-link, notification, widget, share-extension, and OAuth callback inputs before navigation.
- Test cold-start, warm-start, background-resume, signed-out, expired-session, malformed-link, and unauthorized deep-link behavior.
- Preserve expected back behavior on Android and expected modal/dismiss behavior on iOS.
- Avoid navigation side effects during render. Make redirects deterministic and prevent loops.
- Persist navigation state only when there is a proven product need; clear incompatible or sensitive state on logout and migration.
- Provide a safe fallback for unknown or retired links.

## UI And Product Experience

- Use native interaction patterns where platform expectations materially differ, while preserving the product's design system.
- Build from reusable design tokens and primitives for color, spacing, typography, radius, elevation, motion, and touch targets.
- Support compact phones, large phones, tablets, split screen, rotation where allowed, display zoom, font scaling, and safe-area insets.
- Account for notches, status bars, home indicators, Android edge-to-edge layouts, and software navigation bars.
- Use keyboard-aware layouts. Test focus, dismissal, return-key behavior, autofill, password managers, validation, and bottom-sheet interactions with real keyboards.
- Keep primary actions reachable with large text and the keyboard visible.
- Provide explicit loading, refreshing, empty, stale, offline, partial, permission-denied, error, success, and recovery states.
- Preserve user input across temporary errors and app backgrounding when safe.
- Use optimistic UI only when rollback and conflict behavior are clear.
- Give immediate feedback for taps; prevent accidental duplicate submissions.
- Use haptics sparingly and never as the only feedback channel.
- Respect reduced-motion settings and avoid essential information that exists only in animation.
- Do not copy web layouts directly into mobile. Redesign navigation, density, input, and action placement for touch and constrained screens.

## Accessibility

- Use semantic roles, labels, hints, states, values, headings, and logical focus order.
- Prefer visible text as the accessible name when it is sufficiently descriptive.
- Every icon-only control must have an accessible name.
- Ensure touch targets meet the project's platform standards and have adequate spacing.
- Support screen readers, external keyboards where applicable, switch control, voice control, high contrast, bold text, font scaling, reduced motion, and color-vision differences.
- Never disable font scaling globally to protect a layout. Fix the layout.
- Announce important asynchronous status changes without creating noisy repeated announcements.
- Move focus intentionally after navigation, modal transitions, validation failures, and destructive confirmations.
- Do not encode state by color, position, gesture, sound, or haptic feedback alone.
- Test with VoiceOver and TalkBack on representative critical flows; component props alone are not sufficient evidence.
- Use accessibility-first queries in component tests. Treat test IDs as a final fallback or an E2E contract.

## State, Server Data, Offline, And Sync

- Separate server state, persisted device state, navigation state, form state, and ephemeral UI state.
- Prefer a server-state library with explicit cache, invalidation, cancellation, retry, and mutation semantics over ad hoc fetch effects.
- Connect server-state focus and connectivity behavior to React Native `AppState` and network reachability.
- Set cache freshness from product truth, not a universal default.
- Cancel obsolete requests and prevent stale responses from overwriting newer state.
- Retry only operations that are safe to retry. Use bounded backoff with jitter and respect server retry guidance.
- Give every write an idempotency or deduplication strategy when unreliable networks can repeat it.
- If offline writes are supported, define queue order, dependency handling, authentication expiry, conflict resolution, partial failure, retry ceilings, user visibility, and dead-letter recovery.
- Distinguish "offline", "server unavailable", "request timed out", and "permission denied" when the recovery differs.
- Never claim offline support because cached reads happen to render.
- Keep pagination cursor-based where data changes frequently, avoid duplicate pages, and restore list position intentionally.
- Reconcile realtime events with cached state using stable IDs, ordering rules, and deduplication.

## Storage And Sensitive Data

- Treat AsyncStorage and similar general key-value stores as unencrypted. Do not store passwords, raw access tokens, private keys, payment data, health data, or other high-value secrets there.
- Store the minimum secret material in Keychain/Keystore-backed secure storage and understand backup, biometric-change, device-transfer, and accessibility semantics.
- Keep server authorization authoritative; local roles and flags are hints for UX, not trust boundaries.
- Encrypt sensitive databases or files when the threat model requires it, and manage keys separately from ciphertext.
- Namespace storage keys, validate decoded values, version schemas, and handle corruption without boot loops.
- Clear account-scoped caches, files, notifications, and analytics identity on logout or account switch as policy requires.
- Avoid logging tokens, authorization headers, personal data, precise location, notification payloads, or sensitive storage contents.
- Implement product-approved retention, export, account deletion, consent, and privacy-choice behavior end to end.
- Assume files, screenshots, clipboard content, backups, and notification previews can leak data; apply platform protections based on the threat model.

## Authentication And Authorization

- Prefer system browser or platform-approved authentication sessions for OAuth/OIDC. Do not collect third-party credentials in an embedded WebView.
- Use Authorization Code with PKCE for public mobile clients.
- Validate callback scheme, state, nonce, issuer, audience, and token timing as required by the protocol.
- Keep client secrets out of mobile binaries. A value embedded in the app is public even when obfuscated or stored in an environment variable.
- Define access-token refresh, refresh-token rotation, revocation, logout, session expiry, device loss, and account recovery.
- Prevent simultaneous refresh storms and ensure failed refresh cannot trap the app in a loop.
- Require server authorization for every protected operation and object.
- Use biometrics as a local user-presence gate, not a replacement for server authentication.
- Test role changes, tenant switches, revoked sessions, disabled accounts, and deep links into protected screens.

## Permissions And Device Capabilities

- Request a permission only at the moment a user invokes a feature that needs it.
- Explain the user benefit before the system dialog when context is not already obvious.
- Handle undetermined, granted, limited, denied, permanently denied, restricted, unavailable, and revoked states.
- Provide a path to settings when the OS will not show the prompt again.
- Keep the core product usable when optional permissions are denied.
- Match app-store privacy disclosures, platform usage descriptions, Android permissions, iOS entitlements, and actual runtime behavior.
- Minimize background location, Bluetooth scanning, microphone, camera, contacts, photo-library, and tracking scope.
- Stop sensors, subscriptions, listeners, and background work when no longer needed.
- Test capability absence and simulator limitations. Verify hardware-dependent flows on real devices.

## Performance And Resource Efficiency

- Establish budgets for cold start, warm start, time to first render, time to interactive, screen transition, input response, dropped frames, memory, app size, network bytes, and battery-sensitive work.
- Measure release/profile builds on representative low- and mid-tier devices. Development-mode speed is not production evidence.
- Keep the JavaScript and UI threads free of long synchronous work. Schedule or move heavy computation deliberately.
- Avoid unnecessary rerenders, unstable context values, broad subscriptions, and expensive work in render.
- Virtualize long or unbounded collections. Use stable keys, memoized row boundaries where measured, pagination, and known-layout hints when available.
- Do not put long datasets in `ScrollView`.
- Optimize images by display size, format, caching policy, decode cost, and memory footprint. Avoid shipping oversized assets.
- Prefer native-thread or UI-thread animation paths for continuous gestures and transitions. Profile complex animation on both platforms.
- Keep startup dependencies small; defer analytics, noncritical SDKs, and optional data until after the first useful interaction where safe.
- Remove development logging and debug tooling from production behavior.
- Clean up timers, subscriptions, observers, listeners, animation work, and native resources.
- Batch network work where it improves efficiency, but do not create giant payloads or block the first useful screen.
- Respect low-data, low-power, reduced-motion, and background-execution constraints where the platform exposes them.
- Use bundle analysis and dependency review before accepting a large SDK for a small feature.

## Reliability And App Lifecycle

- Model `active`, `inactive`, and `background` transitions where they affect security, timers, data freshness, media, location, or pending work.
- Assume the OS can terminate the app at any time without a cleanup callback.
- Persist only the minimum recoverable workflow state before critical transitions.
- Make boot resilient to corrupted cache, failed migrations, expired auth, unavailable backend, missing update, and interrupted initialization.
- Never leave the splash screen indefinitely. Put timeouts and fallbacks around startup gates.
- Revalidate security-sensitive state after returning from background.
- Handle clock changes, timezone changes, locale changes, connectivity changes, low storage, and interrupted uploads where relevant.
- Use background tasks only for platform-supported, deferrable work. Do not promise exact execution timing.
- Make uploads resumable or restartable for large or important data and show progress/recovery.
- Design push handling for foreground, background, terminated, duplicated, delayed, out-of-order, expired, revoked-token, and permission-denied cases.
- Process push receipts and remove invalid device tokens on the server.

## Expo And EAS Rules

- Keep `app.json`, `app.config.*`, config plugins, `eas.json`, environment definitions, runtime versions, and native ownership synchronized.
- Inspect the public Expo config with `npx expo config --type public`; never put secrets in public app config or `EXPO_PUBLIC_` variables.
- Use distinct application IDs, display names, icons, schemes, channels, credentials, and backends for development, preview/staging, and production when simultaneous installs or isolation are required.
- Pin build images and tool versions when reproducibility requires it; record intentional exceptions.
- Use EAS Build profiles for development, preview/internal distribution, staging/beta, and production.
- Keep signing credentials in approved secret stores and limit account access. Never commit credentials.
- Treat EAS Update as a code deployment system. Require compatible runtime versions, staging verification, release notes, monitoring, gradual rollout where risk warrants it, and a tested rollback path.
- Never ship native-incompatible JavaScript to an existing runtime.
- Use update code signing when the threat model or release policy requires authenticity beyond transport security.
- Prefer promotion or republishing of the exact staged update over rebuilding different production bits.
- Use EAS Submit only after store metadata, privacy disclosures, review access, versioning, screenshots, and release notes are ready.
- Treat preview or beta EAS services as change-prone. Verify current limitations before making them critical dependencies and provide a fallback.

## Security And Supply Chain

- Threat-model authentication, deep links, WebViews, local storage, clipboard, screenshots, notification content, files, uploads, device APIs, native modules, OTA updates, analytics, and release credentials.
- Allowlist external URLs and schemes. Do not pass untrusted strings directly to `Linking.openURL`.
- Avoid rendering untrusted remote HTML. If a WebView is required, constrain origins, navigation, messaging, file access, mixed content, and JavaScript capabilities.
- Validate files by content, size, type, and destination on the server; client checks are usability controls only.
- Review native dependencies for abandonment, malicious install scripts, excessive permissions, tracking, binary downloads, transitive risk, and New Architecture compatibility.
- Keep lockfiles committed and CI installs reproducible.
- Run dependency, secret, static-analysis, and native platform checks appropriate to the project.
- Use platform network-security configuration and certificate pinning only when the threat model justifies the operational risk; plan certificate rotation and recovery.
- Do not invent custom cryptography, token protocols, or update-signing schemes.

## Observability, Analytics, And Support

- Capture crashes, handled errors, native failures, failed startup stages, API failures, update identity, app version/build, platform, OS, device class, network class, and breadcrumbs without collecting unnecessary personal data.
- Upload JavaScript source maps and native debug symbols for every release and OTA update.
- Tag events with release, build, runtime version, update ID/channel, environment, and feature flag state.
- Measure user-visible performance in production, especially startup and critical screens.
- Define crash-free user/session targets, startup percentiles, ANR/hang targets, API error budgets, and critical-flow completion metrics.
- Keep analytics event names, properties, consent, identity, retention, and deletion documented.
- Do not initialize optional tracking before the required consent decision.
- Provide in-app support paths with safe diagnostic context, app version, and correlation IDs; never attach secrets by default.
- Monitor staged releases before increasing rollout and compare metrics to the prior stable release.

## Testing And Verification

Use the smallest layer that proves the behavior, but do not replace native-device evidence with JavaScript-only tests.

- Unit test domain logic, schemas, migrations, serializers, reducers/stores, conflict resolution, retry policy, date/time behavior, and link parsing.
- Component test visible states, accessibility semantics, forms, keyboard behavior that can be simulated, and user interactions with React Native Testing Library.
- Integration test navigation, providers, server-state behavior, auth expiry, persistence, notifications, permissions adapters, and offline transitions with realistic fakes.
- E2E test critical journeys on Android and iOS using a maintained device-level runner.
- Native capability tests must run on a simulator/emulator or real device; JavaScript renderers do not implement the native runtime.
- Test at least one supported low-end or constrained device profile and representative current devices.
- Verify release builds, not only debug builds.
- Test fresh install, upgrade from the oldest supported app/schema version, logout/account switch, reinstall behavior, and OTA update/rollback where used.
- Test weak/offline network, timeout, duplicate response, delayed response, partial response, server error, auth expiry, low storage, permission denial/revocation, background/resume, process death, and malformed deep links.
- Run VoiceOver and TalkBack checks for critical flows.
- Run performance traces for startup, lists, navigation, and high-interaction screens when changed.
- Build Android and iOS in CI or an approved remote build service for meaningful native/config changes.
- Keep E2E fixtures deterministic and isolated from production data.

Minimum release evidence for a meaningful mobile feature:

| Area | Evidence |
| --- | --- |
| Correctness | Unit/component/integration tests for business and UI states |
| Native behavior | Android and iOS device or simulator verification |
| Accessibility | Semantic tests plus screen-reader checks on critical paths |
| Resilience | Offline, failure, lifecycle, permission, and retry checks |
| Performance | Release-build measurements against recorded budgets |
| Security/privacy | Data, permission, auth, storage, deep-link, and logging review |
| Delivery | Successful build, install, smoke test, version/update compatibility, rollback notes |
| Operations | Crash/error/performance signals and support path documented |

## Store And Release Readiness

- Keep semantic app version and platform build numbers monotonically correct for the release process.
- Review Apple and Google requirements at release time; store policies change independently of framework versions.
- Keep app name, description, screenshots, privacy policy, support URL, age rating, data-safety/privacy answers, export compliance, review notes, and test credentials accurate.
- Validate icons, splash assets, adaptive icons, edge-to-edge rendering, permission descriptions, entitlements, URL associations, and notification credentials in signed builds.
- Use internal distribution and store beta tracks before production.
- Define phased release, halt criteria, rollback, customer communication, and on-call ownership.
- Remember that store binaries cannot be instantly recalled. Keep server-side compatibility and feature flags for older supported clients.
- Maintain an API compatibility window and forced-upgrade policy. Forced upgrades must have a safe, accessible, localized user experience and an emergency bypass plan.

## Documentation

After meaningful mobile work, update:

- `harness/mobile-handbook.md`
- affected feature PRD, FRD, architecture, workflow, runbook, observability, and decision docs
- `harness/environments-cloud-deployments.md`
- `harness/deployment-book.md` and `harness/ci-book.md`
- `harness/incident-response-book.md` and `harness/observability-book.md`
- `harness/tasks.md`, `harness/development-history.md`, and `harness/files-directories.md`

Document:

- supported platforms and OS versions
- Expo/React Native versions and native ownership model
- routes, deep links, and external entrypoints
- state, cache, offline, sync, and storage ownership
- permission and privacy behavior
- build profiles, app IDs, environments, signing ownership, and store tracks
- update runtime/version policy, rollout, rollback, and monitoring
- test devices, E2E flows, accessibility checks, and performance budgets
- native dependencies, config plugins, entitlements, and upgrade cautions

## React Native Completion Checklist

Before marking mobile work complete, confirm:

- product behavior and non-functional requirements are explicit
- Android and iOS differences were reviewed
- Expo/React Native dependency compatibility was checked
- app lifecycle, offline, permissions, deep links, and interrupted flows are handled
- server, device, form, navigation, and UI state have clear ownership
- sensitive data is not stored or logged unsafely
- accessibility works with large text and relevant assistive technology
- performance was checked in a release/profile build on representative hardware
- unit, component, integration, and device-level coverage fit the risk
- build, install, upgrade, and rollback/update behavior were verified where relevant
- crash, error, performance, analytics, and support signals are useful and privacy-aware
- store, privacy, signing, versioning, and release requirements are covered
- mobile and feature documentation is current
- remaining device, platform, store, or rollout risk is named in the final report
