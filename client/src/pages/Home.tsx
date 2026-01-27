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
                Enter Platform
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
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
              className="font-serif italic tracking-tight text-5xl md:text-7xl lg:text-8xl mb-6"
              variants={fadeInUp}
            >
              Intelligence,<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 not-italic font-semibold">Refined.</span>
            </motion.h1>
            
            <motion.p 
              className="text-muted-foreground text-lg font-light text-xl md:text-2xl max-w-2xl mx-auto mb-10"
              variants={fadeInUp}
            >
              The future isn't just faster. It's clearer.
              <br />
              <span className="text-foreground/80">Transform instinct into quantified conviction.</span>
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              variants={fadeInUp}
            >
              <Link href="/dashboard">
                <Button size="lg" className="relative overflow-hidden rounded-lg px-6 py-3 font-medium bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg hover:shadow-xl transition-all text-lg px-8 py-6">
                  View Portfolio
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/matrix">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent border-border/50 hover:bg-card/50">
                  Explore Matrix
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats Row */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {[
              { value: "55", label: "Portfolio Companies" },
              { value: "$1.07B", label: "Total EBITDA Impact" },
              { value: "10", label: "Champions Identified" },
              { value: "3", label: "Strategic Frameworks" },
            ].map((stat, i) => (
              <div key={i} className="bg-card/90 backdrop-blur-xl rounded-xl border border-border/50 p-5 text-center">
                <p className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Executive Summary - Hemingway Voice */}
      <section className="relative py-24 border-t border-border/30">
        <div className="container">
          <motion.div 
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-serif italic tracking-tight text-3xl md:text-4xl mb-8 text-center">
              The Case for<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 not-italic font-semibold">AI Intelligence</span>
            </h2>
            
            <div className="prose prose-lg dark:prose-invert mx-auto text-muted-foreground leading-relaxed">
              <p className="text-lg md:text-xl">
                Private equity firms hold a structural advantage in AI. They own multiple companies. 
                They can deploy solutions across portfolios. They can learn once and apply many times.
              </p>
              
              <p className="text-lg md:text-xl">
                But advantage means nothing without action. And action requires clarity.
              </p>
              
              <p className="text-lg md:text-xl">
                This platform provides that clarity. It takes 55 portfolio companies. It measures their 
                AI value potential. It measures their organizational readiness. It tells you where to 
                invest your time and capital.
              </p>
              
              <p className="text-lg md:text-xl font-medium text-foreground">
                The numbers don't lie. The frameworks don't guess. The recommendations are clear.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Three Frameworks Section */}
      <section className="relative py-24 border-t border-border/30">
        <div className="container">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif italic tracking-tight text-3xl md:text-4xl mb-4">
              Three Frameworks.<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 not-italic font-semibold">One Truth.</span>
            </h2>
            <p className="text-muted-foreground text-lg font-light max-w-xl mx-auto">
              Each framework answers a different question. Together, they tell the complete story.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Framework 1: Value-Readiness Matrix */}
            <motion.div 
              className="bg-card/90 backdrop-blur-xl rounded-xl border border-border/50 p-8 group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/15 text-primary mb-6 group-hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)] transition-all duration-300">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Value-Readiness Matrix</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Where should you focus? This matrix plots every company by AI value potential 
                and organizational readiness. Four quadrants emerge. Champions lead. Foundations follow.
              </p>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4" style={{ color: "oklch(0.65 0.18 145)" }} />
                  <span><strong>Champions</strong> — High value, high readiness. Deploy now.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4" style={{ color: "oklch(0.60 0.18 250)" }} />
                  <span><strong>Quick Wins</strong> — Lower value, high readiness. Fast returns.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4" style={{ color: "oklch(0.60 0.15 300)" }} />
                  <span><strong>Strategic</strong> — High value, lower readiness. Build first.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4" style={{ color: "oklch(0.45 0.02 250)" }} />
                  <span><strong>Foundations</strong> — Develop capabilities before AI.</span>
                </div>
              </div>
              <Link href="/matrix">
                <Button variant="ghost" className="mt-6 w-full justify-between group-hover:bg-primary/10">
                  Explore Matrix
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </motion.div>

            {/* Framework 2: Portfolio Amplification */}
            <motion.div 
              className="bg-card/90 backdrop-blur-xl rounded-xl border border-border/50 p-8 group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/15 text-primary mb-6 group-hover:shadow-[0_0_40px_-10px_rgba(34,211,238,0.4)] transition-all duration-300">
                <Network className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Portfolio Amplification</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Which investments compound? An AI solution that works for one company might work 
                for ten. This framework identifies replication potential across the portfolio.
              </p>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                    <span className="text-[10px] font-bold text-primary">P</span>
                  </div>
                  <span><strong>Platform Plays</strong> — Solutions that scale across 5+ companies with shared learning curves.</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-muted flex items-center justify-center mt-0.5">
                    <span className="text-[10px] font-bold text-muted-foreground">S</span>
                  </div>
                  <span><strong>Point Solutions</strong> — Company-specific implementations with limited replication.</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4 italic">
                "An initiative deployable across 10 companies delivers superior ROI to company-specific solutions."
              </p>
              <Link href="/portfolio">
                <Button variant="ghost" className="mt-6 w-full justify-between group-hover:bg-primary/10">
                  View Amplification
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </motion.div>

            {/* Framework 3: Hold Period Planning */}
            <motion.div 
              className="bg-card/90 backdrop-blur-xl rounded-xl border border-border/50 p-8 group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/15 text-primary mb-6 group-hover:shadow-[0_0_40px_-10px_rgba(34,197,94,0.4)] transition-all duration-300">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Hold Period Planning</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                When should you act? AI investments must align with exit timelines. This framework 
                sequences initiatives across three tracks to maximize realized value at exit.
              </p>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "oklch(0.65 0.18 250)" }} />
                    <strong>EBITDA Accelerators</strong>
                  </span>
                  <span className="text-muted-foreground">0-12 mo</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "oklch(0.70 0.15 200)" }} />
                    <strong>Growth Enablers</strong>
                  </span>
                  <span className="text-muted-foreground">6-24 mo</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "oklch(0.65 0.18 145)" }} />
                    <strong>Exit Multipliers</strong>
                  </span>
                  <span className="text-muted-foreground">12-36 mo</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4 italic">
                "Balance near-term EBITDA capture with exit narrative development."
              </p>
              <Link href="/hold-period">
                <Button variant="ghost" className="mt-6 w-full justify-between group-hover:bg-primary/10">
                  Plan Timeline
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Value Themes Section */}
      <section className="relative py-24 border-t border-border/30">
        <div className="container">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif italic tracking-tight text-3xl md:text-4xl mb-4">
              Three Value Themes.<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 not-italic font-semibold">Clear Allocation.</span>
            </h2>
            <p className="text-muted-foreground text-lg font-light max-w-xl mx-auto">
              Every AI use case maps to one of three strategic value themes. 
              This enables clear capital allocation aligned with investment thesis.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <motion.div 
              className="bg-card/90 backdrop-blur-xl rounded-xl border border-border/50 p-6 border-l-4"
              style={{ borderLeftColor: "oklch(0.70 0.18 145)" }}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-5 h-5" style={{ color: "oklch(0.70 0.18 145)" }} />
                <h3 className="font-semibold">Revenue Growth</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                AI applications that create new revenue streams, expand markets, enable premium pricing, 
                or unlock new customer segments. The top line grows.
              </p>
            </motion.div>

            <motion.div 
              className="bg-card/90 backdrop-blur-xl rounded-xl border border-border/50 p-6 border-l-4"
              style={{ borderLeftColor: "oklch(0.70 0.15 200)" }}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <BarChart3 className="w-5 h-5" style={{ color: "oklch(0.70 0.15 200)" }} />
                <h3 className="font-semibold">Margin Expansion</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                AI applications that improve EBITDA through yield optimization, throughput enhancement, 
                and productivity gains. The margins widen.
              </p>
            </motion.div>

            <motion.div 
              className="bg-card/90 backdrop-blur-xl rounded-xl border border-border/50 p-6 border-l-4"
              style={{ borderLeftColor: "oklch(0.65 0.18 250)" }}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Building2 className="w-5 h-5" style={{ color: "oklch(0.65 0.18 250)" }} />
                <h3 className="font-semibold">Cost Cutting</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                AI applications that reduce SG&A through automation of back-office functions 
                and elimination of administrative overhead. The costs fall.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 border-t border-border/30">
        <div className="container">
          <motion.div 
            className="bg-card/90 backdrop-blur-xl rounded-xl border border-border/50 p-12 md:p-16 text-center max-w-4xl mx-auto shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)]"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Brain className="w-12 h-12 mx-auto mb-6 text-primary" />
            <h2 className="font-serif italic tracking-tight text-3xl md:text-4xl mb-4">
              Ready to See<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 not-italic font-semibold">Your Portfolio?</span>
            </h2>
            <p className="text-muted-foreground text-lg font-light max-w-lg mx-auto mb-8">
              The data is ready. The frameworks are built. The insights await.
              <br />
              <span className="text-foreground/80">Enter the platform and see where your companies stand.</span>
            </p>
            <Link href="/dashboard">
              <Button size="lg" className="relative overflow-hidden rounded-lg px-6 py-3 font-medium bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg hover:shadow-xl transition-all text-lg px-10 py-6">
                View Dashboard
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
