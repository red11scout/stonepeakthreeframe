import Layout from "@/components/Layout";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { Streamdown } from "streamdown";
import {
  Bot,
  Send,
  Sparkles,
  Lightbulb,
  HelpCircle,
  Building2,
  TrendingUp,
  Target,
  Loader2,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const SUGGESTED_QUERIES = [
  "Show me Champions in Digital Infrastructure",
  "Which companies have the highest replication potential?",
  "What are the top 5 companies by adjusted priority?",
  "Analyze the Energy sector portfolio health",
  "Which companies need readiness improvement?",
  "Compare EBITDA Accelerators vs Growth Enablers",
  "What's the total value of Platform Plays?",
  "Recommend next steps for Quick Wins companies",
];

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Welcome to the StonePeak AI Assistant! I can help you analyze your portfolio, answer questions about companies, and provide strategic recommendations.

**Here are some things you can ask me:**
- "Show me Champions in Digital Infrastructure"
- "Which companies have the highest priority scores?"
- "Analyze the readiness of Energy sector companies"
- "What are the top opportunities for value creation?"

How can I help you today?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: companies } = trpc.companies.list.useQuery();
  const { data: metrics } = trpc.portfolio.metrics.useQuery();

  const queryMutation = trpc.ai.query.useMutation({
    onSuccess: (data) => {
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: data.answer,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    },
    onError: (error) => {
      toast.error(`Failed to get response: ${error.message}`);
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: "I apologize, but I encountered an error processing your request. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    queryMutation.mutate({ question: input.trim() });
  };

  const handleSuggestedQuery = (query: string) => {
    setInput(query);
  };

  return (
    <Layout
      title="AI Assistant"
      subtitle="Natural language portfolio intelligence"
    >
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Main Chat Area */}
        <div className="lg:col-span-3">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bot className="w-5 h-5" />
                Portfolio Intelligence Chat
              </CardTitle>
            </CardHeader>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-4 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      {message.role === "assistant" ? (
                        <Streamdown>{message.content}</Streamdown>
                      ) : (
                        <p>{message.content}</p>
                      )}
                      <p
                        className={`text-xs mt-2 ${
                          message.role === "user"
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground"
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg p-4 flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm text-muted-foreground">
                        Analyzing portfolio data...
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask about your portfolio..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Companies</span>
                <span className="font-medium">{metrics?.totalCompanies || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Champions</span>
                <span className="font-medium text-green-600">
                  {metrics?.championsCount || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Avg Priority</span>
                <span className="font-medium">
                  {metrics?.avgPriorityScore.toFixed(1) || "0"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Suggested Queries */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Suggested Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {SUGGESTED_QUERIES.slice(0, 5).map((query, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-left h-auto py-2 px-3"
                    onClick={() => handleSuggestedQuery(query)}
                  >
                    <span className="text-xs line-clamp-2">{query}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Capabilities */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                AI Capabilities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex items-start gap-2">
                  <Building2 className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  <span>Query companies by any attribute</span>
                </div>
                <div className="flex items-start gap-2">
                  <Target className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  <span>Analyze quadrant distributions</span>
                </div>
                <div className="flex items-start gap-2">
                  <TrendingUp className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  <span>Generate strategic recommendations</span>
                </div>
                <div className="flex items-start gap-2">
                  <HelpCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  <span>Answer portfolio questions</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
