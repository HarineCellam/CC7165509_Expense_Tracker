import { useEffect, useState } from "react";
import AddIncome from "../components/AddIncome";

const Income = () => {
  const [income, setIncome] = useState([]);

  // Load saved income from localStorage
  useEffect(() => {
    const savedIncome = JSON.parse(localStorage.getItem("income")) || [];
    setIncome(savedIncome);
  }, []);

  // Save income to localStorage
  useEffect(() => {
    localStorage.setItem("income", JSON.stringify(income));
  }, [income]);

  const addIncome = (newEntry) => {
    setIncome([...income, newEntry]);
  };

  return (
    <div className="flex gap-6 p-6">
      {/* Add Income Form */}
      <AddIncome addIncome={addIncome} />

      {/* Income List */}
      <div className="flex-1 bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md overflow-y-auto">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Income History</h3>
        <ul className="space-y-2">
          {income.map((entry) => (
            <li key={entry.id} className="bg-gray-200 dark:bg-gray-700 p-3 rounded-md flex justify-between">
              <span className="font-bold">₹{entry.amount}</span>
              <span>{entry.category} - {entry.date}</span>
            </li>
          ))}
        </ul>
        <h3 className="mt-4 text-lg font-bold text-gray-800 dark:text-white">Total Income: ₹{income.reduce((sum, entry) => sum + entry.amount, 0)}</h3>
      </div>
    </div>
  );
};

export default Income;