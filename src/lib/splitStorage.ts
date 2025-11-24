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
// Runtime helpers: safe localStorage access and ID generation
const isLocalStorageAvailable = (): boolean => {
  try {
    if (typeof window === "undefined") return false;
    return !!window.localStorage;
  } catch {
    return false;
  }
};

const generateId = (): string => {
  try {
    if (typeof crypto !== "undefined" && typeof (crypto as any).randomUUID === "function") {
      return (crypto as any).randomUUID();
    }
  } catch {
    // fall through to fallback
  }
  return `id_${Math.random().toString(36).slice(2)}_${Date.now().toString(36)}`;
};

// In-memory fallbacks when localStorage is not available (SSR / tests)
let groupsMemory: SplitGroup[] = [];
let expensesMemory: SplitExpense[] = [];

// Helpers to persist groups and recompute aggregate totals (for the current user "You")
const saveAllGroups = (groups: SplitGroup[]) => {
  if (!isLocalStorageAvailable()) {
    groupsMemory = groups;
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(groups));
  } catch {
    groupsMemory = groups;
  }
};

export const recomputeGroupTotals = (): void => {
  try {
    const groups = getSplitGroups();
    const expenses = getSplitExpenses();

    const updated = groups.map((g) => ({ ...g, totalOwed: 0, totalOwes: 0 }));

    for (const exp of expenses) {
      const group = updated.find((u) => u.id === exp.groupId);
      if (!group) continue;

      const per = exp.splitBetween.length > 0 ? exp.amount / exp.splitBetween.length : 0;

      // When 'You' paid, others owe you their share
      if (exp.paidBy === "You") {
        const othersCount = exp.splitBetween.filter((m) => m !== "You").length;
        group.totalOwed += othersCount * per;
      } else {
        // When someone else paid and 'You' are part of split, you owe them your share
        if (exp.splitBetween.includes("You")) {
          group.totalOwes += per;
        }
      }
    }

    saveAllGroups(updated);
  } catch {
    // ignore errors during totals recompute
  }
};

// Groups
export const getSplitGroups = (): SplitGroup[] => {
  if (!isLocalStorageAvailable()) return [...groupsMemory];

  try {
    const data = window.localStorage.getItem(STORAGE_KEYS.GROUPS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveSplitGroup = (group: Omit<SplitGroup, "id" | "createdAt">): SplitGroup => {
  const newGroup: SplitGroup = {
    ...group,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };

  if (!isLocalStorageAvailable()) {
    groupsMemory.unshift(newGroup);
    return newGroup;
  }

  try {
    const groups = getSplitGroups();
    groups.unshift(newGroup);
    window.localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(groups));
    // Recompute totals after adding group (no expenses yet)
    recomputeGroupTotals();
    return newGroup;
  } catch {
    // fallback to memory on failure
    groupsMemory.unshift(newGroup);
    recomputeGroupTotals();
    return newGroup;
  }
};

// Split Expenses
export const getSplitExpenses = (): SplitExpense[] => {
  if (!isLocalStorageAvailable()) return [...expensesMemory];

  try {
    const data = window.localStorage.getItem(STORAGE_KEYS.EXPENSES);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveSplitExpense = (expense: Omit<SplitExpense, "id" | "createdAt">): SplitExpense => {
  const newExpense: SplitExpense = {
    ...expense,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };

  if (!isLocalStorageAvailable()) {
    expensesMemory.unshift(newExpense);
    return newExpense;
  }

  try {
    const expenses = getSplitExpenses();
    expenses.unshift(newExpense);
    window.localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
    // Update group totals after adding expense
    recomputeGroupTotals();
    return newExpense;
  } catch {
    expensesMemory.unshift(newExpense);
    recomputeGroupTotals();
    return newExpense;
  }
};

// Initialize sample data (safe to call on client only)
export const initializeSplitData = (): void => {
  try {
    const existing = getSplitGroups();
    if (existing.length === 0) {
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
  } catch {
    // no-op if something goes wrong during initialization
  }
};
