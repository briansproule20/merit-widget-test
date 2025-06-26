import { GitActivityWidget } from "@/components/widgets/git-activity-widget";
import { GitActivityWidgetMock } from "@/components/widgets/git-activity-widget-mock";
import { GitActivityWidgetSimple } from "@/components/widgets/git-activity-widget-simple";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Zap, BarChart3, Users, GitBranch } from "lucide-react";

// Merit Systems Logo Component
const MeritLogo = ({ className = "w-16 h-16" }: { className?: string }) => (
  <img 
    src="/logo/merit-logo.png" 
    alt="Merit Systems Logo" 
    className={`${className} object-contain`}
  />
);

export default function GitActivityWidgetPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-black via-gray-900 to-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Centered Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-6 mb-6">
              <MeritLogo className="w-20 h-20" />
              <div className="text-left">
                <h1 className="text-5xl font-bold text-white" style={{ fontFamily: 'Helvetica Now Display, Helvetica, Arial, sans-serif' }}>
                  Merit Systems Repo Analytics
                </h1>
                <p className="text-teal-400 font-medium text-lg mt-2" style={{ fontFamily: 'Helvetica Now Display, Helvetica, Arial, sans-serif' }}>
                  Advanced Git Intelligence Platform
                </p>
              </div>
            </div>
            
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed" style={{ fontFamily: 'Helvetica Now Display, Helvetica, Arial, sans-serif' }}>
              Harness the power of AI-driven repository analytics with momentum-based activity tracking. 
              Visualize commit patterns, contributor insights, and development velocity using Merit's proprietary decay algorithms.
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <div className="flex items-center gap-2 px-6 py-3 bg-teal-500/20 border border-teal-500/40 rounded-lg backdrop-blur-sm">
              <Zap className="h-5 w-5 text-teal-400" />
              <span className="text-sm text-teal-300 font-medium">Real-time Analysis</span>
            </div>
            <div className="flex items-center gap-2 px-6 py-3 bg-red-500/20 border border-red-500/40 rounded-lg backdrop-blur-sm">
              <BarChart3 className="h-5 w-5 text-red-400" />
              <span className="text-sm text-red-300 font-medium">Momentum Tracking</span>
            </div>
            <div className="flex items-center gap-2 px-6 py-3 bg-gray-500/20 border border-gray-500/40 rounded-lg backdrop-blur-sm">
              <Users className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-300 font-medium">Contributor Insights</span>
            </div>
            <div className="flex items-center gap-2 px-6 py-3 bg-blue-500/20 border border-blue-500/40 rounded-lg backdrop-blur-sm">
              <GitBranch className="h-5 w-5 text-blue-400" />
              <span className="text-sm text-blue-300 font-medium">Repository Intelligence</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs defaultValue="live" className="space-y-8">
          {/* Tab Navigation */}
          <div className="flex items-center justify-between">
            <TabsList className="bg-gray-900 border border-gray-800">
              <TabsTrigger 
                value="live" 
                className="data-[state=active]:bg-teal-600 data-[state=active]:text-white text-gray-300 border-r border-gray-700 last:border-r-0"
              >
                <Github className="h-4 w-4 mr-2" />
                Live Analysis
              </TabsTrigger>
              <TabsTrigger 
                value="demo" 
                className="data-[state=active]:bg-teal-600 data-[state=active]:text-white text-gray-300"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Demo Data
              </TabsTrigger>
            </TabsList>
            
            <Button 
              variant="outline" 
              size="sm" 
              asChild
              className="border-teal-500/50 text-teal-400 hover:bg-teal-500/10 hover:border-teal-400 bg-black/50"
            >
              <a href="https://merit.systems" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Merit Systems
              </a>
            </Button>
          </div>

          {/* Live Analysis Tab */}
          <TabsContent value="live" className="space-y-8">
            <Card className="bg-gray-900 border-gray-800 shadow-2xl">
              <CardHeader className="border-b border-gray-800">
                <CardTitle className="text-white flex items-center gap-2">
                  <Github className="h-6 w-6 text-teal-400" />
                  Repository Analysis
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Enter a GitHub username to explore repositories, or analyze a specific repo directly
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <GitActivityWidgetSimple />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Demo Data Tab */}
          <TabsContent value="demo" className="space-y-8">
            <div className="grid gap-8 md:grid-cols-2">
              <Card className="bg-gray-900 border-gray-800 shadow-2xl">
                <CardHeader className="border-b border-gray-800">
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="h-6 w-6 text-red-400" />
                    Interactive Demo
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Explore sample data with full interactivity
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <GitActivityWidgetMock />
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800 shadow-2xl">
                <CardHeader className="border-b border-gray-800">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Zap className="h-6 w-6 text-teal-400" />
                    Advanced Analytics
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Merit's proprietary momentum algorithms
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                      <span className="text-gray-300 font-medium">Decay-based Momentum</span>
                      <Badge className="bg-teal-500/20 text-teal-300 border-teal-500/30">
                        Active
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                      <span className="text-gray-300 font-medium">Contributor Velocity</span>
                      <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
                        Enhanced
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                      <span className="text-gray-300 font-medium">Pattern Recognition</span>
                      <Badge className="bg-teal-500/20 text-teal-300 border-teal-500/30">
                        AI-Powered
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-gray-700">
                    <p className="text-sm text-gray-400 leading-relaxed">
                      Merit's algorithms analyze commit patterns using exponential decay functions to calculate 
                      repository momentum and predict development trends with unprecedented accuracy.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-20 pt-12 border-t border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <MeritLogo className="w-10 h-10" />
              <div>
                <p className="text-white font-semibold text-lg">Merit Systems</p>
                <p className="text-sm text-gray-400">Advanced Analytics Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-400 hover:text-teal-400 hover:bg-teal-500/10"
                asChild
              >
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4 mr-2" />
                  GitHub
                </a>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-400 hover:text-teal-400 hover:bg-teal-500/10"
                asChild
              >
                <a href="https://merit.systems" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Merit Systems
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 