import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Building2,
  LayoutDashboard,
  Grid3X3,
  Network,
  Calendar,
  Bot,
  FileText,
  ArrowRight,
  TrendingUp,
  Target,
  Zap,
  Sun,
  Moon,
  ChevronRight,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: LayoutDashboard,
    title: "Executive Dashboard",
    description:
      "Real-time portfolio health metrics, EBITDA impact tracking, and top company rankings at a glance.",
    href: "/dashboard",
    color: "blue",
  },
  {
    icon: Grid3X3,
    title: "Value-Readiness Matrix",
    description:
      "Interactive scatter plot visualization with quadrant analysis, filtering, and drill-down capabilities.",
    href: "/matrix",
    color: "green",
  },
  {
    icon: Network,
    title: "Portfolio Amplification",
    description:
      "Cross-portfolio synergy analysis with replication potential scoring and Platform Play identification.",
    href: "/portfolio",
    color: "purple",
  },
  {
    icon: Calendar,
    title: "Hold Period Planning",
    description:
      "Three-track value capture model with phase-gate timeline visualization and initiative sequencing.",
    href: "/hold-period",
    color: "amber",
  },
  {
    icon: Bot,
    title: "AI Assistant",
    description:
      "Natural language querying for portfolio insights and AI-powered strategic recommendations.",
    href: "/ai",
    color: "sky",
  },
  {
    icon: FileText,
    title: "Reports & Exports",
    description:
      "Generate shareable HTML reports, Excel exports with formulas, and BlueAlly branded presentations.",
    href: "/reports",
    color: "rose",
  },
];

const stats = [
  { label: "Portfolio Companies", value: "55" },
  { label: "Investment Categories", value: "5" },
  { label: "Value Themes", value: "3" },
  { label: "Hold Period Tracks", value: "3" },
];

export default function Home() {
  const { user, loading, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg blueally-gradient">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-[#003B73] dark:text-[#00A3E0]">
                StonePeak AI
              </span>
              <span className="hidden sm:inline text-sm text-muted-foreground ml-2">
                Portfolio Intelligence
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>

            {user ? (
              <div className="flex items-center gap-3">
                <Link href="/dashboard">
                  <Button>
                    Go to Dashboard
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            ) : (
              <Button asChild>
                <a href={getLoginUrl()}>Sign in</a>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 blueally-gradient opacity-5" />
        <div className="container py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Powered Portfolio Intelligence
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              <span className="text-[#003B73] dark:text-white">Transform Your</span>
              <br />
              <span className="blueally-gradient bg-clip-text text-transparent">
                Portfolio Strategy
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Harness the power of AI to analyze, prioritize, and optimize value
              creation initiatives across your private equity portfolio with
              deterministic, auditable insights.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {user ? (
                <Link href="/dashboard">
                  <Button size="lg" className="gap-2">
                    <LayoutDashboard className="w-5 h-5" />
                    Open Dashboard
                  </Button>
                </Link>
              ) : (
                <Button size="lg" asChild className="gap-2">
                  <a href={getLoginUrl()}>
                    Get Started
                    <ArrowRight className="w-5 h-5" />
                  </a>
                </Button>
              )}
              <Link href="/matrix">
                <Button size="lg" variant="outline" className="gap-2">
                  <Grid3X3 className="w-5 h-5" />
                  View Matrix
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border bg-muted/30">
        <div className="container py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-[#003B73] dark:text-[#00A3E0]">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Comprehensive Portfolio Analysis
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to analyze, prioritize, and execute value
              creation initiatives across your portfolio.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Link key={index} href={feature.href}>
                <Card className="h-full hover:shadow-lg transition-all hover:border-primary/50 cursor-pointer group">
                  <CardContent className="p-6">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                        feature.color === "blue"
                          ? "bg-blue-100 dark:bg-blue-900/30"
                          : feature.color === "green"
                          ? "bg-green-100 dark:bg-green-900/30"
                          : feature.color === "purple"
                          ? "bg-purple-100 dark:bg-purple-900/30"
                          : feature.color === "amber"
                          ? "bg-amber-100 dark:bg-amber-900/30"
                          : feature.color === "sky"
                          ? "bg-sky-100 dark:bg-sky-900/30"
                          : "bg-rose-100 dark:bg-rose-900/30"
                      }`}
                    >
                      <feature.icon
                        className={`w-6 h-6 ${
                          feature.color === "blue"
                            ? "text-blue-600 dark:text-blue-400"
                            : feature.color === "green"
                            ? "text-green-600 dark:text-green-400"
                            : feature.color === "purple"
                            ? "text-purple-600 dark:text-purple-400"
                            : feature.color === "amber"
                            ? "text-amber-600 dark:text-amber-400"
                            : feature.color === "sky"
                            ? "text-sky-600 dark:text-sky-400"
                            : "text-rose-600 dark:text-rose-400"
                        }`}
                      />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                    <div className="flex items-center gap-1 mt-4 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      Learn more
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Framework Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Three Analytical Frameworks
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Integrated frameworks for comprehensive portfolio analysis and
              value creation planning.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 border-[#003B73]/20">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-[#003B73]/10 flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-[#003B73]" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-[#003B73]">
                  Value-Readiness Matrix
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Position companies across four quadrants based on AI value
                  potential and implementation readiness.
                </p>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    Champions (High Value + High Readiness)
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-sky-500" />
                    Quick Wins (Lower Value + High Readiness)
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                    Strategic (High Value + Lower Readiness)
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gray-500" />
                    Foundations (Lower Value + Lower Readiness)
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-[#00A3E0]/20">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-[#00A3E0]/10 flex items-center justify-center mb-4">
                  <Network className="w-6 h-6 text-[#00A3E0]" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-[#00A3E0]">
                  Portfolio Amplification
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Identify cross-portfolio synergies and replication
                  opportunities for maximum value creation.
                </p>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#00A3E0]" />
                    Replication Potential Scoring (1-10)
                  </li>
                  <li className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#00A3E0]" />
                    Platform Play vs Point Solution
                  </li>
                  <li className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#00A3E0]" />
                    Cross-Portfolio Synergy Network
                  </li>
                  <li className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#00A3E0]" />
                    Portfolio-Adjusted Priority
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-[#00B34A]/20">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-[#00B34A]/10 flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-[#00B34A]" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-[#00B34A]">
                  Hold Period Planning
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Align AI initiatives with investment timeline through
                  three-track value capture model.
                </p>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#003B73]" />
                    EBITDA Accelerators (40-50%, 0-12mo)
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#00A3E0]" />
                    Growth Enablers (30-40%, 12-24mo)
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#00B34A]" />
                    Exit Multipliers (15-25%, 24-36mo+)
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Portfolio?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Start analyzing your portfolio with AI-powered insights today.
            </p>
            {user ? (
              <Link href="/dashboard">
                <Button size="lg" className="gap-2">
                  <LayoutDashboard className="w-5 h-5" />
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <Button size="lg" asChild className="gap-2">
                <a href={getLoginUrl()}>
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg blueally-gradient">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-[#003B73] dark:text-[#00A3E0]">
                StonePeak AI
              </span>
            </div>
            <div className="text-sm text-muted-foreground text-center">
              Powered by <strong className="text-[#003B73] dark:text-[#00A3E0]">BlueAlly Technology Solutions</strong>
            </div>
            <div className="text-sm text-muted-foreground">
              Trustworthiness • Reliability • Energized Innovation
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
