# Expo SDK And Workflow Production Reference

## Scope And Freshness

This is a curated operational reference for Expo framework and SDK work.

- Retrieved: 2026-07-04
- Current Expo SDK at retrieval: 57
- SDK 57 baseline: React Native 0.86, React 19.2.3, React Native Web 0.21, Node.js 22.13.x minimum
- SDK version matrix: https://docs.expo.dev/versions/latest/
- Upgrade guide: https://docs.expo.dev/workflow/upgrading-expo-sdk-walkthrough/
- Documentation root: https://docs.expo.dev/

During the SDK 57 transition documented at retrieval, Expo's explicit SDK 57 project command was:

```bash
npx create-expo-app@latest --template default@sdk-57
```

This command and the version matrix are time-sensitive. Check current official docs before scaffolding. For an existing app, use the installed SDK's documentation and do not upgrade unless the task authorizes it.

## What Expo Is

An Expo app is a React Native app that uses one or more Expo tools or packages. Expo is modular:

- Expo SDK: version-aligned native and JavaScript libraries
- Expo CLI: local development, bundling, installs, export, and native commands
- Expo Router: file-based universal routing
- Expo Modules API: native module and view development
- app config and config plugins: declarative native configuration
- Continuous Native Generation (CNG): generate native projects from config and dependencies
- development builds: custom debug clients containing the project's native runtime
- Expo Go: a fixed native playground for learning and quick experiments
- Expo Application Services: optional hosted build, update, submission, workflow, web-hosting, metadata, insights, and performance services

Expo framework overview: https://docs.expo.dev/workflow/overview/

Expo does not require EAS, and EAS can support non-Expo React Native projects. Keep framework and hosted-service decisions separate.

## Production Default: Development Builds

Expo's current production guidance distinguishes Expo Go from development builds:

- Expo Go has a fixed native runtime and is intended for learning and rapid experimentation.
- A development build includes `expo-dev-client` and the app's actual native modules and configuration.
- Native dependency or config changes require a new development build.
- JavaScript and asset changes normally use the existing compatible development build.

Sources:

- Development builds: https://docs.expo.dev/develop/development-builds/introduction/
- Create a build: https://docs.expo.dev/develop/development-builds/create-a-build/
- Workflow: https://docs.expo.dev/develop/development-builds/development-workflows/

Typical setup:

```bash
npx expo install expo-dev-client
npx expo start --dev-client
```

Create development builds locally with `npx expo run:android` / `npx expo run:ios`, or remotely with EAS Build.

Production rules:

- Do not use Expo Go success as release evidence.
- Rebuild after adding native packages, changing config plugins, entitlements, permissions, native assets, or native environment values.
- Share reproducible development builds with the team.
- Keep development, preview, staging, and production variants distinguishable and isolated.

## Expo CLI

Common commands:

| Command | Purpose |
| --- | --- |
| `npx expo start` | Start Metro and development tooling |
| `npx expo start --dev-client` | Target a development build |
| `npx expo install <package>` | Install an Expo-compatible package version |
| `npx expo install --check` | Check package compatibility |
| `npx expo install --fix` | Align compatible package versions |
| `npx expo-doctor` | Check project configuration and dependency health |
| `npx expo config` | Resolve and inspect app config |
| `npx expo config --type public` | Show configuration embedded and visible at runtime |
| `npx expo prebuild` | Generate native projects |
| `npx expo prebuild --clean` | Regenerate native projects from a clean template |
| `npx expo run:android` | Generate/build/run Android locally |
| `npx expo run:ios` | Generate/build/run iOS locally |
| `npx expo export` | Export production bundles/assets |
| `npx expo export --platform web` | Export web output |
| `npx expo export:embed` | Export a bundle for embedding in a native build |
| `npx expo customize` | Generate customizable native/config templates where supported |

CLI reference: https://docs.expo.dev/more/expo-cli/

Prefer local `npx` commands so the project version controls behavior. Use the repository's package manager.

## App Configuration

Expo app config may be `app.json`, `app.config.js`, or `app.config.ts`. It configures Prebuild, runtime manifests, app identity, icons, splash behavior, schemes, platforms, plugins, updates, and platform settings.

Source: https://docs.expo.dev/workflow/configuration/

Key production fields include:

- `name`, `slug`, `version`
- `scheme`
- `orientation` and supported platform behavior
- `icon`, `splash`, Android adaptive icon
- `ios.bundleIdentifier`, `ios.buildNumber`, entitlements, privacy manifests
- `android.package`, `android.versionCode`, permissions, intent filters
- `plugins`
- `runtimeVersion`
- `updates`
- `extra.eas.projectId`
- web output and bundler settings when web is supported

