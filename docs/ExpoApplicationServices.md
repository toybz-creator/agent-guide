# Expo Application Services Production Reference

## Scope And Freshness

This reference covers Expo Application Services (EAS), Expo's optional hosted services for Expo and React Native projects.

- Retrieved: 2026-07-04
- EAS overview: https://docs.expo.dev/eas/
- EAS CLI reference: https://docs.expo.dev/eas/cli/

Service status at retrieval:

| Service | Purpose | Status called out by official docs |
| --- | --- | --- |
| EAS Build | Cloud Android/iOS builds and signing | Generally available |
| EAS Submit | App-store binary upload/submission | Generally available |
| EAS Update | OTA JavaScript/assets updates | Generally available |
| EAS Workflows | CI/CD jobs for build, test, update, submit, deploy | Verify current availability and job limitations |
| EAS Hosting | Expo Router web, API routes, and server functions | Generally available; partial Node compatibility |
| EAS Metadata | Store listing automation | Beta; Apple support only at retrieval |
| EAS Insights | Usage and reach insights | Preview |
| EAS Observe | Production mobile performance monitoring | Open beta |

Recheck official docs, limits, pricing, regions, retention, and service status before adopting a preview/beta service or making a hosted service a critical dependency.

## EAS Is Optional

- Expo apps can build locally and use other CI, store, hosting, update, and observability providers.
- Existing React Native apps can use EAS services.
- Choose each service independently based on product, security, compliance, cost, reliability, and operational needs.
- Document account ownership, billing, access control, credentials, project transfer, export, and fallback.

## EAS CLI And Project Identity

Prefer a project-pinned invocation in automation where the repository requires reproducibility:

```bash
npx eas-cli@latest --help
npx eas-cli@latest init
```

Teams may intentionally pin a specific CLI version instead of `latest`.

Important project identity:

- Expo account or organization owner
- project slug
- stable EAS project UUID in `extra.eas.projectId`
- Android package name
- iOS bundle identifier
- environment and build-profile names

Do not accidentally create a new EAS project when the app should remain linked to an existing project.

## `eas.json`

`eas.json` configures CLI behavior, build profiles, submit profiles, version management, distribution, channels, environment selection, resources, and platform-specific settings.

Sources:

- Configuration: https://docs.expo.dev/build/eas-json/
- Schema: https://docs.expo.dev/eas/json/

Recommended profile intent:

| Profile | Intended artifact | Typical distribution |
| --- | --- | --- |
| `development` | Debug client with development tooling | Registered team devices/emulators |
| `preview` | Release-like internal test binary | Internal distribution |
| `staging` | Store-equivalent candidate | TestFlight / Play beta track |
| `production` | Signed release binary | App Store / Play production |

Use distinct application IDs and schemes when multiple variants must coexist. Keep backend, credentials, notification setup, update channel, and visible identity aligned with the profile.

## EAS Environments And Secrets

EAS environment variables are available to Build, Update, Workflows, and Hosting.

Source: https://docs.expo.dev/eas/environment-variables/

Visibility categories and exact behavior can evolve; consult current docs and CLI. Stable security rule:

- Anything used in client JavaScript or public app config is public.
- Secret visibility in EAS protects build/workflow access, not values embedded into the final app.
- Server-only secrets must remain in a server runtime.

Operational rules:

- Use separate development, preview, and production environments.
- Grant least-privilege access.
- Rotate service credentials.
- Avoid printing secrets in build logs.
- Document which variables are client-public, build-time-sensitive, or server-only.
- Ensure `eas update` uses the intended environment. Current SDK 55+ guidance requires an explicit environment in common update workflows.

## EAS Build

EAS Build creates Android and iOS app binaries in Expo-hosted infrastructure and can manage signing credentials.

Source: https://docs.expo.dev/build/

Core commands:

```bash
eas build --platform android --profile preview
eas build --platform ios --profile preview
eas build --platform all --profile production
eas build --local --platform android --profile production
eas build:list
eas build:view
```

### Build Inputs

A reproducible build depends on:

- source revision
- lockfile and package-manager version
- Node, Java, Android, Xcode, CocoaPods, and build image
- app config and config plugins
- environment and secrets
- native directories or Prebuild output
- signing credentials
- `eas.json` profile
- dependency caches and custom build steps

### Credentials

EAS may manage Android keystores, iOS distribution certificates, provisioning profiles, and push keys.

Rules:

- Assign credential ownership to an organization, not one person's undocumented account.
- Restrict access and avoid downloads unless operationally required.
- Back up or escrow credentials under company policy.
- Document revocation and rotation.
- Never commit credential files.
- Test transfer and emergency release access before it becomes an incident.

Credential docs: https://docs.expo.dev/app-signing/app-credentials/

### Build Verification

For production candidates:

