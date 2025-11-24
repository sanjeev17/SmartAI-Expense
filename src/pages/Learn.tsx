import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Video, Award, TrendingUp, Play, CheckCircle2, Star, Sparkles } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const Learn = () => {
  const [completedChallenges, setCompletedChallenges] = useState<Set<number>>(new Set());

  const COMPLETED_KEY = "smartai_completed_challenges";

  // Load completed challenges from localStorage on mount
  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      const raw = window.localStorage.getItem(COMPLETED_KEY);
      if (raw) {
        const ids: number[] = JSON.parse(raw as string);
        setCompletedChallenges(new Set(ids));
      }
    } catch {
      // ignore
    }
  }, []);

  // Persist completed challenges when they change
  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      window.localStorage.setItem(COMPLETED_KEY, JSON.stringify(Array.from(completedChallenges)));
    } catch {
      // ignore
    }
  }, [completedChallenges]);

  const tutorials = [
    {
      title: "Budgeting Basics for Students",
      type: "video",
      duration: "12 min",
      icon: Video,
      color: "bg-gradient-primary",
      description: "Learn the fundamentals of budgeting and managing your student finances effectively.",
      url: "https://www.khanacademy.org/college-careers-more/personal-finance",
    },
    {
      title: "Emergency Fund Guide",
      type: "article",
      duration: "5 min read",
      icon: BookOpen,
      color: "bg-gradient-success",
      description: "Discover how to build and maintain an emergency fund for unexpected expenses.",
      url: "https://www.investopedia.com/how-to-build-an-emergency-fund-5073090",
    },
    {
      title: "Smart Saving Strategies",
      type: "video",
      duration: "15 min",
      icon: Video,
      color: "bg-gradient-accent",
      description: "Master proven techniques to save money without compromising your lifestyle.",
      url: "https://www.nerdwallet.com/article/finance/how-to-save-money",
    },
    {
      title: "Investment 101",
      type: "article",
      duration: "8 min read",
      icon: BookOpen,
      color: "bg-gradient-danger",
      description: "Introduction to investments: stocks, mutual funds, and building wealth.",
      url: "https://www.investopedia.com/investing-4427785",
    },
  ];

  const videoResources = [
    {
      title: "CrashCourse — Personal Finance (playlist)",
      url: "https://www.youtube.com/playlist?list=PL8dPuuaLjXtOPRKzVLY0jJY-uHOH9KVU6",
      source: "CrashCourse",
      lang: "en",
      category: "Budgeting",
      summary: "Short animated lessons on budgeting, credit, and personal finance basics.",
    },
    {
      title: "Khan Academy — Personal Finance (course)",
      url: "https://www.khanacademy.org/college-careers-more/personal-finance",
      source: "Khan Academy",
      lang: "en",
      category: "Foundations",
      summary: "Comprehensive, free course covering fundamentals like budgeting and saving.",
    },
    {
      title: "The Financial Diet — Budgeting & Money Tips (channel)",
      url: "https://www.youtube.com/c/TheFinancialDiet",
      source: "The Financial Diet",
      lang: "en",
      category: "Saving",
      summary: "Practical personal stories and tips for saving, frugality, and money habits.",
    },
    {
      title: "Khan Academy (YouTube channel)",
      url: "https://www.youtube.com/user/khanacademy",
      source: "Khan Academy",
      lang: "en",
      category: "Foundations",
      summary: "Short video explanations of core finance concepts and money math.",
    },
    {
      title: "Rachana Ranade — Personal Finance (Hindi)",
      url: "https://www.youtube.com/c/RachanaRanadeOfficial",
      source: "Rachana Ranade",
      lang: "hi",
      category: "Investing",
      summary: "Hindi-language videos explaining investing, markets and personal finance.",
    },
    {
      title: "Pranjal Kamra — Investing & Personal Finance (Hindi)",
      url: "https://www.youtube.com/c/PranjalKamraOfficial",
      source: "Pranjal Kamra",
      lang: "hi",
      category: "Investing",
      summary: "Hindi tutorials on investing strategies, mutual funds, and long-term planning.",
    },
  ];

  const articleResources = [
    {
      title: "How to Build an Emergency Fund - Investopedia",
      url: "https://www.investopedia.com/how-to-build-an-emergency-fund-5073090",
      source: "Investopedia",
      category: "Emergency Fund",
      summary: "Step-by-step guide to saving for unexpected expenses and building resilience.",
    },
    {
      title: "How to Save Money - NerdWallet",
      url: "https://www.nerdwallet.com/article/finance/how-to-save-money",
      source: "NerdWallet",
      category: "Saving",
      summary: "Practical saving techniques and actionable tips to cut expenses and grow savings.",
    },
    {
      title: "Personal Finance - Khan Academy",
      url: "https://www.khanacademy.org/college-careers-more/personal-finance",
      source: "Khan Academy",
      category: "Foundations",
      summary: "Readable lessons covering budgeting, credit, and the basics of investing.",
    },
  ];

  const challenges = [
    { id: 1, title: "Save ₹1500 this week", progress: 60, reward: 200, category: "Saving" },
    { id: 2, title: "Track all expenses for 7 days", progress: 100, reward: 300, category: "Tracking" },
    { id: 3, title: "Cook at home 5 days", progress: 45, reward: 150, category: "Frugality" },
    { id: 4, title: "Review subscriptions & save", progress: 20, reward: 100, category: "Review" },
  ];

  const totalPoints = challenges
    .filter((c) => completedChallenges.has(c.id))
    .reduce((sum, c) => sum + c.reward, 0);

  const toggleChallenge = (id: number) => {
    setCompletedChallenges((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
        const ch = challenges.find((c) => c.id === id);
        if (ch) {
          toast({ title: "Challenge completed!", description: `You earned ${ch.reward} points.` });
        }
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-bg">
      <Navigation />
      <main className="lg:ml-64 pt-20 lg:pt-0 p-6">
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-foreground">Financial Learning</h1>
            <p className="text-muted-foreground">Master money management with our resources</p>
          </div>

          {/* Tutorials */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Tutorials & Guides</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {tutorials.map((tutorial, index) => (
                <Card
                  key={index}
                  className="p-6 border-border/50 backdrop-blur-sm bg-card/50 hover:shadow-lg transition-all hover:-translate-y-1 animate-scale-in group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`w-14 h-14 rounded-lg ${tutorial.color} flex items-center justify-center mb-4 shadow-glow transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                    <tutorial.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2 line-clamp-2">{tutorial.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{tutorial.description}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <span className="px-2 py-1 bg-muted/50 rounded text-xs font-medium">{tutorial.type}</span>
                    <span>{tutorial.duration}</span>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full hover:bg-primary/10 hover:text-primary hover:border-primary transition-all group"
                    onClick={() => {
                      if (tutorial.url) window.open(tutorial.url, "_blank", "noopener,noreferrer");
                    }}
                  >
                    {tutorial.type === "video" ? (
                      <Play className="w-4 h-4 mr-2" />
                    ) : (
                      <BookOpen className="w-4 h-4 mr-2" />
                    )}
                    Start Learning
                  </Button>
                </Card>
              ))}
            </div>
          </div>

          {/* Challenges */}
          <Card className="p-6 border-border/50 backdrop-blur-sm bg-card/50 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">Weekly Challenges</h2>
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-accent rounded-lg shadow-glow">
                <Award className="w-6 h-6 text-white" />
                <span className="font-bold text-white">{totalPoints} Points</span>
              </div>
            </div>
            <div className="space-y-4">
              {challenges.map((challenge, index) => {
                const isCompleted = completedChallenges.has(challenge.id);
                return (
                  <div
                    key={challenge.id}
                    className="p-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition-all hover-scale animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`rounded-full ${isCompleted ? "bg-success/20" : "bg-muted"}`}
                          onClick={() => toggleChallenge(challenge.id)}
                        >
                          {isCompleted && <CheckCircle2 className="w-5 h-5 text-success" />}
                        </Button>
                        <p className={`font-semibold ${isCompleted ? "text-muted-foreground line-through" : "text-foreground"}`}>
                          {challenge.title}
                        </p>
                      </div>
                      <span className="text-sm text-accent font-medium">+{challenge.reward} pts</span>
                    </div>
                    <div className="w-full bg-muted/50 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          challenge.progress === 100 || isCompleted ? "bg-gradient-success" : "bg-gradient-primary"
                        }`}
                        style={{ width: `${isCompleted ? 100 : challenge.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {isCompleted ? "Completed!" : `${challenge.progress}% complete`}
                    </p>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Tips Section */}
          <Card className="p-6 border-border/50 backdrop-blur-sm bg-accent/10 animate-slide-up">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-accent/20 shadow-sm">
                <TrendingUp className="w-6 h-6 text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-foreground mb-2">Quick Tip of the Day</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  The 50/30/20 rule: Allocate 50% of your income to needs, 30% to wants, and 20% to savings.
                  Start tracking your expenses today to see where your money goes!
                </p>
                <Button variant="outline" size="sm" className="hover:bg-accent/10 hover:text-accent hover:border-accent transition-all">
                  Learn More
                </Button>
              </div>
            </div>
          </Card>

          {/* Curated Resources (grouped by category) */}
          <Card className="p-6 border-border/50 backdrop-blur-sm bg-card/50 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">Curated Resources</h2>
              <p className="text-sm text-muted-foreground">Grouped by topic for quick discovery</p>
            </div>

            {/* build combined list and group by category */}
            {(() => {
              const combined: Array<any> = [
                ...videoResources.map((v) => ({ ...v, type: "video" })),
                ...articleResources.map((a) => ({ ...a, type: "article" })),
              ];

              const groups = combined.reduce((acc: Record<string, any[]>, item) => {
                const cat = item.category || "General";
                if (!acc[cat]) acc[cat] = [];
                acc[cat].push(item);
                return acc;
              }, {} as Record<string, any[]>);

              const ordered = Object.keys(groups).sort();

              return (
                <div className="space-y-6">
                  {ordered.map((cat) => (
                    <div key={cat}>
                      <h3 className="font-semibold text-lg mb-3">{cat}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {groups[cat].map((r) => (
                          <div key={r.url} className="p-3 rounded-md bg-muted/10">
                            <div className="flex items-start justify-between">
                              <div className="pr-4">
                                <p className="font-medium text-foreground">{r.title}</p>
                                <p className="text-xs text-muted-foreground">{r.source}{r.lang ? ` • ${r.lang === 'hi' ? 'Hindi' : 'English'}` : ''}</p>
                                {r.summary && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{r.summary}</p>}
                              </div>
                              <div className="flex-shrink-0">
                                {r.type === "video" ? (
                                  <Button variant="ghost" onClick={() => window.open(r.url, "_blank", "noopener,noreferrer")}>Watch</Button>
                                ) : (
                                  <Button variant="ghost" onClick={() => window.open(r.url, "_blank", "noopener,noreferrer")}>Read</Button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Learn;
