## Expo to iOS App Store

### 1) Publish/host your web app URL
This Expo app wraps your planner site in a WebView.

Set URL in PowerShell before build:

`$env:EXPO_PUBLIC_WEB_APP_URL="https://your-live-web-url"`

Current default in `App.js`:
`https://jay200sx-sketch.github.io/Weddingplannerluxe/`

### 2) Login and initialize EAS
From `mobile-expo/`:

1. `npx eas-cli login`
2. `npx eas-cli init` (creates/links EAS project id)

### 3) Build iOS binary
1. `npm run ios:build`
2. Choose/confirm Apple credentials when prompted.

### 4) Submit to App Store Connect
1. `npm run ios:submit`
2. Complete App Store Connect listing:
   - Screenshots
   - Privacy policy URL
   - App description and keywords
   - Age rating and data usage disclosures

### 5) Final App Store review
Apple review decides approval. Your project is configured for Expo + EAS build/submit workflow, but approval depends on policy compliance and listing quality.
