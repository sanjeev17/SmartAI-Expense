import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Analytics = () => {
  const categoryData = [
    { name: "Food & Dining", amount: 6500, color: "bg-gradient-primary", percent: 33 },
    { name: "Travel", amount: 4200, color: "bg-gradient-success", percent: 21 },
    { name: "Shopping", amount: 3800, color: "bg-gradient-accent", percent: 19 },
    { name: "Subscriptions", amount: 2500, color: "bg-gradient-danger", percent: 13 },
    { name: "Entertainment", amount: 2750, color: "bg-primary", percent: 14 },
  ];

  return (
    <div className="min-h-screen bg-gradient-bg">
      <Navigation />
      <main className="lg:ml-64 pt-20 lg:pt-0 p-6">
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-foreground">Analytics</h1>
            <p className="text-muted-foreground">Detailed insights into your spending patterns</p>
          </div>

          <Tabs defaultValue="monthly" className="space-y-6">
            <TabsList className="bg-card/50 backdrop-blur-sm">
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="yearly">Yearly</TabsTrigger>
            </TabsList>

            <TabsContent value="monthly" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pie Chart Placeholder */}
                <Card className="p-6 border-border/50 backdrop-blur-sm bg-card/50">
                  <h3 className="text-xl font-bold text-foreground mb-6">Expense Distribution</h3>
                  <div className="aspect-square flex items-center justify-center bg-muted/20 rounded-lg">
                    <p className="text-muted-foreground">Pie Chart Visualization</p>
                  </div>
                </Card>

                {/* Category Breakdown */}
                <Card className="p-6 border-border/50 backdrop-blur-sm bg-card/50">
                  <h3 className="text-xl font-bold text-foreground mb-6">Category Breakdown</h3>
                  <div className="space-y-4">
                    {categoryData.map((category, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-foreground">{category.name}</span>
                          <span className="text-muted-foreground">₹{category.amount.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full ${category.color} transition-all duration-500`}
                            style={{ width: `${category.percent}%` }}
                          />
                        </div>
                        <div className="text-xs text-muted-foreground text-right">
                          {category.percent}%
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Trend Chart Placeholder */}
                <Card className="p-6 border-border/50 backdrop-blur-sm bg-card/50 lg:col-span-2">
                  <h3 className="text-xl font-bold text-foreground mb-6">Spending Trend</h3>
                  <div className="h-80 flex items-center justify-center bg-muted/20 rounded-lg">
                    <p className="text-muted-foreground">Line/Bar Chart Visualization</p>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="weekly">
              <Card className="p-6 border-border/50 backdrop-blur-sm bg-card/50">
                <p className="text-center text-muted-foreground py-12">Weekly analytics coming soon</p>
              </Card>
            </TabsContent>

            <TabsContent value="yearly">
              <Card className="p-6 border-border/50 backdrop-blur-sm bg-card/50">
                <p className="text-center text-muted-foreground py-12">Yearly analytics coming soon</p>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
