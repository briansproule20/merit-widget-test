import Foundation

// MARK: - Data Models
struct GitRepoData {
    let name: String
    let owner: String
    let description: String?
    let language: String?
    let stars: Int
    let forks: Int
    let totalCommits: Int
    let commits: [CommitDay]
    let lastUpdated: Date
}

struct CommitDay {
    let date: Date
    let count: Int
}

// MARK: - Sample Data
extension GitRepoData {
    static let sampleData = GitRepoData(
        name: "briansproule20/merit-widget-test",
        owner: "briansproule20",
        description: "iOS widget for Merit Systems GitHub activity tracking",
        language: "Swift",
        stars: 15,
        forks: 8,
        totalCommits: 83,
        commits: generateSampleCommits(),
        lastUpdated: Date()
    )
    
    private static func generateSampleCommits() -> [CommitDay] {
        let calendar = Calendar.current
        let today = Date()
        var commits: [CommitDay] = []
        
        // Generate 30 days of sample data with realistic patterns
        for i in 0..<30 {
            let date = calendar.date(byAdding: .day, value: -i, to: today) ?? today
            
            // Create realistic commit patterns (more on weekdays, some days with no commits)
            let dayOfWeek = calendar.component(.weekday, from: date)
            let isWeekend = dayOfWeek == 1 || dayOfWeek == 7
            
            var commitCount = 0
            if !isWeekend {
                // Weekdays: 0-8 commits with some variation
                commitCount = Int.random(in: 0...8)
                // 20% chance of no commits on weekdays
                if Int.random(in: 1...5) == 1 {
                    commitCount = 0
                }
            } else {
                // Weekends: 0-3 commits, more likely to be 0
                commitCount = Int.random(in: 0...3)
                // 60% chance of no commits on weekends
                if Int.random(in: 1...5) <= 3 {
                    commitCount = 0
                }
            }
            
            commits.append(CommitDay(date: date, count: commitCount))
        }
        
        return commits.reversed() // Oldest first
    }
}

// MARK: - Network Service (for future implementation)
class GitActivityNetworkService {
    static let shared = GitActivityNetworkService()
    private init() {}
    
    func fetchRepositoryData(owner: String, repo: String) async throws -> GitRepoData {
        // TODO: Implement actual GitHub API calls
        // For now, return sample data
        return GitRepoData.sampleData
    }
    
    func fetchUserActivity(username: String) async throws -> [CommitDay] {
        // TODO: Implement GitHub user activity API
        return GitRepoData.sampleData.commits
    }
} 