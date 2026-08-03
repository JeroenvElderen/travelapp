# Explorixa Mobile

Explorixa is a managed Expo travel-discovery application. This document is the source of truth for how this **specific app** is structured, extended, tested, and built.

## Technology baseline

- Expo SDK 57 (`expo ~57.0.9`)
- React Native 0.86 and React 19
- TypeScript 6 in strict mode
- Expo Router with routes in `src/app`
- npm with a committed `package-lock.json`
- EAS development, preview, and production profiles

Before changing Expo APIs or native configuration, read the [versioned Expo SDK 57 documentation](https://docs.expo.dev/versions/v57.0.0/). Do not use unversioned examples without confirming that they apply to SDK 57.

## Current product

The current application is the Explorixa home experience. It contains:

- a parallax travel hero and search affordance;
- category selection;
- a featured destination;
- handpicked destination cards;
- travel collections;
- a custom floating bottom navigation bar.

The content in `src/lib/homeData.ts` is local fixture data. It creates a working UI without requiring backend credentials. Supabase-related dependencies are installed for the planned authenticated backend but are not mounted until that feature is implemented.

## Repository structure

```text
src/
├── app/                         # Expo Router routes only
│   ├── _layout.tsx              # Global app shell and root Stack
│   └── index.tsx                # Thin home route
├── components/
│   ├── home/                    # Composed home feature
│   │   ├── cards/
│   │   ├── hero/
│   │   ├── navigation/
│   │   └── HomeScreen.tsx
│   └── ui/                      # Product-agnostic UI controls
├── lib/
│   ├── homeData.ts              # Typed fixture/data boundary
│   └── theme.ts                 # Colors, spacing, type, radii, shadows
└── types/
    └── travel.ts                # Shared travel domain types

assets/                          # Icons, splash artwork, and images
app.json                         # Expo/native configuration
eas.json                         # EAS build and submit profiles
tsconfig.json                    # Strict TypeScript and aliases
```

## Architecture rules

Use this flow for new work:

```text
route -> feature screen -> feature components
                        -> typed src/lib function -> backend or local data
                        -> shared src/components/ui primitive
```

### Routes

Route files belong in `src/app` and should remain small. A route imports and renders a feature screen; it should not contain reusable UI or data mapping.

```tsx
import { HomeScreen } from '@/components/home/HomeScreen';

export default function IndexRoute() {
  return <HomeScreen />;
}
```

Create route groups such as `src/app/(auth)`, `src/app/admin`, or `src/app/client` only when those product areas are implemented. Do not add empty placeholder route trees.

### Feature components

Keep product-specific components in a feature folder such as `src/components/home`. Split large screens by visual responsibility: header, filters, cards, lists, navigation, and modals. Put only genuinely reusable low-level controls in `src/components/ui`.

### Data access

UI components must not contain Supabase queries or raw API response mapping. Add typed domain modules under `src/lib`, for example `destinationsData.ts`, `profileData.ts`, or `bookingData.ts`. These modules should:

1. define or import explicit TypeScript types;
2. perform the request;
3. map backend rows into UI models;
4. sort/filter at the appropriate boundary;
5. throw errors for the screen to render.

The current app uses local component state. Do not mount a global provider simply because its package is installed. If TanStack Query is adopted later, document the decision and use it consistently.

### Imports

Use aliases instead of directory traversal:

```ts
import { colors, spacing } from '@/lib/theme';
import { Icon } from '@/components/ui/Icon';
import type { Place } from '@/types/travel';
import icon from '@/assets/icon.png';
```

`@/*` maps to `src/*`; `@/assets/*` maps to `assets/*`.

### Styling

Use React Native components and `StyleSheet.create`. Prefer tokens from `src/lib/theme.ts` over literal colors, spacing, radii, or shadows. Preserve safe areas, readable loading/error/empty states, and accessibility labels for icon-only controls.

## Planned backend pattern

When authentication is connected, keep one Supabase client at `src/lib/supabase.ts` and use `react-native-url-polyfill` plus an `expo-secure-store` storage adapter. Persist and refresh sessions, and disable browser URL-session detection because native links will be handled explicitly.

Add providers only when their feature is active:

```text
GestureHandlerRootView
└── AuthProvider
    └── AuthGate
        └── PushNotificationsProvider
            ├── StatusBar
            └── Expo Router Stack
```

Privileged operations belong in Supabase Edge Functions and must be protected by backend authorization and Row Level Security. Never ship a Supabase service-role key in the app.

## Environment variables

Copy `.env.example` to `.env.local` when backend work begins:

```bash
cp .env.example .env.local
```

Only public build-time configuration may use the `EXPO_PUBLIC_` prefix. Do not commit `.env.local`, private API keys, service-role keys, signing credentials, or platform service files.

### Mapbox setup

The Explore tab uses `@rnmapbox/maps` on iOS and Android. It needs two different Mapbox tokens:

| Variable | Token | Purpose |
| --- | --- | --- |
| `EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN` | Public `pk...` token | Loaded by the app at runtime to display the map and styles. Expo embeds this value in the client, so it must not be a secret token. |
| `RNMAPBOX_MAPS_DOWNLOAD_TOKEN` | Secret `sk...` token with `DOWNLOADS:READ` | Used only by native dependency installation/build infrastructure to download Mapbox SDK artifacts. Never prefix it with `EXPO_PUBLIC_`. |

Copy the example and replace both placeholders:

```bash
cp .env.example .env.local
```

If the Mapbox package is not installed, install the Expo-compatible version with:

```bash
npx expo install @rnmapbox/maps
```

Then add `@rnmapbox/maps` to the `plugins` array in `app.json`:

```json
{
  "expo": {
    "plugins": [
      "expo-router",
      "@rnmapbox/maps"
    ]
  }
}
```

The package contains native code and does not run in Expo Go. After installing it and adding the config plugin, create a new development build:

```bash
npx expo prebuild --clean
npx expo run:ios
# or
npx expo run:android
```

For EAS, store `RNMAPBOX_MAPS_DOWNLOAD_TOKEN` as a secret for every build environment that needs it. Keep `EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN` as a public or sensitive EAS environment variable. The Explore map renders an explicit configuration message when the public runtime token is absent, and the web target explains that the interactive native map requires an iOS or Android development build.

## Local development

Install the exact dependency graph:

```bash
npm ci
```

Then use:

```bash
npm start
npm run web
npm run android
npm run ios
npm run typecheck
```

`npm run android` and `npm run ios` currently start Expo for the respective platform. Android requires an Android SDK/emulator or device; iOS requires macOS/Xcode or an EAS build.

## EAS builds

The committed profiles in `eas.json` are:

- `development`: internal development-client build;
- `preview`: internal release-style build;
- `production`: store build with automatic version increment;
- `production` submit profile: store submission.

Typical commands:

```bash
npx eas-cli build --profile development --platform android
npx eas-cli build --profile preview --platform all
npx eas-cli build --profile production --platform all
npx eas-cli submit --profile production --platform android
```

Before a real store build, set unique values in `app.json` for the owner/project ID, iOS bundle identifier, Android package, URL scheme, domains, icons, and platform service files. Changes to native identifiers, plugins, deep links, or notification configuration require a new native build.

## Adding authentication, links, and notifications

Implement these as separate milestones:

1. **Configuration:** validate required public values in a typed config module.
2. **Supabase:** create the single SecureStore-backed client.
3. **Authentication:** add context, provider, route gate, and role-aware index routing.
4. **Deep links:** handle initial and warm links with `expo-linking` and configure matching native and backend redirect rules.
5. **Notifications:** register authenticated physical devices, store Expo push tokens through the backend, and route notification taps.
6. **Security:** add and verify RLS, Storage policies, and Edge Function authorization before release.

Remote push testing requires platform credentials, a development or preview build, and a physical device.

## Definition of done

For every change:

- keep route files thin and feature code colocated;
- use strict types and aliases;
- keep secrets and product identifiers out of source control;
- render loading, failure/retry, and empty states for asynchronous screens;
- run `npm run typecheck`;
- run applicable automated tests once tests exist;
- test changed navigation on at least one supported target;
- update this README when the architecture, build process, or required configuration changes.
