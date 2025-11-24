import { useState, useEffect } from "react";
import { Transaction, getTransactions, saveTransaction, deleteTransaction, getBalance, getTotalByType } from "@/lib/storage";

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  const loadData = () => {
    const txns = getTransactions();
    setTransactions(txns);
    setBalance(getBalance());
    setTotalIncome(getTotalByType("income"));
    setTotalExpense(getTotalByType("expense"));
  };

  useEffect(() => {
    loadData();
  }, []);

  const addTransaction = (transaction: Omit<Transaction, "id" | "createdAt">) => {
    saveTransaction(transaction);
    loadData();
  };

  const removeTransaction = (id: string) => {
    deleteTransaction(id);
    loadData();
  };

  return {
    transactions,
    balance,
    totalIncome,
    totalExpense,
    addTransaction,
    removeTransaction,
    refresh: loadData,
  };
};