1. Verify the source revision and profile.
2. Inspect resolved app config.
3. Run static, unit, integration, and security checks.
4. Build both platforms.
5. Install the exact artifacts.
6. Smoke critical flows and native capabilities.
7. Verify app identity, environment, analytics, crash reporting, updates, and deep links.
8. Compare app size and startup/performance budgets.
9. Record artifact IDs, store version/build numbers, and rollback path.

Build success alone is not application success.

## EAS Submit

EAS Submit uploads binaries to Apple App Store Connect and Google Play.

Source: https://docs.expo.dev/deploy/submit-to-app-stores/

Core commands:

```bash
eas submit --platform ios
eas submit --platform android
eas build --platform all --auto-submit
```

Important limitations:

- Store accounts and agreements are still required.
- Store listing, privacy, age rating, review notes, export compliance, pricing, screenshots, and rollout decisions still need ownership.
- Google Play API submission requires a service account and, at retrieval, the first Android upload must be performed manually.
- Submission does not guarantee review approval or production release.

Before submitting:

- verify bundle/package identifiers and monotonically valid build numbers
- verify signing and entitlement state
- finish data-safety and privacy disclosures
- provide working reviewer credentials and instructions when needed
- validate screenshots, descriptions, URLs, age ratings, and release notes
- confirm customer-support and incident readiness

## EAS Update

EAS Update delivers JavaScript, manifest, and asset changes to compatible installed builds through `expo-updates`.

Sources:

- Introduction: https://docs.expo.dev/eas-update/introduction/
- How it works: https://docs.expo.dev/eas-update/how-it-works/
- Deployment: https://docs.expo.dev/eas-update/deployment/

### Compatibility Model

An update is eligible only when platform and runtime version match the build. The runtime version represents the JavaScript-to-native contract.

Native changes require a new binary and compatible runtime version. Examples include:

- adding/upgrading a native module
- changing native configuration or config plugins
- changing permissions, entitlements, or linked native frameworks
- changing native code or generated native interfaces

Do not publish an update merely because the JavaScript bundle compiles.

### Channels And Branches

- A build is associated with a channel.
- A channel points to an update branch.
- Updates are published to branches/channels and filtered by platform/runtime compatibility.
- Keep development, preview, staging, and production isolated.

Typical command:

```bash
eas update --channel staging --message "Fix checkout retry" --environment staging
```

### Safe Deployment

1. Build staging and production from compatible native runtime inputs.
2. Publish to staging.
3. Test the exact update on store-equivalent staging binaries.
4. Monitor crash, error, startup, API, and critical-flow signals.
5. Promote/republish the tested update to production when possible.
6. Use a percentage rollout for risky changes.
7. Halt or roll back when thresholds fail.
8. Record update IDs, commit, runtime version, environment, release notes, and owner.

Current rollout commands include:

```bash
eas update --rollout-percentage 10
eas update:edit
eas update:list
eas update:view
eas update:rollback
```

Verify syntax against the current CLI.

Rollout docs:

- https://docs.expo.dev/eas-update/rollouts/
- https://docs.expo.dev/eas-update/rollbacks/

### Update Security

EAS Update supports end-to-end code signing. The private key signs locally; the build verifies against an embedded certificate.

Source: https://docs.expo.dev/eas-update/code-signing/

If enabled:

- keep the private key out of source and hosted logs
- define signing authority and CI access
- monitor certificate expiry
- rehearse rotation
- define private-key compromise response
- understand that a new embedded certificate normally requires a new binary

### Update Failure Modes

Plan for:

- incorrect channel
- wrong environment
- incompatible runtime version
- startup crash after update
- missing/corrupt assets
- partial rollout
- devices offline for long periods
- old binary/server incompatibility
- rollback to previous or embedded update
- update checks blocked by network or policy

Keep server APIs compatible with supported binary versions.

## EAS Workflows

EAS Workflows defines CI/CD processes as YAML under `.eas/workflows/`.

Sources:

- Get started: https://docs.expo.dev/eas/workflows/get-started/
- Syntax: https://docs.expo.dev/eas/workflows/syntax/
- Examples: https://docs.expo.dev/eas/workflows/examples/introduction/

Supported job categories at retrieval include build, submit, update, deploy, fingerprint, and other workflow/test jobs. Some jobs can be alpha or evolve quickly.

Example shape:

```yaml
name: Preview

on:
  pull_request:

jobs:
  build:
    type: build
    params:
      platform: all
      profile: preview
```

Production workflow rules:

- pin or control tools and environments
- use least-privilege secrets
- separate untrusted pull-request work from credentialed release work
- require tests before deploy jobs
- avoid arbitrary secret-bearing scripts from untrusted branches
- make production promotion explicit
- retain artifact and release evidence
- define concurrency and cancellation behavior
- make retries safe
- connect failures to an owner/runbook

