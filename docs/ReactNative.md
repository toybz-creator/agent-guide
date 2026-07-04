# React Native Production Reference

## Scope And Freshness

This is a curated operational reference for agents building React Native applications. It summarizes stable concepts and points to official sources for version-sensitive details; it is not a replacement for the installed package types or official API reference.

- Retrieved: 2026-07-04
- Current stable React Native at retrieval: 0.86
- Current support window at retrieval: 0.84, 0.85, and 0.86
- Current architecture: New Architecture only in React Native 0.82 and later
- Version source: https://reactnative.dev/docs/next/releases
- 0.86 release notes: https://reactnative.dev/blog/2026/06/11/react-native-0.86
- Documentation root: https://reactnative.dev/docs/getting-started

Always inspect the project's installed `react-native` version and use the matching versioned docs. Do not upgrade merely because this file names a newer release.

## Runtime Model

React Native renders platform-native views from React components. Production reasoning must account for:

- the JavaScript runtime and event loop
- the native UI/main thread
- platform modules and views
- Metro bundling and asset resolution
- application lifecycle and OS process management
- the New Architecture: Fabric renderer, TurboModules, JSI, and code generation

The OS can suspend or terminate the app without notice. JavaScript-only tests do not reproduce the full native runtime, permissions, app lifecycle, memory pressure, gestures, layout engine, or platform integrations.

### New Architecture

React Native 0.82 made the New Architecture mandatory. New projects and dependencies must be compatible with it.

Use these sources:

- Overview: https://reactnative.dev/architecture/landing-page
- Rendering pipeline: https://reactnative.dev/architecture/render-pipeline
- Native modules: https://reactnative.dev/docs/turbo-native-modules-introduction
- Native components: https://reactnative.dev/docs/fabric-native-components-introduction
- Codegen: https://reactnative.dev/docs/the-new-architecture/using-codegen

Operational rules:

- Check native dependency compatibility before installation.
- Prefer maintained modules that declare New Architecture support.
- Keep native APIs narrow and typed.
- Test both Android and iOS after changing native modules, generated specifications, Gradle, Pods, or platform configuration.

## Core Components

| Component/API | Primary use | Production cautions |
| --- | --- | --- |
| `View` | Layout and native view grouping | Add semantics when interactive; avoid deep wrapper trees. |
| `Text` | Display and nested text | Test font scaling, truncation, localization, and platform font metrics. |
| `TextInput` | User input | Handle keyboard, autofill, secure entry, validation, composition, focus, and accessibility. |
| `Pressable` | Press interactions and states | Prefer for custom controls; expose role, name, state, hit target, disabled behavior, and feedback. |
| `Image` | Bundled and remote images | Set dimensions, control resize mode, cache intentionally, and avoid oversized sources. |
| `ScrollView` | Small bounded scrollable content | It renders all children; do not use for long or unbounded collections. |
| `FlatList` | Virtualized flat collections | Use stable keys, pagination, empty/loading states, and measured tuning. |
| `SectionList` | Virtualized grouped collections | Keep section/item identities stable and test sticky headers on both platforms. |
| `Modal` | Native modal presentation | Handle back/dismiss, focus, screen-reader containment, keyboard, and safe area. |
| `ActivityIndicator` | Indeterminate progress | Pair with useful status text where users need context. |
| `RefreshControl` | Pull-to-refresh | Prevent duplicate refreshes and preserve visible stale data when appropriate. |
| `KeyboardAvoidingView` | Basic keyboard displacement | Platform behavior differs; verify real layouts and nested scroll surfaces. |
| `SafeAreaView` | Legacy safe-area handling | Prefer the project's maintained safe-area library for complex apps. |

Official component and API index: https://reactnative.dev/docs/components-and-apis

## Layout, Styling, And Platform Adaptation

React Native style objects are JavaScript, not browser CSS. Flexbox defaults and supported properties differ from the web.

Key sources:

- Flexbox: https://reactnative.dev/docs/flexbox
- Style: https://reactnative.dev/docs/style
- Dimensions: https://reactnative.dev/docs/dimensions
- Pixel density: https://reactnative.dev/docs/pixelratio
- Platform-specific code: https://reactnative.dev/docs/platform-specific-code

Production guidance:

- Use flexible layout and design tokens; avoid dimensions derived once at module load.
- Prefer `useWindowDimensions` when a component must react to window changes.
- Account for split screen, foldables, rotation, display zoom, tablets, safe areas, and font scaling.
- Use `Platform.select` or platform files for real behavioral differences, not cosmetic duplication.
- Check Android edge-to-edge behavior and iOS safe-area behavior in signed or release-equivalent builds.
- Avoid absolute positioning for primary layouts unless the design genuinely requires it.

## Interaction, Gestures, Keyboard, And Haptics