Rules:

- Keep app identifiers stable after store release.
- Use dynamic config only when environment-aware configuration is needed.
- Validate environment input before returning config.
- Never put secrets in app config.
- Run `npx expo config --type public` to inspect what ships to clients.
- Do not import raw app config into application code; use processed runtime config.
- Keep permission descriptions user-specific and accurate.

App-config schema: https://docs.expo.dev/versions/latest/config/app/

## Environment Variables

Expo CLI inlines statically referenced `process.env.EXPO_PUBLIC_*` variables into client code.

Source: https://docs.expo.dev/guides/environment-variables/

Important consequences:

- `EXPO_PUBLIC_*` values are public.
- Use dot notation such as `process.env.EXPO_PUBLIC_API_URL`.
- Do not place secrets, private keys, admin tokens, or server credentials in client environment variables.
- Validate public config at startup/build time.
- Keep environment-specific app IDs, schemes, backends, and feature flags explicit.
- Use server-side secret storage for privileged work.

EAS environment variables are described separately in `docs/ExpoApplicationServices.md`.

## Continuous Native Generation

CNG generates `ios/` and `android/` projects from the Expo SDK template, app config, dependencies, and config plugins.

Sources:

- CNG: https://docs.expo.dev/workflow/continuous-native-generation/
- Existing React Native apps: https://docs.expo.dev/bare/overview/

Choose and document one model:

| Model | Native directories | Change path |
| --- | --- | --- |
| CNG | Generated, normally ignored | app config, package, config plugin |
| Manually managed native | Committed and reviewed | Xcode/Gradle/native source plus applicable plugins |

Do not manually edit generated native files. `prebuild --clean` deletes and regenerates native directories, so preserve user work and confirm the ownership model first.

## Config Plugins

Config plugins modify native projects during Prebuild. They are the reproducible path for native configuration in CNG projects.

Sources:

- Introduction: https://docs.expo.dev/config-plugins/introduction/
- Create/use plugins: https://docs.expo.dev/config-plugins/plugins/
- Debugging: https://docs.expo.dev/config-plugins/development-and-debugging/

Rules:

- Prefer a maintained library's official plugin.
- Pin and review plugins because they can change Android manifests, Gradle files, Info.plist, entitlements, Pods, and native source.
- Keep local plugins typed, narrow, deterministic, and covered by generated-output or mod tests.
- Use `npx expo config --type prebuild` and debug modifiers where useful.
- Run clean Prebuild in a disposable/clean context to inspect output.
- Do not run destructive clean generation over uncommitted manually owned native changes.
- After plugin changes, rebuild and test both platforms.

## Expo Router

Expo Router is the recommended navigation solution for new Expo projects. It maps files in `app/` to routes and is built on React Navigation.

Sources:

- Introduction: https://docs.expo.dev/router/introduction/
- Core concepts: https://docs.expo.dev/router/basics/core-concepts/
- Navigation: https://docs.expo.dev/develop/app-navigation/
- API reference: https://docs.expo.dev/versions/latest/sdk/router/

Common route conventions:

| Convention | Meaning |
| --- | --- |
| `app/_layout.tsx` | Root or nested layout |
| `app/index.tsx` | Index route |
| `app/settings.tsx` | Static route |
| `app/[id].tsx` | Dynamic route |
| `app/(group)/` | Organizational route group |
| `app/+not-found.tsx` | Unmatched route |
| `app/+html.tsx` | Web document customization |
| `app/*.web.tsx` | Platform-specific route implementation |
| `app/*+api.ts` | Server/API route when supported by output/deployment |

Production rules:

- Type routes and parameters.
- Keep auth gates centralized and server authorization authoritative.
- Treat every deep-linkable route as an entrypoint.
- Test cold/warm links, notifications, OAuth callbacks, unknown routes, and protected routes.
- Do not put reusable components in the route tree if they accidentally become routes.
- Define a stable scheme and verified universal/app links.
- Keep web rendering and API-route runtime constraints explicit when targeting web.

## Expo SDK Module Selection

Install SDK modules with `npx expo install`. Check the installed SDK's API page because availability, platform support, config plugins, permissions, and breaking changes vary.

API index: https://docs.expo.dev/versions/latest/

### Common Foundation Modules

