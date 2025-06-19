import { useState } from "react";
import api from "../api";

const TransactionForm = ({ addTransaction, type }) => {
  const [form, setForm] = useState({ 
    amount: "", 
    category: "", 
    date: new Date().toISOString().split('T')[0], 
    description: "", 
    currency: localStorage.getItem("currency") || "₹" 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const incomeCategories = ["Salary", "Freelance", "Investments", "Gifts", "Other"];
  const expenseCategories = ["Food", "Rent", "Transport", "Entertainment", "Utilities", "Shopping", "Other"];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCurrencyChange = (e) => {
    setForm({ ...form, currency: e.target.value });
    localStorage.setItem("currency", e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.amount || !form.category || !form.date) return;

    setIsSubmitting(true);
    try {
      const transactionData = {
        ...form,
        amount: Number(form.amount),
        type,
        currency: form.currency,
      };

      const response = await api.post('/api/transactions', transactionData);
      addTransaction(response.data);
      
      setForm({ 
        amount: "", 
        category: "", 
        date: new Date().toISOString().split('T')[0], 
        description: "", 
        currency: localStorage.getItem("currency") || "₹" 
      });
    } catch (error) {
      console.error("Failed to add transaction:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
        {type === "income" ? "Add Income" : "Add Expense"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-2 border rounded-md p-2">
          <select 
            name="currency" 
            value={form.currency} 
            onChange={handleCurrencyChange} 
            className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white p-2 rounded-md"
          >
            <option value="₹">₹ (INR)</option>
            <option value="$">$ (USD)</option>
            <option value="€">€ (EUR)</option>
            <option value="£">£ (GBP)</option>
          </select>
          <input 
            type="number" 
            name="amount" 
            placeholder="Amount" 
            value={form.amount} 
            onChange={handleChange} 
            className="flex-1 p-1 focus:outline-none" 
            required 
          />
        </div>

        <select 
          name="category" 
          value={form.category} 
          onChange={handleChange} 
          className="w-full p-2 border rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white" 
          required
        >
          <option value="">Select Category</option>
          {(type === "income" ? incomeCategories : expenseCategories).map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        
        <input 
          type="date" 
          name="date" 
          value={form.date} 
          onChange={handleChange} 
          className="w-full p-2 border rounded-md" 
          required 
        />
        <input 
          type="text" 
          name="description" 
          placeholder="Description (optional)" 
          value={form.description} 
          onChange={handleChange} 
          className="w-full p-2 border rounded-md" 
        />
        <button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processing..." : (type === "income" ? "Add Income" : "Add Expense")}
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;