Core interaction building blocks include `Pressable`, responder events, `Keyboard`, `BackHandler`, and `Vibration`. Complex gestures and animations commonly use maintained community libraries.

Sources:

- Pressable: https://reactnative.dev/docs/pressable
- Gesture responder system: https://reactnative.dev/docs/gesture-responder-system
- Keyboard: https://reactnative.dev/docs/keyboard
- BackHandler: https://reactnative.dev/docs/backhandler

Rules:

- Give every press immediate visible feedback.
- Prevent duplicate submissions while preserving retry behavior.
- Test gesture competition between scroll, swipe, drawer, sheet, and nested interactive content.
- Handle the Android hardware back button and platform modal rules.
- Test hardware and software keyboards, autofill, password managers, return-key behavior, and input methods that compose characters.
- Never use a gesture as the only way to perform a critical action.

## App Lifecycle And Linking

Use `AppState` for foreground/background awareness and `Linking` for incoming/outgoing URLs.

Sources:

- AppState: https://reactnative.dev/docs/appstate
- Linking: https://reactnative.dev/docs/linking
- PermissionsAndroid: https://reactnative.dev/docs/permissionsandroid

Lifecycle implications:

- Revalidate expiring auth and security-sensitive data when returning active.
- Pause or stop resources that should not run in the background.
- Persist recoverable draft state before an interruption, not only during unmount.
- Treat process death as normal.
- Do not assume background jobs run at exact times.

Linking implications:

- Allowlist outgoing schemes and domains.
- Validate incoming paths and parameters.
- Test cold start, background resume, signed-out users, expired sessions, and unknown links.
- Configure iOS universal links and Android app links when verified domain ownership is required.

## Accessibility

React Native exposes platform accessibility APIs through roles, labels, hints, states, values, focus APIs, and `AccessibilityInfo`.

Sources:

- Accessibility: https://reactnative.dev/docs/accessibility
- AccessibilityInfo: https://reactnative.dev/docs/accessibilityinfo
- Testing overview: https://reactnative.dev/docs/testing-overview

Minimum production checks:

- semantic role and accessible name for controls
- accessible disabled, selected, checked, expanded, busy, and invalid state
- meaningful reading/focus order
- touch-target size and spacing
- text scaling without clipped actions or hidden information
- high contrast and non-color state cues
- reduced-motion handling
- focus movement for modals, navigation, and validation
- VoiceOver and TalkBack on critical workflows

Do not globally disable font scaling to preserve layout. Do not infer accessibility from screenshots.

## Networking And Data

React Native provides global networking APIs such as `fetch`, but production apps normally need an explicit client boundary.

Sources:

- Networking: https://reactnative.dev/docs/network
- Global fetch: https://reactnative.dev/docs/global-fetch

Production client responsibilities:

- base URL and environment validation
- request timeout and cancellation
- authentication and single-flight token refresh
- request/response runtime validation
- structured error normalization
- safe retry and idempotency
- offline/reachability integration
- correlation IDs and privacy-safe telemetry
- cache and invalidation rules

Remember:

- Mobile connections change between Wi-Fi, cellular, captive portals, and offline states.
- A successful transport response can still contain an invalid domain payload.
- Client-side validation and authorization never replace server enforcement.
- Public keys and URLs in the binary are visible; client secrets cannot be protected in an app bundle.

## Persistence

React Native core does not ship a general persistent store. Choose storage by data class:

| Data | Suitable category | Avoid |
| --- | --- | --- |
| Small non-sensitive preferences | General key-value storage | Treating it as encrypted |
| Tokens or small secrets | Keychain/Keystore-backed secure storage | Plain AsyncStorage |
| Query cache | Query persistence adapter with schema/expiry policy | Infinite retention |
| Structured offline data | SQLite/object database with migrations | Large JSON blobs |
| Media/documents | File system with lifecycle and cleanup | Base64 in key-value storage |

Every persisted format needs versioning, validation, corruption handling, migration, account scoping, deletion, and backup policy.

## Performance

React Native targets at least 60 frames per second on common displays; at 60 Hz, a frame has about 16.67 ms. Devices with higher refresh rates have smaller frame budgets.

Sources:

- Performance overview: https://reactnative.dev/docs/performance
- Hermes runtime: https://reactnative.dev/docs/next/hermes
- Optimizing FlatList: https://reactnative.dev/docs/optimizing-flatlist-configuration
- FlatList API: https://reactnative.dev/docs/flatlist
- React Native DevTools: https://reactnative.dev/docs/react-native-devtools

### Measure Correctly

- Profile release/profile builds; development mode adds meaningful overhead.
- Test representative low- and mid-tier devices.
- Measure cold and warm start separately.
- Capture JS thread and UI thread symptoms.
- Record p50/p75/p95 or another project-approved percentile, not a single best run.
- Compare against the previous stable build.

### Common Hotspots

