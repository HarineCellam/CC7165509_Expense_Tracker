// TransactionPanel.js
import { useEffect, useState } from "react";

const TransactionPanel = ({ transactions, type, deleteTransaction }) => {
  const [sortedTransactions, setSortedTransactions] = useState([]);
  const [filter, setFilter] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [currency] = useState(localStorage.getItem("currency") || "₹");

  // Get unique categories for filter dropdown
  const categories = [...new Set(transactions.map(t => t.category))];

  useEffect(() => {
    let filtered = transactions.filter(entry => 
      !filter || entry.category === filter
    );

    // Apply sorting
    if (sortOption === "newest") {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortOption === "oldest") {
      filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortOption === "high") {
      // For expenses, "high" means least negative (closest to zero)
      filtered.sort((a, b) => b.amount - a.amount);
    } else if (sortOption === "low") {
      // For expenses, "low" means most negative
      filtered.sort((a, b) => a.amount - b.amount);
    }

    setSortedTransactions(filtered);
  }, [transactions, filter, sortOption]);

  // Format currency display with proper negative sign placement
  const formatCurrency = (amount) => {
    if (amount < 0) {
      return `-${currency}${Math.abs(amount)}`;
    }
    return `${currency}${amount}`;
  };

  // Calculate total
  const total = sortedTransactions.reduce((sum, entry) => sum + entry.amount, 0);

  return (
    <div className="flex-1 bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">
          {type === "income" ? "Income History" : "Expense History"}
        </h3>

        <div className="flex gap-2">
          <select 
            onChange={(e) => setFilter(e.target.value)} 
            className="p-2 border rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <select 
            onChange={(e) => setSortOption(e.target.value)} 
            className="p-2 border rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="high">Amount: High to Low</option>
            <option value="low">Amount: Low to High</option>
          </select>
        </div>
      </div>

      <ul className="space-y-2">
        {sortedTransactions.length > 0 ? (
          sortedTransactions.map((entry) => (
            <li 
              key={entry.id} 
              className="bg-gray-200 dark:bg-gray-700 p-3 rounded-md flex justify-between items-center"
            >
              <span className={`font-bold ${entry.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                {formatCurrency(entry.amount)}
              </span>
              <div className="flex-1 mx-4">
                <div className="font-medium">{entry.category}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {new Date(entry.date).toLocaleDateString()} • {entry.description}
                </div>
              </div>
              <button 
                onClick={() => deleteTransaction(entry.id)} 
                className="text-red-500 hover:text-red-700 p-1"
                aria-label="Delete transaction"
              >
                🗑️
              </button>
            </li>
          ))
        ) : (
          <p className="text-center text-gray-500 py-4">No transactions found.</p>
        )}
      </ul>

      <h3 className={`mt-4 text-lg font-bold sticky bottom-0 bg-gray-100 dark:bg-gray-800 py-2 ${
        total < 0 ? 'text-red-600' : 'text-green-600'
      }`}>
        Total: {formatCurrency(total)}
      </h3>
    </div>
  );
};

export default TransactionPanel;