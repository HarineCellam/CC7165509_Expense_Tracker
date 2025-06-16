import { useEffect, useState } from "react";
import TransactionForm from "../components/TransactionForm";
import TransactionPanel from "../components/TransactionPanel";

const Income = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId") || "guest";
    const savedTransactions = JSON.parse(localStorage.getItem(`transactions_${userId}`)) || [];

    // Ensure only income transactions are loaded
    const incomeTransactions = savedTransactions.filter((entry) => entry.type === "income");
    setTransactions(incomeTransactions);
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem("userId") || "guest";
    const savedTransactions = JSON.parse(localStorage.getItem(`transactions_${userId}`)) || [];

    // Merge new transactions with existing ones
    const allTransactions = [...savedTransactions.filter(entry => entry.type !== "income"), ...transactions];

    localStorage.setItem(`transactions_${userId}`, JSON.stringify(allTransactions));
  }, [transactions]);

  const addTransaction = (newEntry) => {
    setTransactions([...transactions, { ...newEntry, type: "income" }]);
  };

  const deleteTransaction = (id) => {
    const userId = localStorage.getItem("userId") || "guest";

    // Remove the transaction
    const updatedTransactions = transactions.filter((entry) => entry.id !== id);

    // Merge remaining transactions with existing non-income transactions
    const savedTransactions = JSON.parse(localStorage.getItem(`transactions_${userId}`)) || [];
    const allTransactions = [...savedTransactions.filter(entry => entry.type !== "income"), ...updatedTransactions];

    localStorage.setItem(`transactions_${userId}`, JSON.stringify(allTransactions));

    // Update state
    setTransactions(updatedTransactions);
  };

  return (
    <div className="flex gap-6 p-6">
      <TransactionForm addTransaction={addTransaction} type="income" />
      <TransactionPanel transactions={transactions} type="income" deleteTransaction={deleteTransaction} />
    </div>
  );
};

export default Income;