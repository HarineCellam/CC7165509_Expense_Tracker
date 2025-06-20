import { useEffect, useState } from "react";
import apiService from "../api";
import TransactionForm from "../components/TransactionForm";
import TransactionPanel from "../components/TransactionPanel";

const Income = () => {
  const [transactions, setTransactions] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  // Remove userId from all requests
const fetchTransactions = async () => {
  try {
    const response = await apiService.transactions.getAll();
    const incomeTransactions = response.filter(t => t.type === "income");
    setTransactions(incomeTransactions);
  } catch (error) {
    console.error("Error fetching income transactions:", error);
  }
};

const addTransaction = async (newEntry) => {
  try {
    // Remove userId from request body
    await apiService.transactions.create({
      ...newEntry,
      type: "income"
    });
    fetchTransactions();
  } catch (error) {
    console.error("Error adding income transaction:", error);
  }
};

  useEffect(() => {
    fetchTransactions();
  }, []);

  const deleteTransaction = async (id) => {
    try {
      await apiService.transactions.delete(id);
      fetchTransactions();
    } catch (error) {
      console.error("Error deleting income transaction:", error);
    }
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