| Need | Expo module | Key cautions |
| --- | --- | --- |
| App/device constants | `expo-constants`, `expo-device`, `expo-application` | Do not treat device IDs as stable identity without policy review. |
| Secure key-value storage | `expo-secure-store` | Small secrets only; understand biometric invalidation and backup behavior. |
| Structured local data | `expo-sqlite` | Version schema, migrate transactionally, handle corruption. |
| Files | `expo-file-system` | Control lifecycle, cleanup, backup, sharing, and sensitive content. |
| Network state | `expo-network` | Reachability does not guarantee backend availability. |
| App lifecycle/intent helpers | React Native core and Expo Router APIs | Test cold and warm starts. |
| Fonts | `expo-font` | Avoid blocking startup indefinitely; test fallback and font scale. |
| Images | `expo-image` | Define cache and memory behavior. |
| Splash | `expo-splash-screen` | Always have timeout/error fallback around startup gates. |
| System UI | `expo-status-bar`, `expo-navigation-bar`, `expo-system-ui` | Verify Android edge-to-edge and contrast. |
| Localization | `expo-localization` | React to locale/timezone changes where needed. |
| Updates | `expo-updates` | Runtime compatibility and rollback are release concerns. |

### User And Device Capabilities

| Need | Expo module | Key cautions |
| --- | --- | --- |
| Camera | `expo-camera` | Ask in context, handle denial/revocation, avoid retaining sensitive captures. |
| Photos/videos selection | `expo-image-picker` | Handle limited library access and platform-specific result fields. |
| Media library | `expo-media-library` | Request only required access and handle limited selection. |
| Location | `expo-location` | Minimize precision/background scope; disclose and stop tracking. |
| Maps | `expo-maps` or approved provider | Platform/API status and billing vary; verify current docs. |
| Notifications | `expo-notifications` | Requires credentials, permission UX, token lifecycle, server receipts. |
| Contacts | `expo-contacts` | High privacy impact; minimize collection and retention. |
| Biometrics | `expo-local-authentication` | User-presence gate only; define fallback and enrollment-change behavior. |
| Browser auth | `expo-auth-session`, `expo-web-browser` | Use PKCE, state/nonce, and validated redirect schemes. |
| Clipboard | `expo-clipboard` | Avoid copying secrets; clipboard can be observed. |
| Sharing | `expo-sharing` | Validate file URI/type and sensitive-data policy. |
| Document selection | `expo-document-picker` | Treat content/type/size as untrusted. |
| Audio/video | Current Expo audio/video packages | APIs evolve; verify current recommended package and lifecycle cleanup. |
| Sensors | Expo sensor modules | Stop subscriptions and respect battery/privacy. |
| Background work | `expo-task-manager` plus capability module | OS scheduling is constrained and nondeterministic. |

### Module Documentation To Read By Feature

- SecureStore: https://docs.expo.dev/versions/latest/sdk/securestore/
- SQLite: https://docs.expo.dev/versions/latest/sdk/sqlite/
- FileSystem: https://docs.expo.dev/versions/latest/sdk/filesystem/
- Image: https://docs.expo.dev/versions/latest/sdk/image/
- ImagePicker: https://docs.expo.dev/versions/latest/sdk/imagepicker/
- Camera: https://docs.expo.dev/versions/latest/sdk/camera/
- Location: https://docs.expo.dev/versions/latest/sdk/location/
- Notifications: https://docs.expo.dev/versions/latest/sdk/notifications/
- AuthSession: https://docs.expo.dev/versions/latest/sdk/auth-session/
- LocalAuthentication: https://docs.expo.dev/versions/latest/sdk/local-authentication/
- TaskManager: https://docs.expo.dev/versions/latest/sdk/task-manager/
- SplashScreen: https://docs.expo.dev/versions/latest/sdk/splash-screen/

## Permissions

Permission behavior differs by platform, OS version, capability, and whether access is limited or permanently denied.

Sources:

- Permissions guide: https://docs.expo.dev/guides/permissions/

Workflow:

1. Detect capability and current permission.
2. Explain the benefit in product context.
3. Request at the moment of use.
4. Handle granted, limited, denied, blocked/restricted, and revoked.
5. Offer settings only when useful.
6. Keep the app usable without optional access.
7. Verify usage descriptions and store disclosures.
8. Test on real supported OS versions.

Permission changes often require a new native build.

## Authentication And Deep Links

Use system browser-based OAuth/OIDC flows with Authorization Code and PKCE. Mobile apps are public clients and cannot safely contain a client secret.

Sources:

- Authentication guide: https://docs.expo.dev/guides/authentication/
- AuthSession: https://docs.expo.dev/versions/latest/sdk/auth-session/
- Linking into apps: https://docs.expo.dev/linking/into-your-app/
- Universal links: https://docs.expo.dev/linking/ios-universal-links/
- Android app links: https://docs.expo.dev/linking/android-app-links/

