# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

CK-Dash is a single-screen React Native (Expo) app for CKPool solo Bitcoin miners. Users enter a BTC address to view real-time mining stats fetched from the CKPool API. The UI is in Chinese.

## Commands

```bash
# Start dev server
npx expo start

# Run on Android/iOS
npx expo start --android
npx expo start --ios

# Build Android APK (preview profile)
eas build --platform android --profile preview
```

No linter, formatter, or test runner is configured.

## Architecture

The entire app lives in [App.tsx](App.tsx) — no routing, no component splitting, no state management library.

- State: `btcAddress`, `confirmedAddress`, `data`, `loading` via `useState`
- Persistence: BTC address saved/loaded with `AsyncStorage` (key: `savedBtcAddress`)
- Data fetching: `fetch()` against `https://solo.ckpool.org/users/{address}`, polled every 10s via `setInterval`
- Change detection: `dataRef` + `JSON.stringify` comparison to skip unnecessary re-renders
- UI: shows address input form when no confirmed address, otherwise shows stats cards (hashrate 1m/5m/1h, last share, worker name, timestamps)

Entry point is [index.ts](index.ts), which registers the root component via Expo.
