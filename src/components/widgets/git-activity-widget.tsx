"use client";

import React, { useState, useEffect } from "react";
import { ActivityChart, LoadingActivityChart } from "@/toolkits/toolkits/github/components/activity-chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GitBranch, Star, GitCommit, Users, AlertCircle } from "lucide-react";
import { SiGithub } from "@icons-pack/react-simple-icons";

interface RepoData {
  owner: string;
  name: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  commits: Array<{
    date: string;
    count: number;
  }>;
  totalCommits: number;
}

interface GitActivityWidgetProps {
  defaultRepo?: string; // Format: "owner/repo"
  showControls?: boolean;
  title?: string;
  description?: string;
  className?: string;
}

export const GitActivityWidget: React.FC<GitActivityWidgetProps> = ({
  defaultRepo = "",
  showControls = true,
  title = "Repository Activity",
  description = "Track commit activity and momentum over time",
  className = "",
}) => {
  const [repoInput, setRepoInput] = useState(defaultRepo);
  const [repoData, setRepoData] = useState<RepoData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRepoData = async (repoPath: string) => {
    if (!repoPath.includes("/")) {
      setError("Please enter a valid repository path (owner/repo)");
      return;
    }

    const [owner, repo] = repoPath.split("/");
    if (!owner || !repo) {
      setError("Please enter a valid repository path (owner/repo)");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // This would typically call your API endpoint that uses the GitHub toolkit
      const response = await fetch(`/api/github/repo-info`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ owner, name: repo }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch repository data: ${response.statusText}`);
      }

      const data = await response.json();
      
      setRepoData({
        owner: data.repo.owner,
        name: data.repo.name,
        description: data.repo.description,
        stars: data.repo.stars,
        forks: data.repo.forks,
        language: data.repo.language,
        commits: data.commits,
        totalCommits: data.repo.commits,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch repository data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (repoInput.trim()) {
      fetchRepoData(repoInput.trim());
    }
  };

  // Auto-fetch if defaultRepo is provided
  useEffect(() => {
    if (defaultRepo && !repoData) {
      fetchRepoData(defaultRepo);
    }
  }, [defaultRepo, repoData]);

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <SiGithub className="h-5 w-5" />
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
        
        {showControls && (
          <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
            <Input
              type="text"
              placeholder="owner/repository"
              value={repoInput}
              onChange={(e) => setRepoInput(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Loading..." : "Analyze"}
            </Button>
          </form>
        )}
      </CardHeader>

      <CardContent>
        {error && (
          <div className="flex items-center gap-2 p-3 mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        {loading && (
          <div className="space-y-4">
            <div className="animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
            <LoadingActivityChart />
          </div>
        )}

        {repoData && !loading && (
          <div className="space-y-6">
            {/* Repository Info */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-semibold">
                  {repoData.owner}/{repoData.name}
                </h3>
                {repoData.language && (
                  <Badge variant="secondary">{repoData.language}</Badge>
                )}
              </div>
              {repoData.description && (
                <p className="text-sm text-muted-foreground">{repoData.description}</p>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">
                  <span className="font-medium">{repoData.stars.toLocaleString()}</span>
                  <span className="text-muted-foreground ml-1">stars</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <GitBranch className="h-4 w-4 text-blue-500" />
                <span className="text-sm">
                  <span className="font-medium">{repoData.forks.toLocaleString()}</span>
                  <span className="text-muted-foreground ml-1">forks</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <GitCommit className="h-4 w-4 text-green-500" />
                <span className="text-sm">
                  <span className="font-medium">{repoData.totalCommits.toLocaleString()}</span>
                  <span className="text-muted-foreground ml-1">commits</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-purple-500" />
                <span className="text-sm">
                  <span className="font-medium">Public</span>
                  <span className="text-muted-foreground ml-1">repo</span>
                </span>
              </div>
            </div>

            {/* Activity Chart */}
            <div className="mt-6">
              <ActivityChart
                data={repoData.commits.map(commit => ({
                  timestamp: commit.date,
                  count: commit.count,
                }))}
                hideDescription={false}
              />
            </div>
          </div>
        )}

        {!repoData && !loading && !error && showControls && (
          <div className="text-center py-8 text-muted-foreground">
            <SiGithub className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Enter a repository path to view its commit activity</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GitActivityWidget; 