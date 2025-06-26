# Git Activity Widget

A reusable React widget that visualizes GitHub repository commit activity over time using the existing `ActivityChart` component and GitHub API integration from this toolkit.

## Features

- 📊 **Interactive Commit Activity Graph**: Visualizes repository commit activity with decay-based momentum calculation
- 🔍 **Repository Search**: Users can input any public GitHub repository
- 📈 **Real-time Statistics**: Shows stars, forks, commits, and language information
- 🎨 **Responsive Design**: Adapts to different screen sizes with loading states
- ⚙️ **Configurable**: Supports various display modes and customization options
- 🛡️ **Error Handling**: Graceful error handling with user-friendly messages

## Components

### GitActivityWidget (Production)

The full-featured widget that connects to the GitHub API.

**Props:**
- `defaultRepo?: string` - Default repository to load (format: "owner/repo")
- `showControls?: boolean` - Whether to show input controls (default: true)
- `title?: string` - Custom widget title (default: "Repository Activity")
- `description?: string` - Custom widget description
- `className?: string` - Additional CSS classes

### GitActivityWidgetMock (Development/Demo)

A mock version with sample data for development and demonstration purposes.

**Props:** Same as GitActivityWidget

## Usage

### Basic Usage

```tsx
import { GitActivityWidget } from "@/components/widgets/git-activity-widget";

// Interactive widget with user controls
<GitActivityWidget />

// Pre-configured widget
<GitActivityWidget 
  defaultRepo="vercel/next.js"
  showControls={false}
  title="Next.js Activity"
  description="React framework commit activity"
/>
```

### Dashboard Integration

```tsx
// Compact version for dashboards
<GitActivityWidget 
  defaultRepo="facebook/react"
  showControls={false}
  className="max-w-md"
/>
```

### Mock Version for Development

```tsx
import { GitActivityWidgetMock } from "@/components/widgets/git-activity-widget-mock";

// Use during development or when API is not available
<GitActivityWidgetMock 
  defaultRepo="vercel/next.js"
/>
```

## Setup Requirements

### 1. Environment Variables

Add to your `.env.local`:

```bash
GITHUB_TOKEN=your_github_personal_access_token
```

### 2. API Endpoint

The widget expects an API endpoint at `/api/github/repo-info` that:
- Accepts POST requests with `{ owner: string, name: string }`
- Returns repository data in the expected format
- Uses the existing GitHub toolkit configuration

### 3. Dependencies

The widget relies on existing components in your project:
- `ActivityChart` from `@/toolkits/toolkits/github/components/activity-chart`
- UI components from `@/components/ui/*`
- Icons from `lucide-react` and `@icons-pack/react-simple-icons`

## Architecture

The widget leverages the existing GitHub toolkit architecture:

```
GitActivityWidget
├── UI Layer (React Component)
├── API Layer (/api/github/repo-info)
├── GitHub Toolkit (existing)
│   ├── Server Configuration
│   ├── Octokit Integration
│   └── Data Processing
└── ActivityChart Component (existing)
```

## Data Flow

1. User inputs repository name or widget loads with default
2. Widget calls `/api/github/repo-info` endpoint
3. API uses existing GitHub toolkit to fetch repository data
4. Data is processed into time buckets with decay calculation
5. ActivityChart renders the visualization
6. Repository statistics are displayed alongside the chart

## Customization

### Styling

The widget uses Tailwind CSS classes and can be customized via:
- `className` prop for container styling
- CSS custom properties for chart colors
- Theme-aware color schemes

### Data Processing

The activity calculation uses:
- 96 time buckets distributed across repository lifetime
- Decay rate of 0.95 for momentum calculation
- Commit count aggregation by time period

### Error States

The widget handles various error conditions:
- Invalid repository format
- Repository not found (404)
- API rate limiting (429)
- Network errors
- Unauthorized access

## Examples

See the demo page at `/demo/git-activity-widget` for live examples including:
- Interactive widget with user input
- Pre-configured examples with popular repositories
- Compact dashboard versions
- Usage instructions and code samples

## Integration with Existing Toolkit

This widget seamlessly integrates with the existing GitHub toolkit by:
- Reusing the `ActivityChart` component
- Leveraging existing API configurations
- Following established patterns for tool creation
- Maintaining consistent styling and behavior

The widget essentially provides a standalone interface to the repository analysis functionality that's already built into the toolkit system. 