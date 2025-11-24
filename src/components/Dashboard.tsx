import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, TrendingUp, Wallet, PiggyBank } from "lucide-react";
import { useTransactions } from "@/hooks/useTransactions";
import { initializeSampleData } from "@/lib/storage";
import { formatDistance } from "date-fns";
import { StatsCard } from "@/components/StatsCard";

const Dashboard = () => {
  const { transactions, balance, totalIncome, totalExpense } = useTransactions();

  useEffect(() => {
    initializeSampleData();
  }, []);

  const savings = balance;
  const recentTransactions = transactions.slice(0, 5);

  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return "+0%";
    const change = ((current - previous) / previous) * 100;
    return `${change > 0 ? "+" : ""}${change.toFixed(1)}%`;
  };

  const stats = [
    {
      title: "Total Balance",
      value: `₹${balance.toLocaleString()}`,
      change: "+12.5%",
      trend: "up" as const,
      icon: Wallet,
      gradient: "bg-gradient-primary",
    },
    {
      title: "Total Income",
      value: `₹${totalIncome.toLocaleString()}`,
      change: "+8.2%",
      trend: "up" as const,
      icon: ArrowUpRight,
      gradient: "bg-gradient-success",
    },
    {
      title: "Total Expenses",
      value: `₹${totalExpense.toLocaleString()}`,
      change: "-3.4%",
      trend: "down" as const,
      icon: ArrowDownRight,
      gradient: "bg-gradient-danger",
    },
    {
      title: "Savings",
      value: `₹${savings.toLocaleString()}`,
      change: "+15.8%",
      trend: "up" as const,
      icon: PiggyBank,
      gradient: "bg-gradient-accent",
    },
  ];

  const getTimeAgo = (date: string) => {
    try {
      return formatDistance(new Date(date), new Date(), { addSuffix: true });
    } catch {
      return date;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-bg p-6">
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Track your expenses and manage your finances</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatsCard
              key={index}
              {...stat}
              delay={index * 100}
            />
          ))}
        </div>

        {/* Recent Transactions */}
        <Card className="p-6 border-border/50 backdrop-blur-sm bg-card/50 animate-slide-up">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Recent Transactions</h2>
              <button className="text-primary hover:text-primary-glow transition-colors text-sm font-medium">
                View All
              </button>
            </div>
            {recentTransactions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No transactions yet. Add your first transaction!</p>
            ) : (
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 rounded-lg hover:bg-muted/50 transition-all duration-200 hover-scale"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform ${
                          transaction.type === "income"
                            ? "bg-success/10 text-success"
                            : "bg-destructive/10 text-destructive"
                        }`}
                      >
                        {transaction.type === "income" ? (
                          <ArrowUpRight className="w-5 h-5" />
                        ) : (
                          <ArrowDownRight className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{transaction.description}</p>
                        <p className="text-sm text-muted-foreground">{transaction.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-bold text-lg ${
                          transaction.type === "income" ? "text-success" : "text-destructive"
                        }`}
                      >
                        {transaction.type === "income" ? "+" : "-"}₹{transaction.amount.toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">{getTimeAgo(transaction.date)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