EAS Workflows may complement or replace parts of GitHub Actions or another CI system. Keep one documented source of truth for each gate.

## EAS Hosting

EAS Hosting deploys Expo Router/React Native Web output, including static files, API routes, and server functions.

Source: https://docs.expo.dev/eas/hosting/introduction/

Core flow:

```bash
npx expo export --platform web
eas deploy
```

Output modes:

- `single`: single-page application
- `static`: statically generated routes
- `server`: server functions and API routes

Runtime caveat: EAS Hosting uses a Cloudflare Workers-style V8 isolate runtime with partial Node.js compatibility, not a full Node.js server.

Source: https://docs.expo.dev/eas/hosting/reference/worker-runtime/

Rules:

- verify dependency/runtime compatibility
- keep server secrets out of client bundles
- validate API input and authorization
- define cache headers
- observe crashes, logs, status, region, and latency
- use immutable deployment IDs and aliases for promotion/rollback
- do not adopt Hosting for a mobile-only app without a web/server need

## EAS Metadata

EAS Metadata stores app-store listing configuration in a project file and pushes it through the CLI.

Source: https://docs.expo.dev/eas/metadata/

At retrieval:

- beta and subject to breaking changes
- Apple App Store support; Google Play support not implemented
- does not cover every store field or screenshot workflow

Commands include:

```bash
eas metadata:pull
eas metadata:push
```

Rules:

- review generated/pulled metadata before committing
- pull after dashboard edits to prevent overwrites
- protect reviewer credentials and sensitive notes
- keep localization and release-specific data reviewed
- retain a manual fallback

## EAS Insights

EAS Insights provides app usage and reach information. Some high-level information can come from EAS Update check traffic; the `expo-insights` library provides more precise app usage metrics.

Source: https://docs.expo.dev/eas-insights/app-usage/

At retrieval it is preview. Treat it as one signal, not a complete analytics, product experimentation, crash, or performance platform. Define consent, retention, identity, and data deletion before instrumentation.

## EAS Observe

EAS Observe tracks production startup and rendering performance across real devices.

Sources:

- Introduction: https://docs.expo.dev/eas/observe/introduction/
- Setup: https://docs.expo.dev/eas/observe/get-started/

At retrieval:

- open beta
- Android and iOS
- SDK 55+
- production startup metrics such as cold/warm launch, first render, interactive time, and bundle load
- not a complete crash reporting or custom analytics solution

Instrumentation must mark the app interactive after the actual entry path is ready. Account for onboarding, login, normal home, and deep-link entries rather than instrumenting only one path.

Use release/update identity to compare versions and gate rollouts. Maintain a separate crash/error solution until official capabilities cover the project's needs.

## Cost, Limits, And Vendor Risk

Before relying on EAS:

- estimate monthly builds, build minutes, concurrent jobs, update bandwidth, hosting traffic, active users, retention, and team seats
- inspect current plan limits and overage behavior
- document billing owner and budget alert
- define what happens when quota, outage, account lockout, or billing failure blocks delivery
- retain local-build knowledge for critical releases
- understand artifact, log, metric, and update retention
- document project transfer and offboarding

Current pricing and limits: https://expo.dev/pricing

## Release Runbook Template

1. Confirm source revision, approved change, and release owner.
2. Confirm tests, security checks, and dependency health.
3. Confirm environment, app config, profile, runtime version, and build numbers.
4. Build signed Android/iOS candidates.
5. Install and smoke the exact artifacts.
6. Upload source maps/debug symbols.
7. Submit to beta tracks.
8. Run critical real-device, accessibility, notification, deep-link, auth, and upgrade checks.
9. Compare crash-free, startup, API, and product KPIs.
10. Submit/promote to production under the approved phased-release policy.
11. Monitor, halt, or roll back against explicit thresholds.
12. Record build IDs, update IDs, store versions, outcome, incidents, and follow-ups.

## Official Source Index

- EAS overview: https://docs.expo.dev/eas/
- EAS CLI: https://docs.expo.dev/eas/cli/
- Build: https://docs.expo.dev/build/
- Submit: https://docs.expo.dev/submit/introduction/
- Update: https://docs.expo.dev/eas-update/introduction/
- Workflows: https://docs.expo.dev/eas/workflows/get-started/
- Hosting: https://docs.expo.dev/eas/hosting/introduction/
- Metadata: https://docs.expo.dev/eas/metadata/
- Insights: https://docs.expo.dev/eas-insights/introduction/
- Observe: https://docs.expo.dev/eas/observe/introduction/
- Environments: https://docs.expo.dev/eas/environment-variables/
- App signing: https://docs.expo.dev/app-signing/app-credentials/
- Distribution: https://docs.expo.dev/distribution/introduction/
