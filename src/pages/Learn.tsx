import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Video, Award, TrendingUp } from "lucide-react";

const Learn = () => {
  const tutorials = [
    {
      title: "Budgeting Basics for Students",
      type: "video",
      duration: "12 min",
      icon: Video,
      color: "bg-gradient-primary",
    },
    {
      title: "Emergency Fund Guide",
      type: "article",
      duration: "5 min read",
      icon: BookOpen,
      color: "bg-gradient-success",
    },
    {
      title: "Smart Saving Strategies",
      type: "video",
      duration: "15 min",
      icon: Video,
      color: "bg-gradient-accent",
    },
    {
      title: "Investment 101",
      type: "article",
      duration: "8 min read",
      icon: BookOpen,
      color: "bg-gradient-danger",
    },
  ];

  const challenges = [
    { title: "Save ₹1000 this week", progress: 75, reward: 50 },
    { title: "Track all expenses for 7 days", progress: 100, reward: 100 },
    { title: "Reduce food expenses by 20%", progress: 45, reward: 75 },
  ];

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
                  className="p-6 border-border/50 backdrop-blur-sm bg-card/50 hover:shadow-lg transition-all hover:-translate-y-1"
                >
                  <div className={`w-14 h-14 rounded-lg ${tutorial.color} flex items-center justify-center mb-4`}>
                    <tutorial.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">{tutorial.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <span className="px-2 py-1 bg-muted/50 rounded text-xs">{tutorial.type}</span>
                    <span>{tutorial.duration}</span>
                  </div>
                  <Button variant="outline" className="w-full">
                    Start Learning
                  </Button>
                </Card>
              ))}
            </div>
          </div>

          {/* Challenges */}
          <Card className="p-6 border-border/50 backdrop-blur-sm bg-card/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">Weekly Challenges</h2>
              <div className="flex items-center gap-2 text-accent">
                <Award className="w-6 h-6" />
                <span className="font-bold">225 Points</span>
              </div>
            </div>
            <div className="space-y-4">
              {challenges.map((challenge, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-semibold text-foreground">{challenge.title}</p>
                    <span className="text-sm text-accent font-medium">+{challenge.reward} pts</span>
                  </div>
                  <div className="w-full bg-muted/50 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        challenge.progress === 100 ? "bg-gradient-success" : "bg-gradient-primary"
                      }`}
                      style={{ width: `${challenge.progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{challenge.progress}% complete</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Tips Section */}
          <Card className="p-6 border-border/50 backdrop-blur-sm bg-accent/10">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-accent/20">
                <TrendingUp className="w-6 h-6 text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-foreground mb-2">Quick Tip of the Day</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  The 50/30/20 rule: Allocate 50% of your income to needs, 30% to wants, and 20% to savings.
                  Start tracking your expenses today to see where your money goes!
                </p>
                <Button variant="outline" size="sm">
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
