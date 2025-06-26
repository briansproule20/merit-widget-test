import { NextRequest, NextResponse } from "next/server";
import { Octokit } from "octokit";
import { githubRepoInfoToolConfigServer } from "@/toolkits/toolkits/github/tools/repo/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let { input, owner, name } = body;
    
    // Handle different input formats
    if (input) {
      if (input.includes("/")) {
        // Handle owner/repo format or GitHub URLs
        const cleanInput = input
          .replace("https://github.com/", "")
          .replace("http://github.com/", "")
          .replace(/\.git$/, "");
        
        const parts = cleanInput.split("/");
        if (parts.length >= 2) {
          owner = parts[0];
          name = parts[1];
        }
      } else {
        // Username only - find their best repository
        owner = input;
        name = undefined; // Will be resolved below
      }
    }

    // If only owner is provided (username), find their best repository
    if (owner && !name) {
      const octokit = new Octokit({
        auth: process.env.GITHUB_TOKEN,
      });

      try {
        // Get user's public repositories
        const { data: repos } = await octokit.rest.repos.listForUser({
          username: owner,
          type: 'public',
          sort: 'updated',
          per_page: 100,
        });

        if (repos.length === 0) {
          return NextResponse.json(
            { error: `No public repositories found for user ${owner}` },
            { status: 404 }
          );
        }

        // Find the best repository (prioritize by stars, then by recent activity)
        const bestRepo = repos
          .filter(repo => !repo.fork) // Exclude forks
          .sort((a, b) => {
            // First sort by stars (descending)
            if (b.stargazers_count !== a.stargazers_count) {
              return b.stargazers_count - a.stargazers_count;
            }
            // If stars are equal, sort by recent activity
            return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
          })[0];

        if (!bestRepo) {
          // If no non-fork repos, take the most recently updated one
          const mostRecentRepo = repos.sort((a, b) => 
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
          )[0];
          
          name = mostRecentRepo.name;
        } else {
          name = bestRepo.name;
        }
      } catch (error) {
        return NextResponse.json(
          { error: `User ${owner} not found or has no public repositories` },
          { status: 404 }
        );
      }
    }

    if (!owner || !name) {
      return NextResponse.json(
        { error: "GitHub username or owner/repository are required" },
        { status: 400 }
      );
    }

    // Initialize Octokit
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    });

    // Use the existing GitHub toolkit configuration
    const toolConfig = githubRepoInfoToolConfigServer(octokit);
    const result = await toolConfig.callback({
      owner,
      name,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching repository data:", error);
    
    if (error instanceof Error) {
      // Handle specific GitHub API errors
      if (error.message.includes("Not Found")) {
        return NextResponse.json(
          { error: "Repository not found" },
          { status: 404 }
        );
      }
      
      if (error.message.includes("rate limit")) {
        return NextResponse.json(
          { error: "GitHub API rate limit exceeded. Please try again later." },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to fetch repository data" },
      { status: 500 }
    );
  }
} 