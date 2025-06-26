# iOS Widget Setup Guide

Complete guide to setting up the Merit Systems Git Activity Widget in your iOS project.

## Prerequisites

- Xcode 12.0 or later
- iOS 14.0+ deployment target
- Apple Developer Account (for device testing)
- macOS 11.0+ (for development)

## Step 1: Create iOS Project

1. Open Xcode and create a new iOS project
2. Choose "App" template
3. Set your bundle identifier (e.g., `com.yourname.gitactivity`)
4. Enable SwiftUI interface
5. Set minimum deployment target to iOS 14.0

## Step 2: Add Widget Extension

1. In Xcode, go to **File → New → Target**
2. Choose **Widget Extension**
3. Product Name: `GitActivityWidget`
4. Bundle Identifier: `com.yourname.gitactivity.widget` (must be prefixed with main app)
5. Check "Include Configuration Intent" if you want user customization
6. Click **Finish**

## Step 3: Copy Widget Files

1. Delete the default widget files created by Xcode:
   - `GitActivityWidget.swift`
   - `GitActivityWidgetBundle.swift`

2. Add our widget files to the Widget Extension target:
   - Copy `MeritGitWidget.swift` → Widget Extension target
   - Copy `GitRepoData.swift` → Widget Extension target  
   - Copy `ActivityCurveView.swift` → Widget Extension target

3. Ensure files are added to the correct target (Widget Extension, not main app)

## Step 4: Configure Bundle Identifiers

### Main App Bundle ID
```
com.yourname.gitactivity
```

### Widget Extension Bundle ID
```
com.yourname.gitactivity.widget
```

**Important**: Widget bundle ID must be prefixed with the main app's bundle ID.

## Step 5: Configure Info.plist

In your Widget Extension's `Info.plist`, verify:

```xml
<key>CFBundleIdentifier</key>
<string>$(PRODUCT_BUNDLE_IDENTIFIER)</string>
<key>NSExtension</key>
<dict>
    <key>NSExtensionPointIdentifier</key>
    <string>com.apple.widgetkit-extension</string>
</dict>
```

## Step 6: Update Dependencies

Add required frameworks to your Widget Extension target:
- `WidgetKit.framework`
- `SwiftUI.framework`

## Step 7: Configure Signing

### For Simulator Testing (Recommended)
1. Select your Widget Extension target
2. Go to **Signing & Capabilities**
3. Enable **Automatically manage signing**
4. Select your development team

### For Device Testing
1. Ensure you have a valid Apple Developer Account
2. Create App IDs for both main app and widget extension
3. Create development provisioning profiles
4. Configure signing with your profiles

## Step 8: Build and Test

### Simulator Testing (Easiest)
1. Select iPhone simulator (iOS 14.0+)
2. Build and run your main app
3. Long press on home screen → Add Widget
4. Find "Merit Git Activity" widget
5. Add to home screen

### Device Testing
1. Connect iOS device (iOS 14.0+)
2. Build and run on device
3. Trust developer certificate if prompted
4. Add widget to home screen

## Step 9: Preview App (Optional)

For easier development, use the macOS preview app:

1. Create new macOS project
2. Add `WidgetPreview.swift` and all widget source files
3. Run on macOS to see widget designs
4. Iterate on design without iOS simulator

## Troubleshooting

### "No profiles found" Error
- Ensure bundle IDs are correctly configured
- Widget bundle ID must be prefixed with main app ID
- Check Apple Developer Portal for App IDs

### Widget Not Appearing
- Verify iOS 14.0+ deployment target
- Check that WidgetKit is imported
- Ensure widget files are in Widget Extension target

### Build Errors
- Check all imports are correct
- Verify target membership for all files
- Clean build folder (Cmd+Shift+K)

### Signing Issues
- Use simulator for development (no signing required)
- Ensure Apple Developer Account is active
- Check provisioning profiles are valid

## Next Steps

1. **API Integration**: See `API.md` for connecting to GitHub API
2. **Customization**: Modify colors, branding, and data sources
3. **Testing**: Use different widget sizes and configurations
4. **Distribution**: Prepare for App Store submission

## Common Bundle ID Examples

```
Main App: com.company.gittracker
Widget:   com.company.gittracker.widget

Main App: com.yourname.meritgit
Widget:   com.yourname.meritgit.widget

Main App: com.example.githubwidget
Widget:   com.example.githubwidget.widget
```

## File Checklist

- [ ] MeritGitWidget.swift added to Widget Extension
- [ ] GitRepoData.swift added to Widget Extension  
- [ ] ActivityCurveView.swift added to Widget Extension
- [ ] Bundle IDs configured correctly
- [ ] iOS 14.0+ deployment target set
- [ ] WidgetKit framework linked
- [ ] Signing configured (or using simulator)
- [ ] Widget appears in Add Widget screen

## Support

For issues specific to this widget implementation, check:
1. Xcode console for error messages
2. Widget Extension target settings
3. Bundle identifier configuration
4. iOS version compatibility 