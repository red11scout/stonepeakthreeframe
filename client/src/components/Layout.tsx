import { Link, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { useTheme } from "@/contexts/ThemeContext";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  LayoutDashboard,
  Grid3X3,
  Network,
  Calendar,
  Building2,
  FileText,
  Bot,
  Sun,
  Moon,
  User,
  LogOut,
  Menu,
  X,
  HelpCircle,
} from "lucide-react";
import { useState } from "react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Value-Readiness Matrix", href: "/matrix", icon: Grid3X3 },
  { name: "Portfolio Amplification", href: "/portfolio", icon: Network },
  { name: "Hold Period Planning", href: "/hold-period", icon: Calendar },
  { name: "Reports & Exports", href: "/reports", icon: FileText },
  { name: "AI Assistant", href: "/ai", icon: Bot },
];

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export default function Layout({ children, title, subtitle }: LayoutProps) {
  const [location] = useLocation();
  const { user, loading, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg blueally-gradient">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="text-lg font-bold text-[#003B73] dark:text-[#00A3E0]">
                  StonePeak AI
                </span>
                <span className="hidden md:inline text-sm text-muted-foreground ml-2">
                  Portfolio Intelligence
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navigation.map((item) => {
                const isActive = location === item.href;
                return (
                  <Link key={item.name} href={item.href}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      size="sm"
                      className={`gap-2 ${isActive ? "bg-secondary" : ""}`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span className="hidden xl:inline">{item.name}</span>
                    </Button>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Help */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="hidden sm:flex">
                  <HelpCircle className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Help & Documentation</p>
              </TooltipContent>
            </Tooltip>

            {/* Theme Toggle */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={toggleTheme}>
                  {theme === "dark" ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle {theme === "dark" ? "light" : "dark"} mode</p>
              </TooltipContent>
            </Tooltip>

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-sm font-medium text-primary-foreground">
                        {user.name?.charAt(0) || "U"}
                      </span>
                    </div>
                    <span className="hidden sm:inline">{user.name || "User"}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout()}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild size="sm">
                <a href={getLoginUrl()}>Sign in</a>
              </Button>
            )}

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
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border bg-card">
            <nav className="container py-4 space-y-1">
              {navigation.map((item) => {
                const isActive = location === item.href;
                return (
                  <Link key={item.name} href={item.href}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className="w-full justify-start gap-3"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.name}
                    </Button>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      {/* Page Header */}
      {(title || subtitle) && (
        <div className="border-b border-border bg-muted/30">
          <div className="container py-6">
            {title && (
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="mt-1 text-muted-foreground">{subtitle}</p>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container py-6">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 mt-auto">
        <div className="container py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Powered by</span>
              <span className="font-semibold text-[#003B73] dark:text-[#00A3E0]">
                BlueAlly Technology Solutions
              </span>
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