- long synchronous JavaScript work
- broad context/store subscriptions
- rerendering complex list rows
- large unvirtualized lists
- image decode and memory pressure
- animation driven by a blocked JS thread
- excessive logging
- startup initialization of optional SDKs
- repeated parsing or serialization
- listeners, timers, and native resources that are not cleaned up

Do not add memoization blindly. Measure the bottleneck and account for complexity and stale-dependency risk.

## Images, Lists, And Animation

### Lists

- Use `FlatList` or `SectionList` for long data.
- Use stable keys tied to domain identity.
- Keep row components focused.
- Use `getItemLayout` only when layout can be known reliably.
- Tune batching/window props from device measurements.
- Avoid nesting virtualized lists in same-direction plain scroll views.
- Guard `onEndReached` from duplicate pagination.
- Preserve error, empty, initial loading, refresh, and load-more states separately.

### Images

- Request or generate appropriately sized assets.
- Set explicit dimensions or aspect ratio.
- Define placeholder, loading, failure, cache, and retry behavior.
- Avoid base64 for large images.
- Treat remote image URLs as untrusted input and enforce server-side access policy.

### Animation

- Prefer transforms and opacity for frequent animation.
- Keep continuous gesture animation off a congested JS thread when supported by the chosen library.
- Respect reduced motion.
- Test interruption and cancellation.
- Profile memory and frame behavior on both platforms.

## Security Boundaries

React Native security requires both JavaScript and native-platform review.

Inspect:

- local storage and files
- OAuth/deep-link callbacks
- WebViews and bridge messages
- screenshots and app switcher snapshots
- clipboard usage
- network security configuration
- logs and crash attachments
- notification previews and payloads
- native module permissions
- dependency install scripts and binary artifacts
- signing keys and OTA update policy

Core rules:

- Use system browser authentication and Authorization Code with PKCE for OAuth public clients.
- Never ship a client secret in the app.
- Avoid arbitrary remote content in WebViews.
- Do not trust local role flags or hidden UI.
- Keep dependency and native permission scope minimal.
- Plan certificate and key rotation before using pinning or custom signing.

React Native security guidance: https://reactnative.dev/docs/security

## Testing Layers

| Layer | Proves | Does not prove |
| --- | --- | --- |
| Unit | Pure domain, migration, parsing, state, and policy logic | Native integration or layout |
| Component | Rendered states, semantics, and JavaScript interactions | OS behavior or real native modules |
| Integration | Providers, navigation, data/cache, persistence adapters | Complete platform behavior |
| Device E2E | Installed app journeys and native integration | Every business-rule permutation |
| Manual exploratory | Product quality and unexpected interactions | Repeatable regression coverage |
| Performance profiling | Frame/startup/resource behavior for measured scenarios | Correctness by itself |

Official testing overview: https://reactnative.dev/docs/testing-overview

Prefer user-visible assertions and accessibility queries. Native features must be tested in a native runtime. Keep production data out of automated tests.

## Native Build And Upgrade Checklist

For React Native Community CLI projects:

1. Read the target release notes and Upgrade Helper diff.
2. Upgrade one supported step at a time when the gap is large.
3. Update JavaScript dependencies and native project files deliberately.
4. Run CocoaPods installation and Gradle sync/build.
5. Re-run code generation when native specs change.
6. Build and install Android and iOS.
7. Run critical E2E and manual device checks.
8. Compare startup, crash, bundle, and app-size metrics.
9. Document rollback and any dependency compatibility exception.

Sources:

- Upgrade guide: https://reactnative.dev/docs/upgrading
- Upgrade Helper: https://react-native-community.github.io/upgrade-helper/
- Environment setup: https://reactnative.dev/docs/set-up-your-environment

## Agent Decision Checklist

Before implementing React Native work, determine:

- installed React Native, React, Metro, and native toolchain versions
- Expo or Community CLI ownership model
- Android/iOS minimum versions and supported device classes
- New Architecture compatibility
- navigation, state, data, storage, and test contracts
- permissions, sensitive data, and privacy disclosures
- offline/lifecycle behavior
- build, signing, beta, store, OTA, and rollback paths
- release performance and reliability budgets

Then load `mobile/react-native-rules.md`, `frontend/frontend-rules.md`, the matching project handbooks, and any library-specific docs.

## Official Source Index

- Main docs: https://reactnative.dev/docs/getting-started
- Releases: https://reactnative.dev/docs/next/releases
- Components and APIs: https://reactnative.dev/docs/components-and-apis
- Architecture: https://reactnative.dev/architecture/landing-page
- Accessibility: https://reactnative.dev/docs/accessibility
- Performance: https://reactnative.dev/docs/performance
- Security: https://reactnative.dev/docs/security
- Testing: https://reactnative.dev/docs/testing-overview
- Native platform integration: https://reactnative.dev/docs/native-platform
- Metro: https://metrobundler.dev/docs/getting-started/
