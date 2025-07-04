import { useEffect, useState } from "react";
import { FaRupeeSign } from "react-icons/fa";
import { FiCalendar, FiInfo, FiTag } from "react-icons/fi";
import apiService from "../api";

const TransactionPanel = ({ transactions, type, deleteTransaction }) => {
  const [sortedTransactions, setSortedTransactions] = useState([]);
  const [filter, setFilter] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [currency] = useState(localStorage.getItem("currency") || "₹");
  const [isDeleting, setIsDeleting] = useState(null);

  // Get unique categories from transactions
  const categories = [...new Set(transactions.map((t) => t.category))];

  useEffect(() => {
    let filtered = transactions.filter(
      (entry) => !filter || entry.category === filter
    );

    if (sortOption === "newest") {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortOption === "oldest") {
      filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortOption === "high") {
      filtered.sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount));
    } else if (sortOption === "low") {
      filtered.sort((a, b) => Math.abs(a.amount) - Math.abs(b.amount));
    }

    setSortedTransactions(filtered);
  }, [transactions, filter, sortOption]);

  // Format the currency amount - modified to always show expenses as negative
  const formatCurrency = (amount, transactionType = type) => {
    const absoluteAmount = Math.abs(amount);
    // For expense panel, always show as negative
    if (transactionType === "expense") {
      return `-${currency}${absoluteAmount.toLocaleString()}`;
    }
    // For income panel, show as positive
    return `${currency}${absoluteAmount.toLocaleString()}`;
  };

  const handleDelete = async (id) => {
    try {
      setIsDeleting(id);
      await apiService.transactions.delete(id);
      deleteTransaction(id);
    } catch (error) {
      console.error("Failed to delete transaction:", error);
    } finally {
      setIsDeleting(null);
    }
  };

  const total = sortedTransactions.reduce((sum, entry) => sum + entry.amount, 0);

  return (
    <div
      className="flex-1 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md flex flex-col"
      style={{ maxHeight: "80vh" }}
    >
      <div className="flex flex-col gap-3 mb-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">
          {type === "income" ? "Income History" : "Expense History"}
        </h3>

        <div className="flex flex-col sm:flex-row gap-2">
          <select
            onChange={(e) => setFilter(e.target.value)}
            className="p-2 border rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white text-sm"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            onChange={(e) => setSortOption(e.target.value)}
            className="p-2 border rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white text-sm"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="high">Amount: High to Low</option>
            <option value="low">Amount: Low to High</option>
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto mb-4">
        {sortedTransactions.length > 0 ? (
          <ul className="space-y-2">
            {sortedTransactions.map((entry) => (
              <li
                key={entry._id}
                className="bg-gray-200 dark:bg-gray-700 p-3 rounded-md flex flex-col sm:flex-row sm:justify-between sm:items-center hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                <div className="flex justify-between items-center sm:block">
                  <span
                    className={`font-bold ${
                      type === "expense" ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {formatCurrency(entry.amount, entry.type)}
                  </span>
                  <button
                    onClick={() => handleDelete(entry._id)}
                    className="text-red-500 hover:text-red-700 p-1 transition-colors sm:hidden"
                    disabled={isDeleting === entry._id}
                    aria-label="Delete transaction"
                  >
                    {isDeleting === entry._id ? "⏳" : "🗑️"}
                  </button>
                </div>

                <div className="flex-1 mx-0 sm:mx-4 mt-2 sm:mt-0">
                  <div className="font-medium flex items-center gap-1">
                    <FiTag className="text-gray-500 dark:text-gray-400" size={14} />
                    {entry.category}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 flex flex-wrap items-center gap-1 mt-1">
                    <FiCalendar className="text-gray-500 dark:text-gray-400" size={14} />
                    {new Date(entry.date).toLocaleDateString()}{" "}
                    {entry.description && (
                      <>
                        <span className="mx-1">•</span>
                        <FiInfo className="text-gray-500 dark:text-gray-400" size={14} />
                        <span className="truncate max-w-[120px]">
                          {entry.description}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(entry._id)}
                  className="text-red-500 hover:text-red-700 p-1 transition-colors hidden sm:block"
                  disabled={isDeleting === entry._id}
                  aria-label="Delete transaction"
                >
                  {isDeleting === entry._id ? "⏳" : "🗑️"}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 py-8">
            <FaRupeeSign size={32} className="mb-4 opacity-50" />
            <p className="text-center">No transactions found</p>
            <p className="text-sm mt-1 text-center">
              Add a new {type} to get started
            </p>
          </div>
        )}
      </div>

      {sortedTransactions.length > 0 && (
        <div
          className={`mt-auto pt-4 border-t border-gray-300 dark:border-gray-600 ${
            type === "expense" ? "text-red-600" : "text-green-600"
          }`}
        >
          <h3 className="text-base sm:text-lg font-bold flex justify-between items-center">
            <span>Total:</span>
            <span>
              {type === "expense" ? "-" : ""}
              {currency}
              {Math.abs(total).toLocaleString()}
            </span>
          </h3>
        </div>
      )}
    </div>
  );
};

export default TransactionPanel;