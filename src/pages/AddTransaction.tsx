import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mic, Plus } from "lucide-react";

const AddTransaction = () => {
  const categories = [
    "Food & Dining",
    "Travel",
    "Shopping",
    "Rent",
    "Subscriptions",
    "Entertainment",
    "Healthcare",
    "Education",
    "Other",
  ];

  return (
    <div className="min-h-screen bg-gradient-bg">
      <Navigation />
      <main className="lg:ml-64 pt-20 lg:pt-0 p-6">
        <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-foreground">Add Transaction</h1>
            <p className="text-muted-foreground">Record your income or expense</p>
          </div>

          <Card className="p-8 border-border/50 backdrop-blur-sm bg-card/50">
            <form className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="expense">Expense</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  className="text-2xl font-semibold h-14"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category.toLowerCase()}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" placeholder="Enter description" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" />
              </div>

              <div className="flex gap-4">
                <Button className="flex-1 bg-gradient-primary hover:opacity-90 transition-opacity">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Transaction
                </Button>
                <Button variant="outline" size="icon" className="shrink-0">
                  <Mic className="w-5 h-5" />
                </Button>
              </div>
            </form>
          </Card>

          <Card className="p-6 border-border/50 backdrop-blur-sm bg-accent/10">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-accent/20">
                <Mic className="w-6 h-6 text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">Voice Command</h3>
                <p className="text-sm text-muted-foreground">
                  Try saying: "Add ₹500 for food today" or "Add income ₹5000 for freelance"
                </p>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AddTransaction;
