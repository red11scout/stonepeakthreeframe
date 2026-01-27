import { Link, useLocation } from "wouter";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Grid3X3,
  Network,
  Clock,
  FileText,
  MessageSquare,
  Sun,
  Moon,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { useAppAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Matrix", href: "/matrix", icon: Grid3X3 },
  { name: "Amplification", href: "/portfolio", icon: Network },
  { name: "Hold Period", href: "/hold-period", icon: Clock },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "AI Assistant", href: "/ai", icon: MessageSquare },
];

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export default function Layout({ children, title, subtitle }: LayoutProps) {
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAppAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-grid opacity-30 pointer-events-none" />
      <div className="fixed inset-0 bg-radial-gradient pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3 group">
              {/* BlueAlly Logo - switches between white and color based on theme */}
              <img 
                src={theme === "dark" ? "/blueally-logo-white.png" : "/blueally-logo-color.png"} 
                alt="BlueAlly" 
                className="h-8 w-auto transition-transform group-hover:scale-105"
              />
              <span className="text-primary font-semibold text-lg hidden sm:inline">AI</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navigation.map((item) => {
                const isActive = location === item.href;
                return (
                  <Link key={item.name} href={item.href}>
                    <Button
                      variant="ghost"
                      className={`relative px-4 py-2 h-auto transition-all duration-200 ${
                        isActive
                          ? "text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <item.icon className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">{item.name}</span>
                      {isActive && (
                        <motion.div
                          layoutId="nav-indicator"
                          className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full"
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                    </Button>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
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

            {/* Logout Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="text-muted-foreground hover:text-destructive"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl"
            >
              <nav className="container py-4 space-y-1">
                {navigation.map((item) => {
                  const isActive = location === item.href;
                  return (
                    <Link key={item.name} href={item.href}>
                      <Button
                        variant="ghost"
                        className={`w-full justify-start gap-3 ${
                          isActive ? "bg-primary/10 text-primary" : "text-muted-foreground"
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <item.icon className="w-5 h-5" />
                        {item.name}
                      </Button>
                    </Link>
                  );
                })}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Page Header */}
      {(title || subtitle) && (
        <div className="border-b border-border/30 bg-background/50">
          <div className="container py-6">
            {title && (
              <h1 className="font-serif italic tracking-tight text-3xl md:text-4xl mb-1">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-muted-foreground text-lg font-light">{subtitle}</p>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="relative">
        <div className="container py-8">{children}</div>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-border/30 mt-auto">
        <div className="container py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
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
