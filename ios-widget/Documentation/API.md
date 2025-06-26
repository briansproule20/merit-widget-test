# GitHub API Integration Guide

Guide to integrating real GitHub data into the Merit Systems Git Activity Widget.

## Overview

The widget currently uses sample data. This guide shows how to connect to the GitHub API to fetch real repository and user activity data.

## GitHub API Endpoints

### Repository Information
```
GET https://api.github.com/repos/{owner}/{repo}
```

### Repository Commits
```
GET https://api.github.com/repos/{owner}/{repo}/commits
```

### User Activity
```
GET https://api.github.com/users/{username}/events
```

## Implementation

### 1. Update GitActivityNetworkService

Replace the placeholder implementation in `GitRepoData.swift`:

```swift
class GitActivityNetworkService {
    static let shared = GitActivityNetworkService()
    private init() {}
    
    private let baseURL = "https://api.github.com"
    
    func fetchRepositoryData(owner: String, repo: String) async throws -> GitRepoData {
        // Fetch repository info
        let repoURL = URL(string: "\(baseURL)/repos/\(owner)/\(repo)")!
        let (repoData, _) = try await URLSession.shared.data(from: repoURL)
        let repoInfo = try JSONDecoder().decode(GitHubRepo.self, from: repoData)
        
        // Fetch commit activity
        let commits = try await fetchCommitActivity(owner: owner, repo: repo)
        
        return GitRepoData(
            name: "\(owner)/\(repo)",
            owner: owner,
            description: repoInfo.description,
            language: repoInfo.language,
            stars: repoInfo.stargazers_count,
            forks: repoInfo.forks_count,
            totalCommits: commits.reduce(0) { $0 + $1.count },
            commits: commits,
            lastUpdated: Date()
        )
    }
    
    private func fetchCommitActivity(owner: String, repo: String) async throws -> [CommitDay] {
        let commitsURL = URL(string: "\(baseURL)/repos/\(owner)/\(repo)/stats/commit_activity")!
        let (data, _) = try await URLSession.shared.data(from: commitsURL)
        let activity = try JSONDecoder().decode([GitHubCommitActivity].self, from: data)
        
        return activity.map { week in
            CommitDay(
                date: Date(timeIntervalSince1970: TimeInterval(week.week)),
                count: week.total
            )
        }
    }
}
```

### 2. Add GitHub API Models

Add these models to `GitRepoData.swift`:

```swift
// MARK: - GitHub API Models
struct GitHubRepo: Codable {
    let name: String
    let full_name: String
    let description: String?
    let language: String?
    let stargazers_count: Int
    let forks_count: Int
    let updated_at: String
}

struct GitHubCommitActivity: Codable {
    let total: Int
    let week: Int
    let days: [Int]
}

struct GitHubEvent: Codable {
    let type: String
    let created_at: String
    let repo: GitHubEventRepo?
}

struct GitHubEventRepo: Codable {
    let name: String
}
```

### 3. Update Timeline Provider

Modify the timeline provider in `MeritGitWidget.swift`:

```swift
struct GitActivityProvider: TimelineProvider {
    typealias Entry = GitActivityEntry
    
    func placeholder(in context: Context) -> GitActivityEntry {
        GitActivityEntry(
            date: Date(),
            repoData: GitRepoData.sampleData
        )
    }
    
    func getSnapshot(in context: Context, completion: @escaping (GitActivityEntry) -> Void) {
        // Use sample data for snapshots
        let entry = GitActivityEntry(
            date: Date(),
            repoData: GitRepoData.sampleData
        )
        completion(entry)
    }
    
    func getTimeline(in context: Context, completion: @escaping (Timeline<GitActivityEntry>) -> Void) {
        Task {
            do {
                // Fetch real data
                let repoData = try await GitActivityNetworkService.shared
                    .fetchRepositoryData(owner: "briansproule20", repo: "merit-widget-test")
                
                let entry = GitActivityEntry(
                    date: Date(),
                    repoData: repoData
                )
                
                // Update every 15 minutes
                let nextUpdate = Calendar.current.date(byAdding: .minute, value: 15, to: Date()) ?? Date()
                let timeline = Timeline(entries: [entry], policy: .after(nextUpdate))
                completion(timeline)
                
            } catch {
                // Fallback to sample data on error
                let entry = GitActivityEntry(
                    date: Date(),
                    repoData: GitRepoData.sampleData
                )
                
                // Retry in 5 minutes on error
                let nextUpdate = Calendar.current.date(byAdding: .minute, value: 5, to: Date()) ?? Date()
                let timeline = Timeline(entries: [entry], policy: .after(nextUpdate))
                completion(timeline)
            }
        }
    }
}
```

## Authentication

### GitHub Personal Access Token

For higher rate limits and private repositories:

1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate new token with `repo` scope
3. Add to your app configuration

```swift
class GitActivityNetworkService {
    private let token = "your_github_token_here" // Store securely!
    
    private var headers: [String: String] {
        var headers = ["Accept": "application/vnd.github.v3+json"]
        if !token.isEmpty {
            headers["Authorization"] = "token \(token)"
        }
        return headers
    }
    
    func fetchRepositoryData(owner: String, repo: String) async throws -> GitRepoData {
        var request = URLRequest(url: URL(string: "\(baseURL)/repos/\(owner)/\(repo)")!)
        headers.forEach { request.setValue($1, forHTTPHeaderField: $0) }
        
        let (data, _) = try await URLSession.shared.data(for: request)
        // ... rest of implementation
    }
}
```

