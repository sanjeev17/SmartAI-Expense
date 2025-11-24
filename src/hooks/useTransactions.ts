import { useState, useEffect } from "react";
import { Transaction, getTransactions, saveTransaction, deleteTransaction, insertTransaction, getBalance, getTotalByType } from "@/lib/storage";

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  const loadData = () => {
    try {
      const txns = getTransactions() || [];
      setTransactions(Array.isArray(txns) ? txns : []);
      try {
        setBalance(getBalance());
      } catch (err) {
        console.error("Error computing balance:", err);
        setBalance(0);
      }
      try {
        setTotalIncome(getTotalByType("income"));
      } catch (err) {
        console.error("Error computing total income:", err);
        setTotalIncome(0);
      }
      try {
        setTotalExpense(getTotalByType("expense"));
      } catch (err) {
        console.error("Error computing total expense:", err);
        setTotalExpense(0);
      }
    } catch (err) {
      console.error("Error loading transactions:", err);
      setTransactions([]);
      setBalance(0);
      setTotalIncome(0);
      setTotalExpense(0);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const addTransaction = (transaction: Omit<Transaction, "id" | "createdAt">) => {
    try {
      saveTransaction(transaction);
    } catch (err) {
      console.error("Error saving transaction:", err);
    }
    loadData();
  };

  const removeTransaction = (id: string): Transaction | null => {
    try {
      const deleted = deleteTransaction(id);
      loadData();
      return deleted;
    } catch (err) {
      console.error("Error deleting transaction:", err);
      loadData();
      return null;
    }
  };

  const restoreTransaction = (transaction: Transaction) => {
    try {
      insertTransaction(transaction);
    } catch (err) {
      console.error("Error inserting transaction:", err);
    }
    loadData();
  };

  return {
    transactions,
    balance,
    totalIncome,
    totalExpense,
    addTransaction,
    removeTransaction,
    restoreTransaction,
    refresh: loadData,
  };
};
