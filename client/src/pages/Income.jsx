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
    <div className="flex flex-col lg:flex-row gap-4 p-4">
      <div className="w-full lg:w-1/3">
        <TransactionForm addTransaction={addTransaction} type="income" />
      </div>
      <div className="w-full lg:w-2/3">
        <TransactionPanel 
          transactions={transactions} 
          type="income" 
          deleteTransaction={deleteTransaction} 
        />
      </div>
    </div>
  );
};

export default Income;