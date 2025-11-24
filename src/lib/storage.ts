export interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: string;
  createdAt: string;
}

export interface Budget {
  category: string;
  limit: number;
  spent: number;
}

const STORAGE_KEYS = {
  TRANSACTIONS: "smartai_transactions",
  BUDGETS: "smartai_budgets",
  USER_PREFERENCES: "smartai_preferences",
};

// Transactions
const generateId = (): string => {
  try {
    // prefer crypto.randomUUID when available
    // @ts-ignore
    if (typeof crypto !== "undefined" && typeof (crypto as any).randomUUID === "function") {
      // @ts-ignore
      return (crypto as any).randomUUID();
    }
  } catch {}
  return `${Date.now()}-${Math.floor(Math.random() * 1e9)}`;
};

export const getTransactions = (): Transaction[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error("getTransactions error:", err);
    return [];
  }
};

export const saveTransaction = (transaction: Omit<Transaction, "id" | "createdAt">): Transaction => {
  const transactions = getTransactions();
  const newTransaction: Transaction = {
    ...transaction,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  transactions.unshift(newTransaction);
  try {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  } catch (err) {
    console.error("saveTransaction error:", err);
  }
  return newTransaction;
};

export const deleteTransaction = (id: string): Transaction | null => {
  try {
    const transactions = getTransactions();
    const idx = transactions.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    const [deleted] = transactions.splice(idx, 1);
    try {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    } catch (err) {
      console.error("deleteTransaction setItem error:", err);
    }
    return deleted;
  } catch (err) {
    console.error("deleteTransaction error:", err);
    return null;
  }
};

// Insert a full transaction object (used for undo/restore)
export const insertTransaction = (transaction: Transaction): void => {
  try {
    const transactions = getTransactions();
    transactions.unshift(transaction);
    try {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    } catch (err) {
      console.error("insertTransaction setItem error:", err);
    }
  } catch (err) {
    console.error("insertTransaction error:", err);
  }
};

export const updateTransaction = (id: string, updates: Partial<Transaction>): void => {
  try {
    const transactions = getTransactions().map((t) => (t.id === id ? { ...t, ...updates } : t));
    try {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    } catch (err) {
      console.error("updateTransaction setItem error:", err);
    }
  } catch (err) {
    console.error("updateTransaction error:", err);
  }
};

// Analytics helpers
export const getTransactionsByDateRange = (startDate: Date, endDate: Date): Transaction[] => {
  return getTransactions().filter((t) => {
    const date = new Date(t.date);
    return date >= startDate && date <= endDate;
  });
};

export const getCategoryTotals = (type: "income" | "expense", startDate?: Date, endDate?: Date): Record<string, number> => {
  let transactions = getTransactions().filter((t) => t.type === type);
  
  if (startDate && endDate) {
    transactions = transactions.filter((t) => {
      const date = new Date(t.date);
      return date >= startDate && date <= endDate;
    });
  }

  return transactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);
};

export const getTotalByType = (type: "income" | "expense", startDate?: Date, endDate?: Date): number => {
  let transactions = getTransactions().filter((t) => t.type === type);
  
  if (startDate && endDate) {
    transactions = transactions.filter((t) => {
      const date = new Date(t.date);
      return date >= startDate && date <= endDate;
    });
  }

  return transactions.reduce((sum, t) => sum + t.amount, 0);
};

export const getBalance = (): number => {
  const transactions = getTransactions();
  return transactions.reduce((balance, t) => {
    return t.type === "income" ? balance + t.amount : balance - t.amount;
  }, 0);
};

// Initialize with sample data if empty
export const initializeSampleData = (): void => {
  if (getTransactions().length === 0) {
    const sampleTransactions: Omit<Transaction, "id" | "createdAt">[] = [
      {
        type: "income",
        amount: 50000,
        category: "Salary",
        description: "Monthly salary",
        date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
      },
      {
        type: "expense",
        amount: 2500,
        category: "Food & Dining",
        description: "Grocery shopping",
        date: new Date().toISOString().split("T")[0],
      },
      {
        type: "expense",
        amount: 350,
        category: "Travel",
        description: "Uber ride",
        date: new Date(Date.now() - 172800000).toISOString().split("T")[0],
      },
      {
        type: "expense",
        amount: 799,
        category: "Subscriptions",
        description: "Netflix",
        date: new Date(Date.now() - 259200000).toISOString().split("T")[0],
      },
      {
        type: "income",
        amount: 15000,
        category: "Freelance",
        description: "Freelance project",
        date: new Date(Date.now() - 345600000).toISOString().split("T")[0],
      },
      {
        type: "expense",
        amount: 1200,
        category: "Shopping",
        description: "New headphones",
        date: new Date(Date.now() - 432000000).toISOString().split("T")[0],
      },
      {
        type: "expense",
        amount: 4200,
        category: "Travel",
        description: "Bus pass",
        date: new Date(Date.now() - 518400000).toISOString().split("T")[0],
      },
    ];

    sampleTransactions.forEach(saveTransaction);
  }
};
