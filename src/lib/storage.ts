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
export const getTransactions = (): Transaction[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveTransaction = (transaction: Omit<Transaction, "id" | "createdAt">): Transaction => {
  const transactions = getTransactions();
  const newTransaction: Transaction = {
    ...transaction,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  transactions.unshift(newTransaction);
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  return newTransaction;
};

export const deleteTransaction = (id: string): void => {
  const transactions = getTransactions().filter((t) => t.id !== id);
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
};

export const updateTransaction = (id: string, updates: Partial<Transaction>): void => {
  const transactions = getTransactions().map((t) =>
    t.id === id ? { ...t, ...updates } : t
  );
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
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
