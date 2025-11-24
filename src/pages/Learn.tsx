import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Video, Award, TrendingUp, Play, CheckCircle2 } from "lucide-react";

const Learn = () => {
  const [completedChallenges, setCompletedChallenges] = useState<Set<number>>(new Set());

  const tutorials = [
    {
      title: "Budgeting Basics for Students",
      type: "video",
      duration: "12 min",
      icon: Video,
      color: "bg-gradient-primary",
      description: "Learn the fundamentals of budgeting and managing your student finances effectively.",
    },
    {
      title: "Emergency Fund Guide",
      type: "article",
      duration: "5 min read",
      icon: BookOpen,
      color: "bg-gradient-success",
      description: "Discover how to build and maintain an emergency fund for unexpected expenses.",
    },
    {
      title: "Smart Saving Strategies",
      type: "video",
      duration: "15 min",
      icon: Video,
      color: "bg-gradient-accent",
      description: "Master proven techniques to save money without compromising your lifestyle.",
    },
    {
      title: "Investment 101",
      type: "article",
      duration: "8 min read",
      icon: BookOpen,
      color: "bg-gradient-danger",
      description: "Introduction to investments: stocks, mutual funds, and building wealth.",
    },
  ];

  const challenges = [
    { id: 1, title: "Save ₹1000 this week", progress: 75, reward: 50 },
    { id: 2, title: "Track all expenses for 7 days", progress: 100, reward: 100 },
    { id: 3, title: "Reduce food expenses by 20%", progress: 45, reward: 75 },
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
                  <Button variant="outline" className="w-full hover:bg-primary/10 hover:text-primary hover:border-primary transition-all group">
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
        </div>
      </main>
    </div>
  );
};

export default Learn;
