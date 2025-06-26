import SwiftUI

struct ActivityCurveView: View {
    let commits: [CommitDay]
    private let decayRate: Double = 0.95
    
    var body: some View {
        GeometryReader { geometry in
            let width = geometry.size.width
            let height = geometry.size.height
            
            // Calculate momentum values using decay algorithm
            let momentumValues = calculateMomentum()
            let maxMomentum = momentumValues.max() ?? 1.0
            
            ZStack {
                // Gradient fill under the curve
                Path { path in
                    guard !momentumValues.isEmpty else { return }
                    
                    let stepX = width / CGFloat(max(momentumValues.count - 1, 1))
                    
                    // Start from bottom left
                    path.move(to: CGPoint(x: 0, y: height))
                    
                    // Create smooth curve points
                    for (index, momentum) in momentumValues.enumerated() {
                        let x = CGFloat(index) * stepX
                        let y = height - (CGFloat(momentum / maxMomentum) * height)
                        
                        if index == 0 {
                            path.addLine(to: CGPoint(x: x, y: y))
                        } else {
                            // Add smooth curve using quadratic bezier
                            let previousX = CGFloat(index - 1) * stepX
                            let controlX = (previousX + x) / 2
                            let controlY = y
                            path.addQuadCurve(to: CGPoint(x: x, y: y), control: CGPoint(x: controlX, y: controlY))
                        }
                    }
                    
                    // Close the path to create fill area
                    path.addLine(to: CGPoint(x: width, y: height))
                    path.addLine(to: CGPoint(x: 0, y: height))
                }
                .fill(
                    LinearGradient(
                        gradient: Gradient(colors: [
                            Color.cyan.opacity(0.3),
                            Color.cyan.opacity(0.1),
                            Color.clear
                        ]),
                        startPoint: .top,
                        endPoint: .bottom
                    )
                )
                
                // Curve line
                Path { path in
                    guard !momentumValues.isEmpty else { return }
                    
                    let stepX = width / CGFloat(max(momentumValues.count - 1, 1))
                    
                    for (index, momentum) in momentumValues.enumerated() {
                        let x = CGFloat(index) * stepX
                        let y = height - (CGFloat(momentum / maxMomentum) * height)
                        
                        if index == 0 {
                            path.move(to: CGPoint(x: x, y: y))
                        } else {
                            // Add smooth curve using quadratic bezier
                            let previousX = CGFloat(index - 1) * stepX
                            let controlX = (previousX + x) / 2
                            let controlY = y
                            path.addQuadCurve(to: CGPoint(x: x, y: y), control: CGPoint(x: controlX, y: controlY))
                        }
                    }
                }
                .stroke(
                    Color.cyan,
                    style: StrokeStyle(
                        lineWidth: 2,
                        lineCap: .round,
                        lineJoin: .round
                    )
                )
            }
        }
    }
    
    private func calculateMomentum() -> [Double] {
        guard !commits.isEmpty else { return [] }
        
        var momentum: [Double] = []
        var currentMomentum: Double = 0
        
        for commit in commits {
            // Add today's commits to momentum
            currentMomentum += Double(commit.count)
            momentum.append(currentMomentum)
            
            // Apply decay for next day
            currentMomentum *= decayRate
        }
        
        return momentum
    }
}

// MARK: - Preview
#Preview {
    VStack(spacing: 20) {
        Text("Activity Curve Preview")
            .font(.headline)
            .foregroundColor(.white)
        
        ActivityCurveView(commits: GitRepoData.sampleData.commits)
            .frame(height: 100)
            .background(Color.black)
        
        ActivityCurveView(commits: Array(GitRepoData.sampleData.commits.suffix(14)))
            .frame(height: 60)
            .background(Color.black)
        
        ActivityCurveView(commits: Array(GitRepoData.sampleData.commits.suffix(7)))
            .frame(height: 40)
            .background(Color.black)
    }
    .padding()
    .background(Color.black)
} 