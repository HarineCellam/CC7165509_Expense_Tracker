// import { useEffect, useState } from "react";

// const TransactionPanel = ({ transactions, type, deleteTransaction, setTransactions }) => {
//   const [sortedTransactions, setSortedTransactions] = useState([]);
//   const [filter, setFilter] = useState("");
//   const [sortOption, setSortOption] = useState("newest");
//   const [currency, setCurrency] = useState(localStorage.getItem("currency") || "₹");

//   useEffect(() => {
//     const userId = localStorage.getItem("userId") || "guest";
//     const savedTransactions = JSON.parse(localStorage.getItem(`transactions_${userId}`)) || [];
//     setTransactions(savedTransactions); // This now works, since setTransactions comes from props
//     setSortedTransactions(savedTransactions);
//   }, []);
//   useEffect(() => {
//   console.log("Transactions received:", transactions);
// }, [transactions]);

//   // Sorting logic
//   useEffect(() => {
//     if (!Array.isArray(sortedTransactions)) return;
//     let sortedData = [...sortedTransactions];

//     if (sortOption === "newest") {
//       sortedData.sort((a, b) => new Date(b.date) - new Date(a.date));
//     } else if (sortOption === "oldest") {
//       sortedData.sort((a, b) => new Date(a.date) - new Date(b.date));
//     } else if (sortOption === "high") {
//       sortedData.sort((a, b) => b.amount - a.amount);
//     } else if (sortOption === "low") {
//       sortedData.sort((a, b) => a.amount - b.amount);
//     }

//     setSortedTransactions(sortedData);
//   }, [transactions, sortOption]);

//   return (
//     <div className="flex-1 bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md h-80 overflow-y-auto">
//       {/* Sorting & Filtering */}
//       <div className="flex justify-between mb-4">
//         <h3 className="text-xl font-bold text-gray-800 dark:text-white">{type === "income" ? "Income History" : "Expense History"}</h3>

//         <div className="flex gap-2">
//           {/* Filter by Category */}
//           <select onChange={(e) => setFilter(e.target.value)} className="p-2 border rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white">
//             <option value="">All Categories</option>
//             <option value="Salary">Salary</option>
//             <option value="Freelance">Freelance</option>
//             <option value="Investments">Investments</option>
//           </select>

//           {/* Sorting Dropdown */}
//           <select onChange={(e) => setSortOption(e.target.value)} className="p-2 border rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white">
//             <option value="newest">Newest First</option>
//             <option value="oldest">Oldest First</option>
//             <option value="high">Amount: High to Low</option>
//             <option value="low">Amount: Low to High</option>
//           </select>
//         </div>
//       </div>

//       {/* Transaction List */}
//       <ul className="space-y-2">
//   {sortedTransactions.length > 0 ? (
//     sortedTransactions.map((entry) => (
//       <li key={entry.id} className="bg-gray-200 dark:bg-gray-700 p-3 rounded-md flex justify-between">
//         <span className="font-bold">{entry.currency || currency}{entry.amount}</span>
//         <span>{entry.category} - {entry.date}</span>
//         <button onClick={() => deleteTransaction(entry.id)} className="text-red-500 hover:text-red-700">
//           🗑️
//         </button>
//       </li>
//     ))
//   ) : (
//     <p className="text-center text-gray-500">No transactions found.</p>
//   )}
// </ul>

//       <h3 className="mt-4 text-lg font-bold text-gray-800 dark:text-white">
//         Total: {currency}{sortedTransactions.reduce((sum, entry) => sum + entry.amount, 0)}
//       </h3>
//     </div>
//   );
// };

// export default TransactionPanel;

import { useEffect, useState } from "react";

const TransactionPanel = ({ transactions, type, deleteTransaction }) => {
  const [sortedTransactions, setSortedTransactions] = useState([]);
  const [filter, setFilter] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [currency, setCurrency] = useState(localStorage.getItem("currency") || "₹");

  useEffect(() => {
    if (!Array.isArray(transactions)) return;

    let sortedData = [...transactions];

    if (sortOption === "newest") {
      sortedData.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortOption === "oldest") {
      sortedData.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortOption === "high") {
      sortedData.sort((a, b) => b.amount - a.amount);
    } else if (sortOption === "low") {
      sortedData.sort((a, b) => a.amount - b.amount);
    }

    setSortedTransactions(sortedData);
  }, [transactions, sortOption]);

  return (
    <div className="flex-1 bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md h-80 overflow-y-auto">
      <div className="flex justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">{type === "income" ? "Income History" : "Expense History"}</h3>

        <div className="flex gap-2">
          <select onChange={(e) => setFilter(e.target.value)} className="p-2 border rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white">
            <option value="">All Categories</option>
            <option value="Salary">Salary</option>
            <option value="Freelance">Freelance</option>
            <option value="Investments">Investments</option>
          </select>

          <select onChange={(e) => setSortOption(e.target.value)} className="p-2 border rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="high">Amount: High to Low</option>
            <option value="low">Amount: Low to High</option>
          </select>
        </div>
      </div>

      <ul className="space-y-2">
        {sortedTransactions.filter((entry) => !filter || entry.category === filter).map((entry) => (
          <li key={entry.id} className="bg-gray-200 dark:bg-gray-700 p-3 rounded-md flex justify-between">
            <span className="font-bold">{entry.currency || currency}{entry.amount}</span>
            <span>{entry.category} - {entry.date}</span>
            <button onClick={() => deleteTransaction(entry.id)} className="text-red-500 hover:text-red-700">
  🗑️
</button>
          </li>
        ))}
      </ul>

      <h3 className="mt-4 text-lg font-bold text-gray-800 dark:text-white">
        Total: {currency}{sortedTransactions.reduce((sum, entry) => sum + entry.amount, 0)}
      </h3>
    </div>
  );
};

export default TransactionPanel;