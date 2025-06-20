import { useEffect, useState } from "react";
import apiService from "../api";
import TransactionForm from "../components/TransactionForm";
import TransactionPanel from "../components/TransactionPanel";

const Expense = () => {
  const [transactions, setTransactions] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  const fetchTransactions = async () => {
    try {
      // Get all transactions for the user
      const response = await apiService.transactions.getAll(userId);
      // Filter for expense-type transactions
      const expenseTransactions = response.filter((t) => t.type === "expense");
      setTransactions(expenseTransactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const addTransaction = async (newEntry) => {
    try {
      const transactionData = {
        ...newEntry,
        // Store expense amounts as negative values
        amount: -Math.abs(newEntry.amount),
        type: "expense",
        userId,
      };
      await apiService.transactions.create(transactionData);
      fetchTransactions(); // Refresh list after adding
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await apiService.transactions.delete(id);
      fetchTransactions(); // Refresh list after deletion
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 p-4">
      <div className="w-full lg:w-1/3">
        <TransactionForm addTransaction={addTransaction} type="expense" />
      </div>
      <div className="w-full lg:w-2/3">
        <TransactionPanel 
          transactions={transactions} 
          type="expense" 
          deleteTransaction={deleteTransaction} 
        />
      </div>
    </div>
  );
};

export default Expense;