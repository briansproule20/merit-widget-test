"use client";

import React, { useState } from "react";
import { ActivityChart } from "@/toolkits/toolkits/github/components/activity-chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GitBranch, Star, GitCommit, Users } from "lucide-react";
import { SiGithub } from "@icons-pack/react-simple-icons";

// Mock data for demonstration
const mockRepoData = {
  "vercel/next.js": {
    owner: "vercel",
    name: "next.js",
    description: "The React Framework for the Web",
    stars: 125000,
    forks: 26800,
    language: "TypeScript",
    totalCommits: 12543,
    commits: [
      { date: "2023-01-01T00:00:00.000Z", count: 45 },
      { date: "2023-02-01T00:00:00.000Z", count: 67 },
      { date: "2023-03-01T00:00:00.000Z", count: 89 },
      { date: "2023-04-01T00:00:00.000Z", count: 76 },
      { date: "2023-05-01T00:00:00.000Z", count: 94 },
      { date: "2023-06-01T00:00:00.000Z", count: 112 },
      { date: "2023-07-01T00:00:00.000Z", count: 98 },
      { date: "2023-08-01T00:00:00.000Z", count: 134 },
      { date: "2023-09-01T00:00:00.000Z", count: 156 },
      { date: "2023-10-01T00:00:00.000Z", count: 143 },
      { date: "2023-11-01T00:00:00.000Z", count: 167 },
      { date: "2023-12-01T00:00:00.000Z", count: 189 },
    ],
  },
  "facebook/react": {
    owner: "facebook",
    name: "react",
    description: "The library for web and native user interfaces",
    stars: 228000,
    forks: 46700,
    language: "JavaScript",
    totalCommits: 16789,
    commits: [
      { date: "2023-01-01T00:00:00.000Z", count: 23 },
      { date: "2023-02-01T00:00:00.000Z", count: 34 },
      { date: "2023-03-01T00:00:00.000Z", count: 45 },
      { date: "2023-04-01T00:00:00.000Z", count: 56 },
      { date: "2023-05-01T00:00:00.000Z", count: 67 },
      { date: "2023-06-01T00:00:00.000Z", count: 78 },
      { date: "2023-07-01T00:00:00.000Z", count: 89 },
      { date: "2023-08-01T00:00:00.000Z", count: 91 },
      { date: "2023-09-01T00:00:00.000Z", count: 103 },
      { date: "2023-10-01T00:00:00.000Z", count: 114 },
      { date: "2023-11-01T00:00:00.000Z", count: 125 },
      { date: "2023-12-01T00:00:00.000Z", count: 136 },
    ],
  },
  "microsoft/vscode": {
    owner: "microsoft",
    name: "vscode",
    description: "Visual Studio Code",
    stars: 163000,
    forks: 28900,
    language: "TypeScript",
    totalCommits: 95432,
    commits: [
      { date: "2023-01-01T00:00:00.000Z", count: 87 },
      { date: "2023-02-01T00:00:00.000Z", count: 92 },
      { date: "2023-03-01T00:00:00.000Z", count: 105 },
      { date: "2023-04-01T00:00:00.000Z", count: 98 },
      { date: "2023-05-01T00:00:00.000Z", count: 124 },
      { date: "2023-06-01T00:00:00.000Z", count: 143 },
      { date: "2023-07-01T00:00:00.000Z", count: 156 },
      { date: "2023-08-01T00:00:00.000Z", count: 167 },
      { date: "2023-09-01T00:00:00.000Z", count: 178 },
      { date: "2023-10-01T00:00:00.000Z", count: 189 },
      { date: "2023-11-01T00:00:00.000Z", count: 201 },
      { date: "2023-12-01T00:00:00.000Z", count: 215 },
    ],
  },
};

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

interface GitActivityWidgetMockProps {
  defaultRepo?: string;
  showControls?: boolean;
  title?: string;
  description?: string;
  className?: string;
}

export const GitActivityWidgetMock: React.FC<GitActivityWidgetMockProps> = ({
  defaultRepo = "",
  showControls = true,
  title = "Repository Activity",
  description = "Track commit activity and momentum over time",
  className = "",
}) => {
  const [repoInput, setRepoInput] = useState(defaultRepo);
  const [currentRepo, setCurrentRepo] = useState(defaultRepo);

  const repoData: RepoData | null = currentRepo 
    ? mockRepoData[currentRepo as keyof typeof mockRepoData] || null 
    : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (repoInput.trim()) {
      setCurrentRepo(repoInput.trim());
    }
  };

  const availableRepos = Object.keys(mockRepoData);

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <SiGithub className="h-5 w-5" />
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
        
        {showControls && (
          <>
            <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
              <Input
                type="text"
                placeholder="owner/repository"
                value={repoInput}
                onChange={(e) => setRepoInput(e.target.value)}
                className="flex-1"
              />
              <Button type="submit">
                Analyze
              </Button>
            </form>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="text-xs text-muted-foreground">Try:</span>
              {availableRepos.map((repo) => (
                <Button
                  key={repo}
                  variant="outline"
                  size="sm"
                  className="text-xs h-6"
                  onClick={() => {
                    setRepoInput(repo);
                    setCurrentRepo(repo);
                  }}
                >
                  {repo}
                </Button>
              ))}
            </div>
          </>
        )}
      </CardHeader>

      <CardContent>
        {repoData ? (
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
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <SiGithub className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Enter a repository path to view its commit activity</p>
            {showControls && (
              <p className="text-xs mt-2">
                Available: {availableRepos.join(", ")}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GitActivityWidgetMock; 