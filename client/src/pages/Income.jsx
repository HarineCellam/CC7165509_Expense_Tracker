// import { useEffect, useState } from "react";
// import TransactionForm from "../components/TransactionForm";
// import TransactionPanel from "../components/TransactionPanel";

// const Income = () => {
//   const [transactions, setTransactions] = useState([]);

//   useEffect(() => {
//     const userId = localStorage.getItem("userId") || "guest";
//     const savedTransactions = JSON.parse(localStorage.getItem(`transactions_${userId}`)) || [];
//     const incomeTransactions = savedTransactions.filter((entry) => entry.type === "income");
//     setTransactions(incomeTransactions);
//   }, []);

//   useEffect(() => {
//     const userId = localStorage.getItem("userId") || "guest";
//     const savedTransactions = JSON.parse(localStorage.getItem(`transactions_${userId}`)) || [];
//     const allTransactions = [
//       ...savedTransactions.filter(entry => entry.type !== "income"),
//       ...transactions
//     ];
//     localStorage.setItem(`transactions_${userId}`, JSON.stringify(allTransactions));
//   }, [transactions]);

//   const addTransaction = (newEntry) => {
//     setTransactions([...transactions, { ...newEntry, type: "income" }]);
//   };

//   const deleteTransaction = (id) => {
//     const updatedTransactions = transactions.filter((entry) => entry.id !== id);
//     setTransactions(updatedTransactions);
//   };

//   return (
//     <div className="flex flex-col lg:flex-row gap-4 p-4">
//       <div className="w-full lg:w-1/3">
//         <TransactionForm addTransaction={addTransaction} type="income" />
//       </div>
//       <div className="w-full lg:w-2/3">
//         <TransactionPanel 
//           transactions={transactions} 
//           type="income" 
//           deleteTransaction={deleteTransaction} 
//         />
//       </div>
//     </div>
//   );
// };

// export default Income;

import { useEffect, useState } from "react";
import apiService from "../api";
import TransactionForm from "../components/TransactionForm";
import TransactionPanel from "../components/TransactionPanel";

const Income = () => {
  const [transactions, setTransactions] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  const fetchTransactions = async () => {
    try {
      // Get all transactions for the user
      const response = await apiService.transactions.getAll(userId);
      // Filter for income-type transactions
      const incomeTransactions = response.filter((t) => t.type === "income");
      setTransactions(incomeTransactions);
    } catch (error) {
      console.error("Error fetching income transactions:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const addTransaction = async (newEntry) => {
    try {
      const transactionData = {
        ...newEntry,
        type: "income",
        userId,
      };
      await apiService.transactions.create(transactionData);
      fetchTransactions(); // Refresh list after adding
    } catch (error) {
      console.error("Error adding income transaction:", error);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await apiService.transactions.delete(id);
      fetchTransactions(); // Refresh list after deletion
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