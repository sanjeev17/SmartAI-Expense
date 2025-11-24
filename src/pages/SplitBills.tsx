import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users, Clock } from "lucide-react";
import { getSplitGroups, getSplitExpenses, initializeSplitData, saveSplitGroup, saveSplitExpense } from "@/lib/splitStorage";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
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

  // New Group modal state
  const [isNewGroupOpen, setIsNewGroupOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupMembers, setNewGroupMembers] = useState("");

  // Add Expense modal state
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [expenseDescription, setExpenseDescription] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expensePaidBy, setExpensePaidBy] = useState("");
  const [expenseSplitBetween, setExpenseSplitBetween] = useState("");
  const [expenseGroupId, setExpenseGroupId] = useState<string>(groups[0]?.id || "");

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
            <div className="flex items-center gap-3">
              <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-accent hover:opacity-90 shadow-glow">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Expense
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Expense</DialogTitle>
                    <DialogDescription>Add a shared expense for a group.</DialogDescription>
                  </DialogHeader>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                        if (groups.length === 0) {
                          toast({ title: "No group", description: "Create a group before adding an expense." });
                          return;
                        }

                        const groupId = expenseGroupId || groups[0]?.id || "";
                        const description = expenseDescription.trim();
                        const amount = Number(parseFloat(expenseAmount || "0") || 0);
                        const paidBy = expensePaidBy.trim() || "You";
                        const splitBetweenArr = expenseSplitBetween
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean);

                        if (!description) {
                          toast({ title: "Description required", description: "Please enter an expense description." });
                          return;
                        }

                        if (!(amount > 0)) {
                          toast({ title: "Invalid amount", description: "Enter a valid amount greater than 0." });
                          return;
                        }

                        const splitBetween = splitBetweenArr.length ? splitBetweenArr : [paidBy];
                        const date = new Date().toISOString().split("T")[0];

                        saveSplitExpense({
                          groupId,
                          description,
                          amount,
                          paidBy,
                          splitBetween,
                          status: "pending",
                          date,
                        });

                        // Refresh both expenses and groups (totals recomputed in storage)
                        setExpenses(getSplitExpenses());
                        setGroups(getSplitGroups());
                        setIsAddExpenseOpen(false);
                        setExpenseDescription("");
                        setExpenseAmount("");
                        setExpensePaidBy("");
                        setExpenseSplitBetween("");
                        setExpenseGroupId(groups[0]?.id || "");
                        toast({ title: "Expense added", description: `${description} added to group` });
                    }}
                  >
                    <div className="grid gap-2">
                      <div className="grid grid-cols-1 gap-1">
                        <Label>Group</Label>
                        <Select value={expenseGroupId} onValueChange={(val) => setExpenseGroupId(val)}>
                          <SelectTrigger>
                            <SelectValue>{groups.find((g) => g.id === expenseGroupId)?.name || "Select group"}</SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {groups.map((g) => (
                              <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-1 gap-1">
                        <Label>Description</Label>
                        <Input value={expenseDescription} onChange={(e) => setExpenseDescription(e.target.value)} placeholder="Dinner" />
                      </div>
                      <div className="grid grid-cols-1 gap-1">
                        <Label>Amount</Label>
                        <Input value={expenseAmount} onChange={(e) => setExpenseAmount(e.target.value)} placeholder="1500" />
                      </div>
                      <div className="grid grid-cols-1 gap-1">
                        <Label>Paid By</Label>
                        <Input value={expensePaidBy} onChange={(e) => setExpensePaidBy(e.target.value)} placeholder="You" />
                      </div>
                      <div className="grid grid-cols-1 gap-1">
                        <Label>Split Between</Label>
                        <Input value={expenseSplitBetween} onChange={(e) => setExpenseSplitBetween(e.target.value)} placeholder="You, John, Sarah" />
                      </div>
                    </div>
                    <DialogFooter className="mt-4">
                      <Button type="submit" className="bg-gradient-accent">Add</Button>
                      <Button variant="ghost" onClick={() => setIsAddExpenseOpen(false)}>Cancel</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              <Dialog open={isNewGroupOpen} onOpenChange={setIsNewGroupOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-primary hover:opacity-90 shadow-glow">
                    <Plus className="w-4 h-4 mr-2" />
                    New Group
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Group</DialogTitle>
                    <DialogDescription>Add members (comma separated) and create a new split group.</DialogDescription>
                  </DialogHeader>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const name = newGroupName.trim();
                      if (!name) {
                        toast({ title: "Group name required", description: "Please enter a group name." });
                        return;
                      }

                      const members = newGroupMembers
                        .split(",")
                        .map((m) => m.trim())
                        .filter(Boolean);

                      const created = saveSplitGroup({
                        name: name || "New Group",
                        members: members.length ? members : ["You"],
                        totalOwed: 0,
                        totalOwes: 0,
                      });

                      // refresh local state
                      setGroups(getSplitGroups());
                      setExpenseGroupId(created.id);
                      setIsNewGroupOpen(false);
                      setNewGroupName("");
                      setNewGroupMembers("");
                      toast({ title: "Group created", description: `Created ${created.name}` });
                    }}
                  >
                    <div className="grid gap-2">
                      <div className="grid grid-cols-1 gap-1">
                        <Label>Group Name</Label>
                        <Input value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} placeholder="Roommates" />
                      </div>
                      <div className="grid grid-cols-1 gap-1">
                        <Label>Members</Label>
                        <Input value={newGroupMembers} onChange={(e) => setNewGroupMembers(e.target.value)} placeholder="You, John, Sarah" />
                      </div>
                    </div>
                    <DialogFooter className="mt-4">
                      <Button type="submit" className="bg-gradient-primary">Create</Button>
                      <Button variant="ghost" onClick={() => setIsNewGroupOpen(false)}>Cancel</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
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
