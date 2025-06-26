# Merit Systems iOS Git Activity Widget

An iOS widget that displays GitHub repository activity with Merit Systems branding. Features smooth activity curves that match the web version exactly.

## Widget Screenshots

### Small Widget (2x2)
<img width="282" alt="Screenshot 2025-06-26 at 7 32 11 PM" src="https://github.com/user-attachments/assets/ed61dfc9-81b8-4a84-b3f5-da5afbc5b6e6" />

### Medium Widget (4x2)
<img width="414" alt="Screenshot 2025-06-26 at 7 32 14 PM" src="https://github.com/user-attachments/assets/acd67e29-aa5c-4015-b5b2-7c41bd79eb89" />


### Large Widget (4x4)
<img width="375" alt="Screenshot 2025-06-26 at 7 32 24 PM" src="https://github.com/user-attachments/assets/5744c630-6d0b-4fb7-b964-fddcdbeb230c" />


## Features

- **Three Widget Sizes**: Small (2x2), Medium (4x2), and Large (4x4)
- **Merit Systems Branding**: Consistent cyan color scheme and Merit logo
- **Smooth Activity Curves**: Mathematical decay algorithm matching web version
- **Real-time Data**: Updates every 15 minutes
- **Beautiful Design**: Dark theme with gradient fills and rounded corners

## Widget Sizes

### Small Widget (2x2)
- Merit logo and commit count
- Repository name and owner
- Mini 7-day activity curve
- Stars count and language tag

### Medium Widget (4x2)
- Merit branding with logo
- Repository description
- 14-day activity curve
- Comprehensive stats (commits, stars, language)

### Large Widget (4x4)
- Full Merit Systems branding with LIVE indicator
- Repository description
- Stats grid (commits, stars, forks, recent activity)
- 30-day activity curve
- Last updated timestamp

## Files Structure

```
ios-widget/
├── Sources/
│   ├── MeritGitWidget.swift          # Main widget implementation
│   ├── GitRepoData.swift             # Data models and sample data
│   └── ActivityCurveView.swift       # Smooth curve chart component
├── Preview/
│   └── WidgetPreview.swift           # macOS preview app
└── Documentation/
    ├── README.md                     # This file
    ├── Setup.md                      # iOS setup instructions
    └── API.md                        # GitHub API integration guide
```

## Quick Start

1. **Copy Widget Files**: Add the `Sources/` files to your iOS project
2. **Add Widget Extension**: Create a new Widget Extension target in Xcode
3. **Configure Bundle IDs**: Set up proper bundle identifiers
4. **Add GitHub API**: Implement the network service for real data
5. **Test**: Use the preview app to visualize widgets

## Activity Curve Algorithm

The widget uses the same mathematical model as the web version:

```swift
private func calculateMomentum() -> [Double] {
    var momentum: [Double] = []
    var currentMomentum: Double = 0
    let decayRate: Double = 0.95
    
    for commit in commits {
        currentMomentum += Double(commit.count)
        momentum.append(currentMomentum)
        currentMomentum *= decayRate
    }
    
    return momentum
}
```

## Customization

### Colors
- Primary: Cyan (`Color.cyan`)
- Background: Black (`Color.black`)
- Text: White/Gray
- Accent: Yellow (stars), Red (language), Green (live indicator)

### Branding
- Merit logo: `chevron.left.forwardslash.chevron.right`
- Brand text: "MERIT SYSTEMS"
- Live indicator: Green dot + "LIVE" text

### Data Updates
- Timeline refresh: Every 15 minutes
- Sample data included for testing
- Network service ready for GitHub API integration

## Requirements

- iOS 14.0+
- Xcode 12.0+
- WidgetKit framework
- SwiftUI

## Next Steps

1. See `Setup.md` for detailed iOS project setup
2. See `API.md` for GitHub API integration
3. Use `WidgetPreview.swift` for development and testing

## License

Part of the Merit Systems toolkit.dev project. 
