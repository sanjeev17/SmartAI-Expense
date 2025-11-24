import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, TrendingUp, Wallet, PiggyBank, Trash } from "lucide-react";
import { useTransactions } from "@/hooks/useTransactions";
import { initializeSampleData } from "@/lib/storage";
import { formatDistance } from "date-fns";
import { StatsCard } from "@/components/StatsCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

const Dashboard = () => {
  const { transactions, balance, totalIncome, totalExpense, removeTransaction, restoreTransaction, refresh } = useTransactions();
  const { toast } = useToast();

  useEffect(() => {
    initializeSampleData();
  }, []);

  const savings = balance;
  const recentTransactions = transactions.slice(0, 5);
  const [statDetailOpen, setStatDetailOpen] = useState(false);
  const [statDetailKey, setStatDetailKey] = useState<string | null>(null);
  const [viewAllOpen, setViewAllOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<null | any>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<null | any>(null);

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

        {/* Stat Detail Modal */}
        <Dialog open={statDetailOpen} onOpenChange={setStatDetailOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{statDetailKey}</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              {/* show simple details based on selected stat */}
              {statDetailKey === "Total Balance" && (
                <div>
                  <p className="text-sm text-muted-foreground">Current balance combines income and expenses from your transactions.</p>
                  <p className="mt-2 font-semibold">Balance: ₹{balance.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground mt-2">Recent activity:</p>
                  <div className="space-y-2 mt-2">
                    {transactions.slice(0,5).map((t) => (
                      <div key={t.id} className="flex items-center justify-between p-2 rounded-md bg-muted/10">
                        <div>
                          <p className="font-medium">{t.description}</p>
                          <p className="text-xs text-muted-foreground">{t.category} • {t.date}</p>
                        </div>
                        <div className={`font-semibold ${t.type === 'income' ? 'text-success' : 'text-destructive'}`}>{t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {statDetailKey === "Total Income" && (
                <div>
                  <p className="text-sm text-muted-foreground">Total income this period: ₹{totalIncome.toLocaleString()}</p>
                  <p className="mt-2 font-medium">Top income sources:</p>
                  <ul className="list-disc pl-5 mt-2 text-sm text-muted-foreground">
                    {Object.entries((() => {
                      const map: Record<string, number> = {};
                      transactions.filter(t => t.type === 'income').forEach(t => map[t.category] = (map[t.category]||0) + t.amount);
                      return map;
                    })()).sort((a:any,b:any)=> b[1]-a[1]).slice(0,5).map(([cat, amt])=> <li key={cat}>{cat}: ₹{amt.toLocaleString()}</li>)}
                  </ul>
                </div>
              )}

              {statDetailKey === "Total Expenses" && (
                <div>
                  <p className="text-sm text-muted-foreground">Total expenses this period: ₹{totalExpense.toLocaleString()}</p>
                  <p className="mt-2 font-medium">Top expense categories:</p>
                  <ul className="list-disc pl-5 mt-2 text-sm text-muted-foreground">
                    {Object.entries((() => {
                      const map: Record<string, number> = {};
                      transactions.filter(t => t.type === 'expense').forEach(t => map[t.category] = (map[t.category]||0) + t.amount);
                      return map;
                    })()).sort((a:any,b:any)=> b[1]-a[1]).slice(0,5).map(([cat, amt])=> <li key={cat}>{cat}: ₹{amt.toLocaleString()}</li>)}
                  </ul>
                </div>
              )}

              {statDetailKey === "Savings" && (
                <div>
                  <p className="text-sm text-muted-foreground">Savings represent the current net balance. Consider allocating a portion toward emergency funds and investments.</p>
                  <p className="mt-2 font-semibold">Savings: ₹{savings.toLocaleString()}</p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setStatDetailOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatsCard
              key={index}
              {...stat}
              delay={index * 100}
              onClick={() => {
                setStatDetailKey(stat.title);
                setStatDetailOpen(true);
              }}
            />
          ))}
        </div>

        {/* Recent Transactions */}
        <Card className="p-6 border-border/50 backdrop-blur-sm bg-card/50 animate-slide-up">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Recent Transactions</h2>
              <Dialog open={viewAllOpen} onOpenChange={setViewAllOpen}>
                <DialogTrigger asChild>
                  <Button variant="link" className="text-primary hover:text-primary-glow transition-colors text-sm font-medium">View All</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>All Transactions</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 max-h-[60vh] overflow-y-auto mt-4">
                    {transactions.length === 0 ? (
                      <p className="text-muted-foreground">No transactions available.</p>
                    ) : (
                      transactions.map((t) => (
                        <div key={t.id} className="flex items-center justify-between p-3 rounded-md bg-muted/10">
                          <div>
                            <p className="font-medium text-foreground">{t.description}</p>
                            <p className="text-xs text-muted-foreground">{t.category} • {t.date}</p>
                          </div>
                            <div className="flex items-center gap-2">
                            <p className={`font-bold ${t.type === 'income' ? 'text-success' : 'text-destructive'}`}>{t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString()}</p>
                            <Button variant="ghost" size="icon" onClick={() => { setTransactionToDelete(t); setConfirmDeleteOpen(true); }}>
                              <Trash className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <DialogFooter>
                    <Button variant="ghost" onClick={() => setViewAllOpen(false)}>Close</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            {recentTransactions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No transactions yet. Add your first transaction!</p>
            ) : (
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedTransaction(transaction)}
                    className="flex items-center justify-between p-4 rounded-lg hover:bg-muted/50 transition-all duration-200 hover-scale cursor-pointer"
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

        {/* Transaction Detail Modal */}
        <Dialog open={!!selectedTransaction} onOpenChange={() => setSelectedTransaction(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Transaction Details</DialogTitle>
            </DialogHeader>
            {selectedTransaction && (
              <div className="mt-4">
                <p className="font-semibold text-foreground">{selectedTransaction.description}</p>
                <p className="text-sm text-muted-foreground">{selectedTransaction.category} • {selectedTransaction.date}</p>
                <p className={`mt-3 font-bold ${selectedTransaction.type === 'income' ? 'text-success' : 'text-destructive'}`}>{selectedTransaction.type === 'income' ? '+' : '-'}₹{selectedTransaction.amount.toLocaleString()}</p>
                <div className="mt-4 flex gap-2">
                  <Button variant="destructive" onClick={() => { setTransactionToDelete(selectedTransaction); setConfirmDeleteOpen(true); setSelectedTransaction(null); }}>
                    <Trash className="w-4 h-4 mr-2" /> Delete
                  </Button>
                  <Button variant="ghost" onClick={() => setSelectedTransaction(null)}>Close</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Confirm Delete Dialog */}
        <Dialog open={confirmDeleteOpen} onOpenChange={(open) => { if (!open) { setTransactionToDelete(null); } setConfirmDeleteOpen(open); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
            </DialogHeader>
            <div className="mt-2">
              <p className="text-sm text-muted-foreground">Are you sure you want to delete this transaction? This action can be undone from the toast for a short time.</p>
              {transactionToDelete && (
                <div className="mt-4 p-3 rounded-md bg-muted/10">
                  <p className="font-medium">{transactionToDelete.description}</p>
                  <p className="text-sm text-muted-foreground">{transactionToDelete.category} • {transactionToDelete.date}</p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="destructive" onClick={() => {
                try {
                  if (!transactionToDelete) return;
                  const deleted = removeTransaction(transactionToDelete.id);
                  setConfirmDeleteOpen(false);

                  if (deleted) {
                    // create a toast, then update it to include the Undo action (avoid referencing the ref during creation)
                    const tRef = toast({
                      title: "Transaction deleted",
                      description: `${deleted.description} removed.`,
                    });

                    // attach undo action that restores the transaction and dismisses the toast
                    try {
                      tRef.update({
                        title: "Transaction deleted",
                        description: `${deleted.description} removed.`,
                          action: (
                          <ToastAction
                            altText="Undo"
                            onClick={() => {
                              try {
                                restoreTransaction(deleted);
                              } catch (err) {
                                console.error("Error restoring transaction:", err);
                              }
                              try {
                                tRef.dismiss?.();
                              } catch {}
                            }}
                          >
                            Undo
                          </ToastAction>
                        ),
                      });
                    } catch (err) {
                      console.error("Error updating toast with undo:", err);
                    }

                    // auto-dismiss after 3s
                    setTimeout(() => {
                      try {
                        tRef.dismiss?.();
                      } catch (err) {
                        console.error("Error dismissing toast:", err);
                      }
                    }, 3000);
                  }

                  setTransactionToDelete(null);
                } catch (err) {
                  console.error("Error deleting transaction:", err);
                  try {
                    toast({ title: "Delete failed", description: "Could not delete transaction." });
                  } catch {}
                }
              }}>Delete</Button>
              <Button variant="ghost" onClick={() => setConfirmDeleteOpen(false)}>Cancel</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Dashboard;
