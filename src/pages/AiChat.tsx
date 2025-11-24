import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Mic, Bot } from "lucide-react";

const AiChat = () => {
  const sampleMessages = [
    {
      role: "assistant",
      content: "Hello! I'm your AI financial assistant. I can help you add expenses, check your balance, analyze spending patterns, and provide savings tips. How can I help you today?",
    },
    {
      role: "user",
      content: "Show me my spending this month",
    },
    {
      role: "assistant",
      content: "Your total spending this month is ₹19,750. Here's the breakdown:\n• Food & Dining: ₹6,500 (33%)\n• Travel: ₹4,200 (21%)\n• Shopping: ₹3,800 (19%)\n• Subscriptions: ₹2,500 (13%)\n• Entertainment: ₹2,750 (14%)\n\nYou're spending 15% less compared to last month. Great job!",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-bg">
      <Navigation />
      <main className="lg:ml-64 pt-20 lg:pt-0 p-6">
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in h-[calc(100vh-8rem)] flex flex-col">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-foreground">AI Assistant</h1>
            <p className="text-muted-foreground">Chat with your personal financial advisor</p>
          </div>

          <Card className="flex-1 p-6 border-border/50 backdrop-blur-sm bg-card/50 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {sampleMessages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center shrink-0">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl ${
                      message.role === "user"
                        ? "bg-gradient-primary text-white"
                        : "bg-muted/50 text-foreground"
                    }`}
                  >
                    <p className="whitespace-pre-line text-sm leading-relaxed">{message.content}</p>
                  </div>
                  {message.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center shrink-0 text-white font-semibold">
                      U
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Type your message or use voice command..."
                className="flex-1"
              />
              <Button variant="outline" size="icon">
                <Mic className="w-5 h-5" />
              </Button>
              <Button size="icon" className="bg-gradient-primary hover:opacity-90">
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </Card>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "Add ₹500 for food",
              "Show last month expenses",
              "Budget suggestions",
              "Savings tips",
            ].map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                className="text-sm h-auto py-3 hover:bg-primary/10 hover:text-primary hover:border-primary"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AiChat;
