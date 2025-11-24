export interface SplitGroup {
  id: string;
  name: string;
  members: string[];
  totalOwed: number;
  totalOwes: number;
  createdAt: string;
}

export interface SplitExpense {
  id: string;
  groupId: string;
  description: string;
  amount: number;
  paidBy: string;
  splitBetween: string[];
  status: "pending" | "settled";
  date: string;
  createdAt: string;
}

const STORAGE_KEYS = {
  GROUPS: "smartai_split_groups",
  EXPENSES: "smartai_split_expenses",
};

// Groups
export const getSplitGroups = (): SplitGroup[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.GROUPS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveSplitGroup = (group: Omit<SplitGroup, "id" | "createdAt">): SplitGroup => {
  const groups = getSplitGroups();
  const newGroup: SplitGroup = {
    ...group,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  groups.unshift(newGroup);
  localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(groups));
  return newGroup;
};

// Split Expenses
export const getSplitExpenses = (): SplitExpense[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveSplitExpense = (expense: Omit<SplitExpense, "id" | "createdAt">): SplitExpense => {
  const expenses = getSplitExpenses();
  const newExpense: SplitExpense = {
    ...expense,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  expenses.unshift(newExpense);
  localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
  return newExpense;
};

// Initialize sample data
export const initializeSplitData = (): void => {
  if (getSplitGroups().length === 0) {
    const group1 = saveSplitGroup({
      name: "Roommates",
      members: ["You", "John", "Sarah", "Mike"],
      totalOwed: 2500,
      totalOwes: 1200,
    });

    const group2 = saveSplitGroup({
      name: "College Friends",
      members: ["You", "Alice", "Bob", "Charlie", "David", "Emma"],
      totalOwed: 800,
      totalOwes: 0,
    });

    saveSplitExpense({
      groupId: group1.id,
      description: "Dinner at Pizza Place",
      amount: 1500,
      paidBy: "You",
      splitBetween: ["You", "John", "Sarah", "Mike"],
      status: "pending",
      date: new Date().toISOString().split("T")[0],
    });

    saveSplitExpense({
      groupId: group2.id,
      description: "Movie Tickets",
      amount: 800,
      paidBy: "You",
      splitBetween: ["You", "Alice", "Bob", "Charlie"],
      status: "settled",
      date: new Date(Date.now() - 172800000).toISOString().split("T")[0],
    });
  }
};
