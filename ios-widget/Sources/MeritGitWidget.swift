import WidgetKit
import SwiftUI

// MARK: - Timeline Provider
struct GitActivityProvider: TimelineProvider {
    typealias Entry = GitActivityEntry
    
    func placeholder(in context: Context) -> GitActivityEntry {
        GitActivityEntry(
            date: Date(),
            repoData: GitRepoData.sampleData
        )
    }
    
    func getSnapshot(in context: Context, completion: @escaping (GitActivityEntry) -> Void) {
        let entry = GitActivityEntry(
            date: Date(),
            repoData: GitRepoData.sampleData
        )
        completion(entry)
    }
    
    func getTimeline(in context: Context, completion: @escaping (Timeline<GitActivityEntry>) -> Void) {
        // In a real implementation, fetch data from your API here
        let entry = GitActivityEntry(
            date: Date(),
            repoData: GitRepoData.sampleData
        )
        
        // Update every 15 minutes
        let nextUpdate = Calendar.current.date(byAdding: .minute, value: 15, to: Date()) ?? Date()
        let timeline = Timeline(entries: [entry], policy: .after(nextUpdate))
        completion(timeline)
    }
}

// MARK: - Timeline Entry
struct GitActivityEntry: TimelineEntry {
    let date: Date
    let repoData: GitRepoData
}

// MARK: - Small Widget (2x2)
struct SmallGitActivityView: View {
    let entry: GitActivityEntry
    
    var body: some View {
        ZStack {
            Color.black
            
            VStack(spacing: 8) {
                // Header with Merit logo colors
                HStack {
                    Image(systemName: "chevron.left.forwardslash.chevron.right")
                        .foregroundColor(.cyan)
                        .font(.system(size: 16, weight: .bold))
                    
                    Spacer()
                    
                    VStack(alignment: .trailing, spacing: 2) {
                        Text("\(entry.repoData.totalCommits)")
                            .font(.system(size: 14, weight: .bold))
                            .foregroundColor(.white)
                        Text("commits")
                            .font(.system(size: 8))
                            .foregroundColor(.gray)
                    }
                }
                
                // Repository name
                VStack(alignment: .leading, spacing: 2) {
                    Text(entry.repoData.name)
                        .font(.system(size: 12, weight: .semibold))
                        .foregroundColor(.white)
                        .lineLimit(1)
                    
                    Text("@\(entry.repoData.owner)")
                        .font(.system(size: 10))
                        .foregroundColor(.cyan)
                        .lineLimit(1)
                }
                
                Spacer()
                
                // Mini activity chart
                ActivityCurveView(commits: Array(entry.repoData.commits.suffix(7)))
                    .frame(height: 20)
                
                // Stats row
                HStack {
                    Label("\(entry.repoData.stars)", systemImage: "star.fill")
                        .font(.system(size: 8))
                        .foregroundColor(.yellow)
                    
                    Spacer()
                    
                    if let language = entry.repoData.language {
                        Text(language)
                            .font(.system(size: 8, weight: .medium))
                            .padding(.horizontal, 4)
                            .padding(.vertical, 2)
                            .background(Color.red.opacity(0.2))
                            .foregroundColor(.red)
                            .cornerRadius(4)
                    }
                }
            }
            .padding(12)
        }
        .containerBackground(for: .widget) {
            Color.black
        }
    }
}

// MARK: - Medium Widget (4x2)
struct MediumGitActivityView: View {
    let entry: GitActivityEntry
    
    var body: some View {
        ZStack {
            Color.black
            
            HStack(spacing: 16) {
                // Left side - Merit branding and info
                VStack(alignment: .leading, spacing: 8) {
                    // Merit logo and brand
                    HStack {
                        Image(systemName: "chevron.left.forwardslash.chevron.right")
                            .foregroundColor(.cyan)
                            .font(.system(size: 18, weight: .bold))
                        
                        Text("MERIT")
                            .font(.system(size: 12, weight: .bold))
                            .foregroundColor(.white)
                        
                        Spacer()
                    }
                    
                    // Repository name
                    Text(entry.repoData.name)
                        .font(.system(size: 16, weight: .bold))
                        .foregroundColor(.white)
                        .lineLimit(1)
                    
                    if let description = entry.repoData.description {
                        Text(description)
                            .font(.system(size: 10))
                            .foregroundColor(.gray)
                            .lineLimit(2)
                    }
                    
                    // Stats
                    HStack(spacing: 12) {
                        Label("\(entry.repoData.totalCommits)", systemImage: "arrow.up.circle.fill")
                            .font(.system(size: 9))
                            .foregroundColor(.cyan)
                        
                        Label("\(entry.repoData.stars)", systemImage: "star.fill")
                            .font(.system(size: 9))
                            .foregroundColor(.yellow)
                        
                        if let language = entry.repoData.language {
                            Text(language)
                                .font(.system(size: 8, weight: .medium))
                                .padding(.horizontal, 4)
                                .padding(.vertical, 2)
                                .background(Color.red.opacity(0.2))
                                .foregroundColor(.red)
                                .cornerRadius(4)
                        }
                    }
                    
                    Spacer()
                }
                
                // Right side - Activity chart
                VStack {
                    Text("14-day activity")
                        .font(.system(size: 8))
                        .foregroundColor(.gray)
                    
                    // Activity bars chart
                    ActivityCurveView(commits: Array(entry.repoData.commits.suffix(14)))
                        .frame(height: 45)
                    
                    Spacer()
                }
            }
            .padding(16)
        }
        .containerBackground(for: .widget) {
            Color.black
        }
    }
}

