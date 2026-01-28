import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/contexts/ThemeContext";
import {
  ArrowRight,
  Target,
  Layers,
  Clock,
  Trophy,
  Zap,
  TrendingUp,
  Building2,
  ChevronRight,
  BarChart3,
  Brain,
  Network,
  Sun,
  Moon,
  Lightbulb,
  FileText,
  MessageSquare,
  LayoutDashboard,
  Grid3X3,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Navigation sections with clear descriptions
const quickAccess = [
  {
    name: "Executive Dashboard",
    description: "Portfolio health metrics, top performers, and key insights at a glance",
    href: "/dashboard",
    icon: LayoutDashboard,
    color: "from-blue-500 to-cyan-400",
    badge: "Start Here"
  },
  {
    name: "All Companies",
    description: "Browse all 55 portfolio companies with complete data and filtering",
    href: "/companies",
    icon: Building2,
    color: "from-emerald-500 to-teal-400",
    badge: null
  },
];

const frameworks = [
  {
    name: "Value-Readiness Matrix",
    description: "Is this AI initiative worth pursuing at this company? Score value (EBITDA 50%, Revenue 25%, Risk 25%) and readiness (Org 35%, Data 35%, Tech 20%, Timeline 10%) to prioritize.",
    href: "/matrix",
    icon: Grid3X3,
    color: "from-violet-500 to-purple-400",
    shortDesc: "Use case-level decisions",
    coreQuestion: "Which companies are ready for AI?"
  },
  {
    name: "Portfolio Amplification",
    description: "How do we maximize returns across all companies? Score replication potential (1-10) and classify as Platform Play vs. Point Solution to capture PE's structural advantage.",
    href: "/portfolio",
    icon: Network,
    color: "from-orange-500 to-amber-400",
    shortDesc: "Cross-portfolio synergy",
    coreQuestion: "What can scale across the portfolio?"
  },
  {
    name: "Hold Period Planning",
    description: "How do we sequence investments against exit? Three tracks: EBITDA Accelerators (0-12mo, 40-50%), Growth Enablers (6-24mo, 30-40%), Exit Multipliers (12-36mo, 15-25%).",
    href: "/hold-period",
    icon: Clock,
    color: "from-pink-500 to-rose-400",
    shortDesc: "Timing & sequencing",
    coreQuestion: "When should we invest?"
  },
];

const tools = [
  {
    name: "AI Use Cases",
    description: "Detailed AI opportunities for Champion companies",
    href: "/use-cases",
    icon: Lightbulb,
    badge: "170 Use Cases"
  },
  // Hidden tabs - uncomment to re-enable
  // {
  //   name: "Reports & Export",
  //   description: "Generate branded reports and export data",
  //   href: "/reports",
  //   icon: FileText,
  //   badge: null
  // },
  // {
  //   name: "AI Assistant",
  //   description: "Ask questions about your portfolio in natural language",
  //   href: "/ai",
  //   icon: MessageSquare,
  //   badge: "AI Powered"
  // },
];

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className="min-h-screen bg-background">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-grid opacity-50" />
      <div className="fixed inset-0 bg-radial-gradient" />
      
      {/* Navigation */}
      <nav className="relative z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <img 
              src={theme === "dark" ? "/blueally-logo-white.png" : "/blueally-logo-color.png"} 
              alt="BlueAlly" 
              className="h-8 w-auto"
            />
            <span className="text-primary font-semibold text-lg">AI</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-muted-foreground hover:text-foreground"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>
            <Link href="/dashboard">
              <Button className="relative overflow-hidden rounded-lg px-6 py-3 font-medium bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg hover:shadow-xl transition-all">
                Go to Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - Simplified */}
      <section className="relative pt-16 pb-12 overflow-hidden">
        <div className="container">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial="initial"
            animate="animate"
            variants={stagger}
          >
            <motion.div variants={fadeInUp}>
              <Badge className="mb-6 px-4 py-1.5 text-sm bg-primary/10 text-primary border-primary/20">
                Portfolio Intelligence Platform
              </Badge>
            </motion.div>
            
            <motion.h1 
              className="font-serif italic tracking-tight text-4xl md:text-6xl lg:text-7xl mb-6"
              variants={fadeInUp}
            >
              Intelligence,<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 not-italic font-semibold">Refined.</span>
            </motion.h1>
            
            <motion.p 
              className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-8"
              variants={fadeInUp}
            >
              Transform portfolio data into actionable AI investment decisions.
              <br />
              <span className="text-foreground/80">55 companies. 3 frameworks. One clear path forward.</span>
            </motion.p>
          </motion.div>

          {/* Stats Row */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {[
              { value: "55", label: "Portfolio Companies" },
              { value: "$1.07B", label: "Total EBITDA Impact" },
              { value: "10", label: "Champions Identified" },
              { value: "170", label: "AI Use Cases" },
            ].map((stat, i) => (
              <div key={i} className="bg-card/90 backdrop-blur-xl rounded-xl border border-border/50 p-4 text-center">
                <p className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="relative py-12 border-t border-border/30">
        <div className="container">
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Quick Access
            </h2>
            <p className="text-muted-foreground">Jump straight to the most important views</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4 max-w-4xl">
            {quickAccess.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={item.href}>
                  <div className="bg-card/90 backdrop-blur-xl rounded-xl border border-border/50 p-6 group hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all cursor-pointer h-full">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${item.color} text-white shadow-lg`}>
                        <item.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{item.name}</h3>
                          {item.badge && (
                            <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground text-sm">{item.description}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Three Frameworks Section */}
      <section className="relative py-12 border-t border-border/30">
        <div className="container">
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Strategic Frameworks
            </h2>
            <p className="text-muted-foreground">Three lenses to analyze your portfolio's AI potential</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-4 max-w-6xl">
            {frameworks.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={item.href}>
                  <div className="bg-card/90 backdrop-blur-xl rounded-xl border border-border/50 p-6 group hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all cursor-pointer h-full flex flex-col">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${item.color} text-white shadow-lg mb-4`}>
                      <item.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">{item.name}</h3>
                    <p className="text-muted-foreground text-sm flex-1">{item.description}</p>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                      <span className="text-xs text-primary font-medium">{item.shortDesc}</span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools & Resources Section */}
      <section className="relative py-12 border-t border-border/30">
        <div className="container">
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-primary" />
              Tools & Resources
            </h2>
            <p className="text-muted-foreground">Deep-dive analysis and AI-powered assistance</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-4 max-w-6xl">
            {tools.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={item.href}>
                  <div className="bg-card/90 backdrop-blur-xl rounded-xl border border-border/50 p-5 group hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all cursor-pointer h-full">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10 text-primary">
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{item.name}</h3>
                          {item.badge && (
                            <Badge variant="outline" className="text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground text-sm">{item.description}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Executive Summary - Hemingway Voice */}
      <section className="relative py-16 border-t border-border/30">
        <div className="container">
          <motion.div 
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-serif italic tracking-tight text-2xl md:text-3xl mb-6 text-center">
              The Case for<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 not-italic font-semibold">AI Intelligence</span>
            </h2>
            
            <div className="prose prose-lg dark:prose-invert mx-auto text-muted-foreground leading-relaxed text-center">
              <p className="text-base md:text-lg">
                Private equity firms hold a structural advantage in AI. They own multiple companies. 
                They can deploy solutions across portfolios. They can learn once and apply many times.
              </p>
              
              <p className="text-base md:text-lg font-medium text-foreground">
                The numbers don't lie. The frameworks don't guess. The recommendations are clear.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 border-t border-border/30">
        <div className="container">
          <motion.div 
            className="bg-card/90 backdrop-blur-xl rounded-xl border border-border/50 p-10 md:p-12 text-center max-w-3xl mx-auto shadow-[0_0_40px_-10px_rgba(59,130,246,0.3)]"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Brain className="w-10 h-10 mx-auto mb-4 text-primary" />
            <h2 className="font-serif italic tracking-tight text-2xl md:text-3xl mb-3">
              Ready to<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 not-italic font-semibold">Get Started?</span>
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-6">
              The data is ready. The frameworks are built. The insights await.
            </p>
            <Link href="/dashboard">
              <Button size="lg" className="relative overflow-hidden rounded-lg font-medium bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg hover:shadow-xl transition-all px-8 py-5">
                Open Dashboard
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-8 border-t border-border/30">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <img 
                src={theme === "dark" ? "/blueally-logo-white.png" : "/blueally-logo-color.png"} 
                alt="BlueAlly" 
                className="h-5 w-auto"
              />
              <span className="text-primary font-medium">AI</span>
              <span className="mx-2">·</span>
              <span>Portfolio Intelligence Platform</span>
            </div>
            <p>© {new Date().getFullYear()} BlueAlly Technology Solutions</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
