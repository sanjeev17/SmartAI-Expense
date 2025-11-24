import { Card } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, TrendingUp, Wallet, PiggyBank } from "lucide-react";

const Dashboard = () => {
  const stats = [
    {
      title: "Total Balance",
      value: "₹45,250",
      change: "+12.5%",
      trend: "up",
      icon: Wallet,
      gradient: "bg-gradient-primary",
    },
    {
      title: "Total Income",
      value: "₹65,000",
      change: "+8.2%",
      trend: "up",
      icon: ArrowUpRight,
      gradient: "bg-gradient-success",
    },
    {
      title: "Total Expenses",
      value: "₹19,750",
      change: "-3.4%",
      trend: "down",
      icon: ArrowDownRight,
      gradient: "bg-gradient-danger",
    },
    {
      title: "Savings",
      value: "₹25,500",
      change: "+15.8%",
      trend: "up",
      icon: PiggyBank,
      gradient: "bg-gradient-accent",
    },
  ];

  const recentTransactions = [
    { id: 1, name: "Grocery Shopping", category: "Food", amount: -2500, date: "Today" },
    { id: 2, name: "Salary", category: "Income", amount: 50000, date: "Yesterday" },
    { id: 3, name: "Uber Ride", category: "Travel", amount: -350, date: "2 days ago" },
    { id: 4, name: "Netflix", category: "Subscription", amount: -799, date: "3 days ago" },
    { id: 5, name: "Freelance Project", category: "Income", amount: 15000, date: "4 days ago" },
  ];

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
            <Card
              key={index}
              className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-slide-up border-border/50 backdrop-blur-sm bg-card/50"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  <div className="flex items-center gap-1">
                    {stat.trend === "up" ? (
                      <TrendingUp className="w-4 h-4 text-success" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-destructive" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        stat.trend === "up" ? "text-success" : "text-destructive"
                      }`}
                    >
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-xl ${stat.gradient} shadow-glow`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
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
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        transaction.amount > 0
                          ? "bg-success/10 text-success"
                          : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {transaction.amount > 0 ? (
                        <ArrowUpRight className="w-5 h-5" />
                      ) : (
                        <ArrowDownRight className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{transaction.name}</p>
                      <p className="text-sm text-muted-foreground">{transaction.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-bold text-lg ${
                        transaction.amount > 0 ? "text-success" : "text-destructive"
                      }`}
                    >
                      {transaction.amount > 0 ? "+" : ""}₹{Math.abs(transaction.amount).toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">{transaction.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
