import { useEffect, useState } from "react";
import TransactionForm from "../components/TransactionForm";
import TransactionPanel from "../components/TransactionPanel";

const Expense = () => {
  const [transactions, setTransactions] = useState([]);
  const userId = localStorage.getItem('userId');

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`/api/transactions?userId=${userId}&type=expense`);
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const addTransaction = async (newEntry) => {
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newEntry,
          amount: -Math.abs(newEntry.amount),
          type: "expense",
          userId
        }),
      });
      
      if (response.ok) {
        fetchTransactions(); // Refresh the list
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      const response = await fetch(`/api/transactions?id=${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        fetchTransactions(); // Refresh the list
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
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