// Expense.js
import { useEffect, useState } from "react";
import TransactionForm from "../components/TransactionForm";
import TransactionPanel from "../components/TransactionPanel";

const Expense = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId") || "guest";
    const savedTransactions = JSON.parse(localStorage.getItem(`transactions_${userId}`)) || [];
    const expenseTransactions = savedTransactions.filter((entry) => entry.type === "expense");
    setTransactions(expenseTransactions);
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem("userId") || "guest";
    const savedTransactions = JSON.parse(localStorage.getItem(`transactions_${userId}`)) || [];
    const allTransactions = [
      ...savedTransactions.filter(entry => entry.type !== "expense"),
      ...transactions
    ];
    localStorage.setItem(`transactions_${userId}`, JSON.stringify(allTransactions));
  }, [transactions]);

  const addTransaction = (newEntry) => {
    // Convert amount to negative for expenses
    const expenseEntry = { 
      ...newEntry, 
      amount: -Math.abs(newEntry.amount), 
      type: "expense" 
    };
    setTransactions([...transactions, expenseEntry]);
  };

  const deleteTransaction = (id) => {
    const updatedTransactions = transactions.filter((entry) => entry.id !== id);
    setTransactions(updatedTransactions);
  };

  return (
    <div className="flex gap-6 p-6">
      <TransactionForm addTransaction={addTransaction} type="expense" />
      <TransactionPanel 
        transactions={transactions} 
        type="expense" 
        deleteTransaction={deleteTransaction} 
      />
    </div>
  );
};

export default Expense;