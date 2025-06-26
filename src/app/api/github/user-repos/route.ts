import { NextRequest, NextResponse } from "next/server";
import { Octokit } from "octokit";

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();
    
    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      return NextResponse.json({ error: "GitHub token not configured" }, { status: 500 });
    }

    const octokit = new Octokit({ auth: token });

    // Fetch user's repositories
    const { data: repos } = await octokit.rest.repos.listForUser({
      username,
      sort: "updated",
      per_page: 20,
      type: "all"
    });

    // Filter and format repositories
    const formattedRepos = repos
      .filter((repo: any) => !repo.private) // Only public repos
      .map((repo: any) => ({
        name: repo.name,
        description: repo.description || "",
        stars: repo.stargazers_count || 0,
        language: repo.language || "Unknown",
        updated_at: repo.updated_at,
        fork: repo.fork
      }))
      .sort((a: any, b: any) => {
        // Sort by: non-forks first, then by stars, then by recent updates
        if (a.fork !== b.fork) return a.fork ? 1 : -1;
        if (a.stars !== b.stars) return b.stars - a.stars;
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      });

    return NextResponse.json({
      repos: formattedRepos,
      owner: username
    });

  } catch (error) {
    console.error("Error fetching user repositories:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch repositories" },
      { status: 500 }
    );
  }
} 