### Secure Token Storage

For production apps, store tokens securely:

```swift
import Security

class KeychainService {
    static func save(token: String) {
        let data = token.data(using: .utf8)!
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: "github_token",
            kSecValueData as String: data
        ]
        
        SecItemDelete(query as CFDictionary)
        SecItemAdd(query as CFDictionary, nil)
    }
    
    static func load() -> String? {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: "github_token",
            kSecReturnData as String: true
        ]
        
        var result: AnyObject?
        let status = SecItemCopyMatching(query as CFDictionary, &result)
        
        guard status == errSecSuccess,
              let data = result as? Data,
              let token = String(data: data, encoding: .utf8) else {
            return nil
        }
        
        return token
    }
}
```

## Widget Configuration

### User-Configurable Repository

Add configuration intent for user customization:

1. Create `ConfigurationIntent.intentdefinition`
2. Add repository parameter
3. Update widget configuration:

```swift
struct GitActivityWidget: Widget {
    let kind: String = "GitActivityWidget"
    
    var body: some WidgetConfiguration {
        IntentConfiguration(
            kind: kind,
            intent: ConfigurationIntent.self,
            provider: GitActivityProvider()
        ) { entry in
            GitActivityWidgetView(entry: entry)
        }
        .configurationDisplayName("Merit Git Activity")
        .description("Track GitHub repository activity")
        .supportedFamilies([.systemSmall, .systemMedium, .systemLarge])
    }
}
```

## Rate Limiting

GitHub API has rate limits:
- **Unauthenticated**: 60 requests/hour
- **Authenticated**: 5,000 requests/hour

### Handle Rate Limits

```swift
func fetchRepositoryData(owner: String, repo: String) async throws -> GitRepoData {
    do {
        // API call
        let (data, response) = try await URLSession.shared.data(for: request)
        
        // Check rate limit headers
        if let httpResponse = response as? HTTPURLResponse {
            let remaining = httpResponse.value(forHTTPHeaderField: "X-RateLimit-Remaining")
            let reset = httpResponse.value(forHTTPHeaderField: "X-RateLimit-Reset")
            
            if httpResponse.statusCode == 403 && remaining == "0" {
                // Rate limited - use cached data or sample data
                throw APIError.rateLimited
            }
        }
        
        // Process successful response
        return try processRepoData(data)
        
    } catch APIError.rateLimited {
        // Return cached data or sample data
        return getCachedData() ?? GitRepoData.sampleData
    }
}
```

## Caching Strategy

Cache data to reduce API calls:

```swift
class DataCache {
    private let cache = NSCache<NSString, CachedRepoData>()
    private let cacheTimeout: TimeInterval = 900 // 15 minutes
    
    func get(key: String) -> GitRepoData? {
        guard let cached = cache.object(forKey: key as NSString),
              Date().timeIntervalSince(cached.timestamp) < cacheTimeout else {
            return nil
        }
        return cached.data
    }
    
    func set(key: String, data: GitRepoData) {
        let cached = CachedRepoData(data: data, timestamp: Date())
        cache.setObject(cached, forKey: key as NSString)
    }
}

private class CachedRepoData: NSObject {
    let data: GitRepoData
    let timestamp: Date
    
    init(data: GitRepoData, timestamp: Date) {
        self.data = data
        self.timestamp = timestamp
    }
}
```

## Testing

### Mock Network Service

For testing and development:

```swift
class MockGitActivityNetworkService: GitActivityNetworkService {
    override func fetchRepositoryData(owner: String, repo: String) async throws -> GitRepoData {
        // Simulate network delay
        try await Task.sleep(nanoseconds: 1_000_000_000)
        
        // Return sample data with variations
        var sampleData = GitRepoData.sampleData
        sampleData.name = "\(owner)/\(repo)"
        sampleData.owner = owner
        return sampleData
    }
}
```

## Error Handling

```swift
enum APIError: Error {
    case rateLimited
    case notFound
    case unauthorized
    case networkError
    case decodingError
}

extension APIError: LocalizedError {
    var errorDescription: String? {
        switch self {
        case .rateLimited:
            return "GitHub API rate limit exceeded"
        case .notFound:
            return "Repository not found"
        case .unauthorized:
            return "GitHub authentication required"
        case .networkError:
            return "Network connection error"
        case .decodingError:
            return "Data parsing error"
        }
    }
}
```

## Production Checklist

- [ ] GitHub token stored securely (Keychain)
- [ ] Rate limiting handled gracefully
- [ ] Caching implemented to reduce API calls
- [ ] Error handling for network failures
- [ ] Fallback to sample/cached data
- [ ] Widget configuration for user customization
- [ ] Privacy policy updated for GitHub data usage
- [ ] App Store review guidelines compliance

## API Documentation

- [GitHub REST API](https://docs.github.com/en/rest)
- [Repository Statistics](https://docs.github.com/en/rest/metrics/statistics)
- [User Events](https://docs.github.com/en/rest/activity/events)
- [Rate Limiting](https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting) 