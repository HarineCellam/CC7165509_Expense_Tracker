import { useEffect, useState } from "react";
import TransactionForm from "../components/TransactionForm";
import TransactionPanel from "../components/TransactionPanel";

const Income = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId") || "guest";
    const savedTransactions = JSON.parse(localStorage.getItem(`transactions_${userId}`)) || [];
    const incomeTransactions = savedTransactions.filter((entry) => entry.type === "income");
    setTransactions(incomeTransactions);
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem("userId") || "guest";
    const savedTransactions = JSON.parse(localStorage.getItem(`transactions_${userId}`)) || [];
    const allTransactions = [
      ...savedTransactions.filter(entry => entry.type !== "income"),
      ...transactions
    ];
    localStorage.setItem(`transactions_${userId}`, JSON.stringify(allTransactions));
  }, [transactions]);

  const addTransaction = (newEntry) => {
    setTransactions([...transactions, { ...newEntry, type: "income" }]);
  };

  const deleteTransaction = (id) => {
    const updatedTransactions = transactions.filter((entry) => entry.id !== id);
    setTransactions(updatedTransactions);
  };

  return (
    <div className="flex gap-6 p-6">
      <TransactionForm addTransaction={addTransaction} type="income" />
      <TransactionPanel 
        transactions={transactions} 
        type="income" 
        deleteTransaction={deleteTransaction} 
      />
    </div>
  );
};

export default Income;