## Mobile Release Checklist

This project is now configured with Capacitor for native mobile packaging.

### Current setup completed
- Capacitor initialized with app id `com.jaysu.weddingplanner`
- Android platform project created in `android/`
- Scripts added:
  - `npm run cap:sync`
  - `npm run cap:android`
  - `npm run cap:ios`

### iOS build requirement
- iOS App Store builds must be created on macOS with Xcode.
- On a Mac:
  1. Run `npm run cap:sync`
  2. Run `npx cap add ios` (first time only)
  3. Run `npm run cap:ios`
  4. Archive in Xcode and submit to App Store Connect

### Android build requirement
- Android Studio and SDK must be installed.
- Run `npm run cap:android`, then generate signed AAB in Android Studio.

### Store readiness tasks before submission
- Replace default app icons and splash screens
- Add privacy policy URL and support URL
- Confirm all legal text (terms/privacy)
- Test on real devices (small/large phones, tablets)
- Verify offline behavior and data persistence
- Run accessibility pass (font scaling, contrast, focus order)

### Important note
App store approval cannot be guaranteed by code alone. Final approval is decided by Apple/Google review guidelines and your store listing compliance.