// MARK: - Large Widget (4x4)
struct LargeGitActivityView: View {
    let entry: GitActivityEntry
    
    var body: some View {
        ZStack {
            Color.black
            
            VStack(spacing: 12) {
                // Header with Merit branding and live indicator
                HStack {
                    HStack(spacing: 8) {
                        Image(systemName: "chevron.left.forwardslash.chevron.right")
                            .foregroundColor(.cyan)
                            .font(.system(size: 20, weight: .bold))
                        
                        Text("MERIT SYSTEMS")
                            .font(.system(size: 14, weight: .bold))
                            .foregroundColor(.white)
                    }
                    
                    Spacer()
                    
                    HStack(spacing: 4) {
                        Circle()
                            .fill(Color.green)
                            .frame(width: 6, height: 6)
                        Text("LIVE")
                            .font(.system(size: 8, weight: .bold))
                            .foregroundColor(.green)
                    }
                }
                
                // Repository info
                VStack(alignment: .leading, spacing: 4) {
                    Text(entry.repoData.name)
                        .font(.system(size: 20, weight: .bold))
                        .foregroundColor(.white)
                    
                    Text("@\(entry.repoData.owner)")
                        .font(.system(size: 12))
                        .foregroundColor(.cyan)
                    
                    if let description = entry.repoData.description {
                        Text(description)
                            .font(.system(size: 11))
                            .foregroundColor(.gray)
                            .lineLimit(2)
                    }
                }
                
                // Stats grid
                LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 2), spacing: 8) {
                    StatCard(title: "Total Commits", value: "\(entry.repoData.totalCommits)", icon: "arrow.up.circle.fill", color: .cyan)
                    StatCard(title: "Stars", value: "\(entry.repoData.stars)", icon: "star.fill", color: .yellow)
                    StatCard(title: "Forks", value: "\(entry.repoData.forks)", icon: "tuningfork", color: .green)
                    StatCard(title: "Recent Activity", value: "\(entry.repoData.commits.suffix(7).reduce(0) { $0 + $1.count })", icon: "chart.line.uptrend.xyaxis", color: .orange)
                }
                
                // Activity chart (30 days)
                VStack(alignment: .leading, spacing: 4) {
                    Text("30-day commit activity")
                        .font(.system(size: 10))
                        .foregroundColor(.gray)
                    
                    ActivityCurveView(commits: entry.repoData.commits)
                        .frame(height: 25)
                }
                
                // Last updated
                HStack {
                    Spacer()
                    Text("Updated \(timeAgoString(from: entry.repoData.lastUpdated))")
                        .font(.system(size: 8))
                        .foregroundColor(.gray)
                }
            }
            .padding(16)
        }
        .containerBackground(for: .widget) {
            Color.black
        }
    }
    
    private func timeAgoString(from date: Date) -> String {
        let formatter = RelativeDateTimeFormatter()
        formatter.unitsStyle = .abbreviated
        return formatter.localizedString(for: date, relativeTo: Date())
    }
}

// MARK: - Helper Views
struct StatCard: View {
    let title: String
    let value: String
    let icon: String
    let color: Color
    
    var body: some View {
        VStack(spacing: 4) {
            HStack {
                Image(systemName: icon)
                    .foregroundColor(color)
                    .font(.system(size: 12))
                Spacer()
            }
            
            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    Text(value)
                        .font(.system(size: 14, weight: .bold))
                        .foregroundColor(.white)
                    Text(title)
                        .font(.system(size: 8))
                        .foregroundColor(.gray)
                        .lineLimit(1)
                }
                Spacer()
            }
        }
        .padding(8)
        .background(Color.gray.opacity(0.1))
        .cornerRadius(8)
    }
}

// MARK: - Main Widget
struct GitActivityWidget: Widget {
    let kind: String = "GitActivityWidget"
    
    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: GitActivityProvider()) { entry in
            GitActivityWidgetView(entry: entry)
        }
        .configurationDisplayName("Merit Git Activity")
        .description("Track GitHub repository activity with Merit Systems branding.")
        .supportedFamilies([.systemSmall, .systemMedium, .systemLarge])
    }
}

struct GitActivityWidgetView: View {
    let entry: GitActivityEntry
    @Environment(\.widgetFamily) var family
    
    var body: some View {
        switch family {
        case .systemSmall:
            SmallGitActivityView(entry: entry)
        case .systemMedium:
            MediumGitActivityView(entry: entry)
        case .systemLarge:
            LargeGitActivityView(entry: entry)
        default:
            SmallGitActivityView(entry: entry)
        }
    }
}

// MARK: - Widget Bundle
@main
struct GitActivityWidgetBundle: WidgetBundle {
    var body: some Widget {
        GitActivityWidget()
    }
}

// MARK: - Previews
#Preview(as: .systemSmall) {
    GitActivityWidget()
} timeline: {
    GitActivityEntry(
        date: Date(),
        repoData: GitRepoData.sampleData
    )
}

#Preview(as: .systemMedium) {
    GitActivityWidget()
} timeline: {
    GitActivityEntry(
        date: Date(),
        repoData: GitRepoData.sampleData
    )
}

#Preview(as: .systemLarge) {
    GitActivityWidget()
} timeline: {
    GitActivityEntry(
        date: Date(),
        repoData: GitRepoData.sampleData
    )
} 