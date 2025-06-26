"use client";

import React, { useState } from "react";
import { ActivityChart, LoadingActivityChart } from "@/toolkits/toolkits/github/components/activity-chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GitBranch, Star, GitCommit, Users, AlertCircle, User } from "lucide-react";
import { SiGithub } from "@icons-pack/react-simple-icons";

interface RepoData {
  owner: string;
  name: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  commits: number;
  prs: number;
  homepage: string;
}

interface OwnerData {
  twitter_username: string | null;
  email: string | null;
  company: string | null;
  location: string | null;
}

interface RepoOption {
  name: string;
  description: string;
  stars: number;
  language: string;
  updated_at: string;
  fork: boolean;
}

interface ApiResponse {
  repo: RepoData;
  owner: OwnerData;
  commits: Array<{ date: string; count: number }>;
  topContributors: Array<{ login: string; commits: number; prs: number }>;
}

interface RepoListResponse {
  repos: RepoOption[];
  owner: string;
}

export function GitActivityWidgetSimple() {
  const [input, setInput] = useState("");
  const [data, setData] = useState<ApiResponse | null>(null);
  const [repos, setRepos] = useState<RepoListResponse | null>(null);
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parseInput = (input: string) => {
    // Handle different input formats:
    // 1. "username" -> find their best repo
    // 2. "username/repo" -> specific repo
    // 3. "github.com/username/repo" -> extract username/repo
    
    const trimmed = input.trim();
    
    // Handle GitHub URLs
    if (trimmed.includes('github.com/')) {
      const match = trimmed.match(/github\.com\/([^\/]+)\/([^\/\s]+)/);
      if (match) {
        return { owner: match[1], name: match[2] };
      }
    }
    
    // Handle username/repo format
    if (trimmed.includes('/')) {
      const [owner, name] = trimmed.split('/');
      return { owner: owner?.trim(), name: name?.trim() };
    }
    
    // Just username - will find best repo
    return { owner: trimmed, name: undefined };
  };

  const fetchUserRepos = async (username: string) => {
    setLoadingRepos(true);
    setError(null);
    setRepos(null);
    setData(null);

    try {
      const response = await fetch("/api/github/user-repos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch repositories");
      }

      const result = await response.json();
      setRepos(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoadingRepos(false);
    }
  };

  const fetchRepoData = async (owner?: string, repoName?: string) => {
    const targetOwner = owner || parseInput(input).owner;
    const targetName = repoName || parseInput(input).name;
    
    if (!targetOwner) {
      setError("Please enter a valid GitHub username or repository");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const inputString = targetName ? `${targetOwner}/${targetName}` : targetOwner;
      
      const response = await fetch("/api/github/repo-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: inputString }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch repository data");
      }

      const result = await response.json();
      console.log("API Response:", result); // Debug log
      console.log("Commits array:", result.commits); // Debug commits specifically
      console.log("Is commits array?", Array.isArray(result.commits)); // Check if it's an array
      if (!result.commits || !Array.isArray(result.commits)) {
        throw new Error(`Invalid data structure received from API. Expected commits array, got: ${typeof result.commits}`);
      }
      setData(result);
      setRepos(null); // Clear repo list when showing data
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const { owner, name } = parseInput(input);
    
    if (name) {
      // Direct repo specified, fetch data immediately
      fetchRepoData();
    } else if (owner) {
      // Username only, fetch repo list
      fetchUserRepos(owner);
    }
  };

  const handleRepoSelect = (repoName: string) => {
    if (!repos) return;
    setSelectedRepo(repoName);
    fetchRepoData(repos.owner, repoName);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">
              GitHub Repository
            </label>
            <div className="flex gap-3">
              <Input
                type="text"
                placeholder="Enter username or repository (e.g., 'vercel/next.js')"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-black border-gray-700 text-white placeholder-gray-500 focus:border-teal-500 focus:ring-teal-500"
              />
              <Button 
                type="submit" 
                disabled={loading || !input.trim()}
                className="bg-teal-600 hover:bg-teal-700 text-white px-6 disabled:bg-gray-700"
              >
                {loading ? "Analyzing..." : "Analyze"}
              </Button>
            </div>
            <p className="text-sm text-gray-400">
              Try: <code className="bg-black border border-gray-700 px-2 py-1 rounded text-xs text-teal-300">briansproule20</code>
            </p>
          </div>
        </form>

        {/* Quick Examples */}
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-400">Quick examples:</span>
          {["briansproule20", "sragss", "rsproule"].map((example) => (
            <Button
              key={example}
              variant="outline"
              size="sm"
              onClick={() => {
                setInput(example);
              }}
              className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:border-teal-500 hover:text-teal-300 bg-black"
            >
              {example}
            </Button>
          ))}
        </div>

        {error && (
          <div className="flex items-center gap-3 p-4 text-sm text-red-300 bg-red-500/10 border border-red-500/30 rounded-xl">
            <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Repository Selection */}
        {repos && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-medium text-white">Select a repository from @{repos.owner}</h3>
              <div className="px-3 py-1 bg-teal-500/20 text-teal-300 rounded-full text-sm font-medium border border-teal-500/30">
                {repos.repos.length} repos
              </div>
            </div>
            <div className="grid gap-3 max-h-80 overflow-y-auto">
              {repos.repos.map((repo) => (
                <div
                  key={repo.name}
                  className={`p-4 border rounded-xl cursor-pointer transition-all hover:shadow-lg ${
                    selectedRepo === repo.name 
                      ? 'border-teal-500 bg-teal-500/10 shadow-lg shadow-teal-500/20' 
                      : 'border-gray-700 bg-black hover:border-teal-500/50 hover:bg-gray-900'
                  }`}
                  onClick={() => handleRepoSelect(repo.name)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-white">{repo.name}</span>
                        {repo.fork && (
                          <span className="px-2 py-1 bg-gray-600 text-gray-300 rounded text-xs font-medium">
                            Fork
                          </span>
                        )}
                        {repo.language && (
                          <span className="px-2 py-1 bg-red-500/20 text-red-300 rounded text-xs font-medium border border-red-500/30">
                            {repo.language}
                          </span>
                        )}
                      </div>
                      {repo.description && (
                        <p className="text-sm text-gray-400 line-clamp-2">{repo.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400 ml-4">
                      {repo.stars > 0 && (
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-teal-400" />
                          <span>{repo.stars}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {loading && <LoadingActivityChart />}
      
      {loadingRepos && (
        <div className="bg-black border border-gray-700 rounded-xl p-8">
          <div className="flex items-center justify-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-400"></div>
            <span className="text-sm text-gray-300">Loading repositories...</span>
          </div>
        </div>
      )}

      {data && data.commits && Array.isArray(data.commits) && (
        <div className="bg-black border border-gray-700 rounded-xl shadow-2xl overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-medium text-white flex items-center gap-2">
                  <SiGithub className="h-5 w-5 text-teal-400" />
                  {data.repo?.owner || 'Unknown'}/{data.repo?.name || 'Unknown'}
                </h3>
                <p className="text-gray-300 mt-1">{data.repo?.description || 'No description available'}</p>
              </div>
              {data.repo?.homepage && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  asChild
                  className="border-teal-500/50 text-teal-400 hover:bg-teal-500/10 hover:border-teal-400 bg-black"
                >
                  <a href={data.repo.homepage} target="_blank" rel="noopener noreferrer">
                    Visit Site
                  </a>
                </Button>
              )}
            </div>
            
            <div className="flex flex-wrap gap-6 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-teal-400" />
                <span className="text-gray-300">{(data.repo?.stars || 0).toLocaleString()} stars</span>
              </div>
              <div className="flex items-center gap-2">
                <GitBranch className="h-4 w-4 text-teal-400" />
                <span className="text-gray-300">{(data.repo?.forks || 0).toLocaleString()} forks</span>
              </div>
              <div className="flex items-center gap-2">
                <GitCommit className="h-4 w-4 text-red-400" />
                <span className="text-gray-300">{(data.repo?.commits || 0).toLocaleString()} commits</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300">Public repository</span>
              </div>
              {data.repo?.language && (
                <div className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-xs font-medium border border-red-500/30">
                  {data.repo.language}
                </div>
              )}
            </div>
          </div>
          <div className="p-8 bg-gray-950">
            <ActivityChart 
              data={data.commits.map(commit => ({
                timestamp: commit.date,
                count: commit.count
              }))}
            />
          </div>
        </div>
      )}
    </div>
  );
} 