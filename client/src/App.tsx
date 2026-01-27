import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Matrix from "./pages/Matrix";
import Portfolio from "./pages/Portfolio";
import HoldPeriod from "./pages/HoldPeriod";
import CompanyDetail from "./pages/CompanyDetail";
import Reports from "./pages/Reports";
import AIAssistant from "./pages/AIAssistant";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/matrix" component={Matrix} />
      <Route path="/portfolio" component={Portfolio} />
      <Route path="/hold-period" component={HoldPeriod} />
      <Route path="/company/:id" component={CompanyDetail} />
      <Route path="/reports" component={Reports} />
      <Route path="/ai" component={AIAssistant} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" switchable>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
