import { useState, useMemo } from "react";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from "recharts";
import { getCategoryTotals, getTransactionsByDateRange } from "@/lib/storage";
import { startOfWeek, startOfMonth, startOfYear, format } from "date-fns";

const COLORS = ["#14b8a6", "#10b981", "#8b5cf6", "#ef4444", "#f59e0b", "#06b6d4", "#ec4899"];

const Analytics = () => {
  const [period, setPeriod] = useState<"weekly" | "monthly" | "yearly">("monthly");

  const { categoryData, trendData, totalExpense } = useMemo(() => {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case "weekly":
        startDate = startOfWeek(now);
        break;
      case "monthly":
        startDate = startOfMonth(now);
        break;
      case "yearly":
        startDate = startOfYear(now);
        break;
    }

    const categories = getCategoryTotals("expense", startDate, now);
    const transactions = getTransactionsByDateRange(startDate, now);

    const categoryData = Object.entries(categories).map(([name, value]) => ({
      name,
      value,
      percent: 0,
    }));

    const total = categoryData.reduce((sum, item) => sum + item.value, 0);
    categoryData.forEach((item) => {
      item.percent = total > 0 ? Math.round((item.value / total) * 100) : 0;
    });

    // Generate trend data by day
    const trendMap = new Map<string, { income: number; expense: number }>();
    transactions.forEach((t) => {
      const dateKey = format(new Date(t.date), "MMM dd");
      const existing = trendMap.get(dateKey) || { income: 0, expense: 0 };
      if (t.type === "income") {
        existing.income += t.amount;
      } else {
        existing.expense += t.amount;
      }
      trendMap.set(dateKey, existing);
    });

    const trendData = Array.from(trendMap.entries())
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-10);

    return { categoryData, trendData, totalExpense: total };
  }, [period]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card/95 backdrop-blur-sm border border-border p-3 rounded-lg shadow-lg">
          <p className="font-semibold text-foreground">{payload[0].name}</p>
          <p className="text-sm text-muted-foreground">
            ₹{payload[0].value.toLocaleString()} ({payload[0].payload.percent}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-bg">
      <Navigation />
      <main className="lg:ml-64 pt-20 lg:pt-0 p-6">
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-foreground">Analytics</h1>
            <p className="text-muted-foreground">Detailed insights into your spending patterns</p>
          </div>

          <Tabs value={period} onValueChange={(v) => setPeriod(v as any)} className="space-y-6">
            <TabsList className="bg-card/50 backdrop-blur-sm">
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="yearly">Yearly</TabsTrigger>
            </TabsList>

            <TabsContent value={period} className="space-y-6">
              {categoryData.length === 0 ? (
                <Card className="p-12 border-border/50 backdrop-blur-sm bg-card/50 text-center">
                  <p className="text-muted-foreground">No expense data for this period. Start adding transactions!</p>
                </Card>
              ) : (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Pie Chart */}
                    <Card className="p-6 border-border/50 backdrop-blur-sm bg-card/50 animate-scale-in">
                      <h3 className="text-xl font-bold text-foreground mb-6">Expense Distribution</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${percent}%`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            animationBegin={0}
                            animationDuration={800}
                          >
                            {categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </Card>

                    {/* Category Breakdown */}
                    <Card className="p-6 border-border/50 backdrop-blur-sm bg-card/50 animate-scale-in" style={{ animationDelay: "100ms" }}>
                      <h3 className="text-xl font-bold text-foreground mb-6">Category Breakdown</h3>
                      <div className="space-y-4">
                        {categoryData.map((category, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-medium text-foreground">{category.name}</span>
                              <span className="text-muted-foreground">₹{category.value.toLocaleString()}</span>
                            </div>
                            <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden">
                              <div
                                className="h-full transition-all duration-500 hover-scale"
                                style={{
                                  width: `${category.percent}%`,
                                  backgroundColor: COLORS[index % COLORS.length],
                                }}
                              />
                            </div>
                            <div className="text-xs text-muted-foreground text-right">
                              {category.percent}%
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>

                    {/* Trend Chart */}
                    <Card className="p-6 border-border/50 backdrop-blur-sm bg-card/50 lg:col-span-2 animate-slide-up">
                      <h3 className="text-xl font-bold text-foreground mb-6">Spending Trend</h3>
                      {trendData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={trendData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                            <YAxis stroke="hsl(var(--muted-foreground))" />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "hsl(var(--card))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "0.5rem",
                              }}
                            />
                            <Legend />
                            <Line
                              type="monotone"
                              dataKey="income"
                              stroke="#10b981"
                              strokeWidth={2}
                              dot={{ fill: "#10b981", r: 4 }}
                              activeDot={{ r: 6 }}
                              animationDuration={1000}
                            />
                            <Line
                              type="monotone"
                              dataKey="expense"
                              stroke="#ef4444"
                              strokeWidth={2}
                              dot={{ fill: "#ef4444", r: 4 }}
                              activeDot={{ r: 6 }}
                              animationDuration={1000}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-80 flex items-center justify-center bg-muted/20 rounded-lg">
                          <p className="text-muted-foreground">Not enough data for trend analysis</p>
                        </div>
                      )}
                    </Card>
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
