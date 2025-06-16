import { useEffect, useState } from "react";
import TransactionForm from "../components/TransactionForm";
import TransactionPanel from "../components/TransactionPanel";

const Expense = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId") || "guest";
    const savedTransactions = JSON.parse(localStorage.getItem(`transactions_${userId}`)) || [];

    // Ensure only expense transactions are loaded
    const expenseTransactions = savedTransactions.filter((entry) => entry.type === "expense");
    setTransactions(expenseTransactions);
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem("userId") || "guest";
    localStorage.setItem(`transactions_${userId}`, JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (newEntry) => {
    setTransactions([...transactions, newEntry]);
  };

  const deleteTransaction = (id) => {
    const userId = localStorage.getItem("userId") || "guest";

    // Filter out the deleted transaction
    const updatedTransactions = transactions.filter((entry) => entry.id !== id);

    // Update localStorage
    localStorage.setItem(`transactions_${userId}`, JSON.stringify(updatedTransactions));

    // Update state
    setTransactions(updatedTransactions);
  };

  return (
    <div className="flex gap-6 p-6">
      <TransactionForm addTransaction={addTransaction} type="expense" />
      <TransactionPanel transactions={transactions} type="expense" deleteTransaction={deleteTransaction} />
    </div>
  );
};

export default Expense;