Validate redirect scheme, state, nonce, issuer, audience, and timing. Test installed-app callbacks separately from Expo Go development URLs.

## Push Notifications

`expo-notifications` provides client notification APIs. Apps may use Expo Push Service or communicate with APNs/FCM directly.

Sources:

- Setup: https://docs.expo.dev/push-notifications/push-notifications-setup/
- Send with Expo Push Service: https://docs.expo.dev/push-notifications/sending-notifications/
- Notification module: https://docs.expo.dev/versions/latest/sdk/notifications/

Production system requirements:

- permission request and settings recovery
- Android notification channels
- APNs and FCM credentials
- project-scoped token registration
- server-side token ownership and rotation
- notification preference and quiet-time policy
- payload versioning and deep-link validation
- foreground/background/terminated handling
- duplicate and out-of-order handling
- tickets and receipt processing
- removal of `DeviceNotRegistered` tokens
- analytics and privacy policy

Push requires native/device verification. Do not rely only on a local simulator path.

## Development And Debugging

Sources:

- Debugging runtime issues: https://docs.expo.dev/debugging/runtime-issues/
- React Native DevTools: https://docs.expo.dev/debugging/tools/
- Dev tools plugins: https://docs.expo.dev/debugging/devtools-plugins/
- Atlas: https://docs.expo.dev/guides/analyzing-bundles/
- Orbit: https://docs.expo.dev/build/orbit/

Useful checks:

```bash
npx expo-doctor
npx expo install --check
npx expo config --type public
npx expo export
```

Use Expo Atlas or the current bundle-analysis tooling to understand bundle composition. Keep debug plugins and verbose logging out of production behavior.

## Testing

Expo apps use normal React Native test layers:

- unit and component tests for JavaScript behavior
- React Native Testing Library for semantic interaction tests
- native device/simulator integration
- device-level E2E for critical workflows
- release-build smoke and performance tests

Expo E2E guidance and EAS Workflows may support Maestro jobs; verify current service status before making an alpha/beta job a release gate.

Sources:

- Unit testing: https://docs.expo.dev/develop/unit-testing/
- E2E overview: https://docs.expo.dev/eas/workflows/examples/e2e-tests/
- EAS Workflows syntax: https://docs.expo.dev/eas/workflows/syntax/

## SDK Upgrade Procedure

Upgrade incrementally:

1. Read release notes for the target SDK.
2. Upgrade the `expo` package to the target range.
3. Run `npx expo install --fix`.
4. Run `npx expo-doctor`.
5. Review native-module and config-plugin compatibility.
6. If using CNG, regenerate native projects according to project policy.
7. If native projects are manually owned, apply the Native Project Upgrade Helper diff.
8. Rebuild development clients and signed preview builds.
9. Test critical Android/iOS paths, permissions, deep links, notifications, storage migrations, and updates.
10. Compare app size, startup, crash, and performance metrics.
11. Document rollout and rollback.

Sources:

- SDK upgrade: https://docs.expo.dev/workflow/upgrading-expo-sdk-walkthrough/
- Native upgrade helper: https://docs.expo.dev/bare/upgrade/
- Changelog: https://expo.dev/changelog

## Project Inspection Checklist

Before editing an Expo app, inspect:

- `package.json` and lockfile
- app config
- `eas.json`
- `.eas/workflows/`
- Expo Router route tree or navigation root
- config plugins
- whether `ios/` and `android/` exist and whether they are tracked
- environment variable definitions
- build variants and app identifiers
- runtime-version and update configuration
- native dependencies and Expo Doctor output
- test and release scripts
- signing/credential ownership documentation

## Official Source Index

- Expo docs: https://docs.expo.dev/
- SDK reference: https://docs.expo.dev/versions/latest/
- Workflow overview: https://docs.expo.dev/workflow/overview/
- Expo Router: https://docs.expo.dev/router/introduction/
- Development builds: https://docs.expo.dev/develop/development-builds/introduction/
- App config: https://docs.expo.dev/workflow/configuration/
- Config plugins: https://docs.expo.dev/config-plugins/introduction/
- CNG: https://docs.expo.dev/workflow/continuous-native-generation/
- Expo Modules API: https://docs.expo.dev/modules/overview/
- Upgrade guide: https://docs.expo.dev/workflow/upgrading-expo-sdk-walkthrough/
- Expo CLI: https://docs.expo.dev/more/expo-cli/
