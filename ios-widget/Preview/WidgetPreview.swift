import SwiftUI

@main
struct WidgetPreviewApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
                .preferredColorScheme(.dark)
        }
        .windowResizability(.contentSize)
    }
}

struct ContentView: View {
    let entry = GitActivityEntry(
        date: Date(),
        repoData: GitRepoData.sampleData
    )
    
    var body: some View {
        ScrollView {
            VStack(spacing: 30) {
                // Header
                VStack(spacing: 8) {
                    HStack(spacing: 8) {
                        Image(systemName: "chevron.left.forwardslash.chevron.right")
                            .foregroundColor(.cyan)
                            .font(.system(size: 24, weight: .bold))
                        
                        Text("MERIT SYSTEMS")
                            .font(.system(size: 20, weight: .bold))
                            .foregroundColor(.white)
                    }
                    
                    Text("iOS Widget Preview")
                        .font(.system(size: 16))
                        .foregroundColor(.gray)
                }
                .padding(.top, 20)
                
                // Widget Previews
                VStack(spacing: 40) {
                    // Small Widget
                    VStack(spacing: 12) {
                        Text("Small Widget (2x2)")
                            .font(.headline)
                            .foregroundColor(.white)
                        
                        SmallGitActivityView(entry: entry)
                            .frame(width: 158, height: 158)
                            .cornerRadius(16)
                            .shadow(color: .black.opacity(0.3), radius: 8, x: 0, y: 4)
                    }
                    
                    // Medium Widget
                    VStack(spacing: 12) {
                        Text("Medium Widget (4x2)")
                            .font(.headline)
                            .foregroundColor(.white)
                        
                        MediumGitActivityView(entry: entry)
                            .frame(width: 329, height: 158)
                            .cornerRadius(16)
                            .shadow(color: .black.opacity(0.3), radius: 8, x: 0, y: 4)
                    }
                    
                    // Large Widget
                    VStack(spacing: 12) {
                        Text("Large Widget (4x4)")
                            .font(.headline)
                            .foregroundColor(.white)
                        
                        LargeGitActivityView(entry: entry)
                            .frame(width: 329, height: 329)
                            .cornerRadius(16)
                            .shadow(color: .black.opacity(0.3), radius: 8, x: 0, y: 4)
                    }
                }
                
                // Footer
                VStack(spacing: 8) {
                    Text("Widget Implementation Ready")
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundColor(.green)
                    
                    Text("Copy the widget files to your iOS project and configure with your GitHub API")
                        .font(.system(size: 12))
                        .foregroundColor(.gray)
                        .multilineTextAlignment(.center)
                }
                .padding(.bottom, 20)
            }
            .padding(.horizontal, 40)
        }
        .background(Color.black)
        .frame(minWidth: 500, minHeight: 800)
    }
} 