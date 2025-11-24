import { useState, useRef, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Mic, Bot, Sparkles, MicOff } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useTransactions } from "@/hooks/useTransactions";
import { getCategoryTotals } from "@/lib/storage";
import { startOfMonth } from "date-fns";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const AiChat = () => {
  const { transactions, balance, totalIncome, totalExpense } = useTransactions();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your AI financial assistant. I can help you add expenses, check your balance, analyze spending patterns, and provide savings tips. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Setup SpeechRecognition if available
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      recognitionRef.current = null;
      return;
    }

    const recog = new SpeechRecognition();
    recog.lang = "en-IN"; // supports English (India) by default
    recog.interimResults = true;
    recog.maxAlternatives = 1;

    recog.onstart = () => setIsListening(true);
    recog.onend = () => setIsListening(false);

    recog.onresult = (event: any) => {
      let interim = "";
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const res = event.results[i];
        if (res.isFinal) {
          finalTranscript += res[0].transcript;
        } else {
          interim += res[0].transcript;
        }
      }
      // update input with interim + final
      setInput((prev) => (prev ? prev + " " : "") + finalTranscript + interim);
      // if final, optionally send automatically
      if (finalTranscript) {
        // auto-send after a short delay
        setTimeout(() => {
          if (finalTranscript) {
            // do nothing here; user can press send if desired
          }
        }, 300);
      }
    };

    recognitionRef.current = recog;

    return () => {
      try {
        recog.onresult = null;
        recog.onend = null;
        recog.onstart = null;
      } catch {}
    };
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simple AI-like responses based on keywords
    setTimeout(() => {
      let response = "";

      const lowerInput = input.toLowerCase();

      if (lowerInput.includes("balance") || lowerInput.includes("how much")) {
        response = `Your current balance is ₹${balance.toLocaleString()}. You have ₹${totalIncome.toLocaleString()} in income and ₹${totalExpense.toLocaleString()} in expenses.`;
      } else if (lowerInput.includes("spending") || lowerInput.includes("expenses")) {
        const categories = getCategoryTotals("expense", startOfMonth(new Date()), new Date());
        const topCategories = Object.entries(categories)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 3);
        
        response = `Your total spending this month is ₹${totalExpense.toLocaleString()}. Here are your top categories:\n`;
        topCategories.forEach(([cat, amount], i) => {
          const percent = totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0;
          response += `${i + 1}. ${cat}: ₹${amount.toLocaleString()} (${percent}%)\n`;
        });
        response += "\nYou're doing great! Keep tracking your expenses.";
      } else if (lowerInput.includes("save") || lowerInput.includes("tip")) {
        response = "Here are some savings tips:\n\n1. Follow the 50/30/20 rule: 50% for needs, 30% for wants, 20% for savings.\n2. Track every expense to identify spending leaks.\n3. Set up automatic transfers to your savings account.\n4. Cook at home more often to reduce food expenses.\n5. Review and cancel unused subscriptions.\n\nWould you like personalized suggestions based on your spending?";
      } else if (lowerInput.includes("income")) {
        response = `Your total income is ₹${totalIncome.toLocaleString()}. Keep up the great work! Consider allocating 20% of your income to savings and investments.`;
      } else if (lowerInput.includes("transaction") || lowerInput.includes("recent")) {
        const recent = transactions.slice(0, 3);
        if (recent.length === 0) {
          response = "You haven't added any transactions yet. Would you like me to guide you through adding one?";
        } else {
          response = "Here are your recent transactions:\n\n";
          recent.forEach((t, i) => {
            response += `${i + 1}. ${t.description} - ${t.type === "income" ? "+" : "-"}₹${t.amount.toLocaleString()} (${t.category})\n`;
          });
        }
      } else {
        response = "I can help you with:\n• Checking your balance and income\n• Analyzing your spending patterns\n• Providing savings tips\n• Reviewing recent transactions\n\nWhat would you like to know?";
      }

      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
      setIsTyping(false);
    }, 1000);
  };

  const quickActions = [
    "Check my balance",
    "Show spending this month",
    "Give me savings tips",
    "Recent transactions",
  ];

  return (
    <div className="min-h-screen bg-gradient-bg">
      <Navigation />
      <main className="lg:ml-64 pt-20 lg:pt-0 p-6">
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in h-[calc(100vh-8rem)] flex flex-col">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground">AI Assistant</h1>
                <p className="text-muted-foreground">Chat with your personal financial advisor</p>
              </div>
            </div>
          </div>

          <Card className="flex-1 p-6 border-border/50 backdrop-blur-sm bg-card/50 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 scroll-smooth">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 animate-slide-up ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center shrink-0 shadow-sm">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl transition-all hover-scale ${
                      message.role === "user"
                        ? "bg-gradient-primary text-white shadow-glow"
                        : "bg-muted/50 text-foreground"
                    }`}
                  >
                    <p className="whitespace-pre-line text-sm leading-relaxed">{message.content}</p>
                  </div>
                  {message.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center shrink-0 text-white font-semibold shadow-sm">
                      U
                    </div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3 justify-start animate-fade-in">
                  <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center shrink-0">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="max-w-[80%] p-4 rounded-2xl bg-muted/50">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Type your message or use voice command..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1"
                disabled={isTyping}
              />
              <Button
                variant={isListening ? "destructive" : "outline"}
                size="icon"
                className="shrink-0"
                onClick={() => {
                  const recog = recognitionRef.current;
                  if (!recog) {
                    toast({ title: "Voice not supported", description: "Your browser does not support speech recognition." });
                    return;
                  }
                  try {
                    if (isListening) {
                      recog.stop();
                    } else {
                      setInput("");
                      recog.start();
                    }
                  } catch (err) {
                    // fallback toggle
                    if (isListening) {
                      setIsListening(false);
                    } else {
                      setIsListening(true);
                    }
                  }
                }}
              >
                {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </Button>
              <Button
                size="icon"
                className="bg-gradient-primary hover:opacity-90 shrink-0 shadow-glow"
                onClick={handleSend}
                disabled={isTyping || !input.trim()}
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </Card>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="text-sm h-auto py-3 hover:bg-primary/10 hover:text-primary hover:border-primary transition-all hover-scale"
                onClick={() => setInput(action)}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {action}
              </Button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AiChat;
