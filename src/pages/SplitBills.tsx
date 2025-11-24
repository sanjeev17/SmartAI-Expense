import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users, Clock } from "lucide-react";

const SplitBills = () => {
  const groups = [
    {
      name: "Roommates",
      members: 4,
      totalOwed: 2500,
      totalOwes: 1200,
      color: "bg-gradient-primary",
    },
    {
      name: "College Friends",
      members: 6,
      totalOwed: 800,
      totalOwes: 0,
      color: "bg-gradient-success",
    },
  ];

  const recentSplits = [
    {
      description: "Dinner at Pizza Place",
      group: "Roommates",
      amount: 1500,
      split: 4,
      status: "pending",
    },
    {
      description: "Movie Tickets",
      group: "College Friends",
      amount: 800,
      split: 4,
      status: "settled",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-bg">
      <Navigation />
      <main className="lg:ml-64 pt-20 lg:pt-0 p-6">
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-foreground">Split Bills</h1>
              <p className="text-muted-foreground">Manage shared expenses with friends</p>
            </div>
            <Button className="bg-gradient-primary hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" />
              New Group
            </Button>
          </div>

          {/* Groups */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {groups.map((group, index) => (
              <Card
                key={index}
                className="p-6 border-border/50 backdrop-blur-sm bg-card/50 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{group.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                      <Users className="w-4 h-4" />
                      <span>{group.members} members</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg ${group.color}`}>
                    <Users className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">You are owed</span>
                    <span className="text-lg font-bold text-success">₹{group.totalOwed}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">You owe</span>
                    <span className="text-lg font-bold text-destructive">₹{group.totalOwes}</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View Details
                </Button>
              </Card>
            ))}
          </div>

          {/* Recent Splits */}
          <Card className="p-6 border-border/50 backdrop-blur-sm bg-card/50">
            <h2 className="text-2xl font-bold text-foreground mb-6">Recent Splits</h2>
            <div className="space-y-4">
              {recentSplits.map((split, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{split.description}</p>
                      <p className="text-sm text-muted-foreground">{split.group}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-foreground">
                      ₹{split.amount / split.split} / person
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-3 h-3" />
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          split.status === "settled"
                            ? "bg-success/10 text-success"
                            : "bg-destructive/10 text-destructive"
                        }`}
                      >
                        {split.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default SplitBills;
