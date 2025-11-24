import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users, Clock } from "lucide-react";
import { getSplitGroups, getSplitExpenses, initializeSplitData } from "@/lib/splitStorage";
import { formatDistance } from "date-fns";

const SplitBills = () => {
  const [groups, setGroups] = useState(() => getSplitGroups());
  const [expenses, setExpenses] = useState(() => getSplitExpenses());

  useEffect(() => {
    initializeSplitData();
    setGroups(getSplitGroups());
    setExpenses(getSplitExpenses());
  }, []);

  const recentSplits = expenses.slice(0, 5);

  const groupColors = [
    "bg-gradient-primary",
    "bg-gradient-success",
    "bg-gradient-accent",
    "bg-gradient-danger",
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
            <Button className="bg-gradient-primary hover:opacity-90 shadow-glow">
              <Plus className="w-4 h-4 mr-2" />
              New Group
            </Button>
          </div>

          {/* Groups */}
          {groups.length === 0 ? (
            <Card className="p-12 border-border/50 backdrop-blur-sm bg-card/50 text-center">
              <p className="text-muted-foreground">No groups yet. Create your first group to start splitting expenses!</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {groups.map((group, index) => (
                <Card
                  key={group.id}
                  className="p-6 border-border/50 backdrop-blur-sm bg-card/50 hover:shadow-lg transition-all hover:-translate-y-1 animate-scale-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{group.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <Users className="w-4 h-4" />
                        <span>{group.members.length} members</span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg ${groupColors[index % groupColors.length]} shadow-glow`}>
                      <Users className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center p-3 bg-success/10 rounded-lg">
                      <span className="text-sm font-medium text-success">You are owed</span>
                      <span className="text-lg font-bold text-success">₹{group.totalOwed.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-destructive/10 rounded-lg">
                      <span className="text-sm font-medium text-destructive">You owe</span>
                      <span className="text-lg font-bold text-destructive">₹{group.totalOwes.toLocaleString()}</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full hover:bg-primary/10 hover:text-primary hover:border-primary transition-all">
                    View Details
                  </Button>
                </Card>
              ))}
            </div>
          )}

          {/* Recent Splits */}
          {recentSplits.length > 0 && (
            <Card className="p-6 border-border/50 backdrop-blur-sm bg-card/50 animate-slide-up">
              <h2 className="text-2xl font-bold text-foreground mb-6">Recent Splits</h2>
              <div className="space-y-4">
                {recentSplits.map((split) => {
                  const group = groups.find((g) => g.id === split.groupId);
                  const amountPerPerson = split.amount / split.splitBetween.length;

                  return (
                    <div
                      key={split.id}
                      className="flex items-center justify-between p-4 rounded-lg hover:bg-muted/50 transition-all hover-scale"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{split.description}</p>
                          <p className="text-sm text-muted-foreground">{group?.name || "Unknown Group"}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-foreground">
                          ₹{amountPerPerson.toFixed(0)} / person
                        </p>
                        <div className="flex items-center gap-2 mt-1 justify-end">
                          <Clock className="w-3 h-3 text-muted-foreground" />
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
                  );
                })}
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default SplitBills;
