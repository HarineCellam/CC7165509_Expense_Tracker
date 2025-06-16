// import { useState } from "react";

// const TransactionForm = ({ addTransaction, type }) => {
//   const [form, setForm] = useState({ amount: "", category: "", date: "", description: "", currency: localStorage.getItem("currency") || "₹" });

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleCurrencyChange = (e) => {
//     setForm({ ...form, currency: e.target.value });
//     localStorage.setItem("currency", e.target.value); // Store the selected currency
//   };

// //   const handleSubmit = (e) => {
// //   e.preventDefault();
// //   if (!form.amount || !form.category || !form.date) return;

// //   addTransaction({
// //     ...form,
// //     id: Date.now(),
// //     amount: Number(form.amount),
// //     type,
// //     currency: form.currency, // Ensuring currency is included
// //   });

// //   setForm({ amount: "", category: "", date: "", description: "", currency: localStorage.getItem("currency") || "₹" });
// // };

//   const handleSubmit = (e) => {
//   e.preventDefault();
//   if (!form.amount || !form.category || !form.date) return;

//   const userId = localStorage.getItem("userId") || "guest"; // Default to 'guest' if no user is logged in

//   const newEntry = { ...form, id: Date.now(), amount: Number(form.amount), type, userId };

//   // Retrieve existing transactions for this user
//   const savedTransactions = JSON.parse(localStorage.getItem(`transactions_${userId}`)) || [];

//   // Update and store transactions
//   localStorage.setItem(`transactions_${userId}`, JSON.stringify([...savedTransactions, newEntry]));

//   setForm({ amount: "", category: "", date: "", description: "", currency: localStorage.getItem("currency") || "₹" });
// };
//   return (
//     <div className="p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md w-full max-w-md">
//       <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">{type === "income" ? "Add Income" : "Add Expense"}</h2>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div className="flex items-center gap-2 border rounded-md p-2">
//           <select name="currency" value={form.currency} onChange={handleCurrencyChange} className="bg-white dark:bg-gray-700 text-gray-800 dark:text-white p-2 rounded-md focus:outline-none">
//             <option value="₹">₹</option>
//             <option value="$">$</option>
//             <option value="€">€</option>
//             <option value="£">£</option>
//           </select>
//           <input type="number" name="amount" placeholder="Amount" value={form.amount} onChange={handleChange} className="flex-1 p-1 focus:outline-none" required />
//         </div>

//         <select name="category" value={form.category} onChange={handleChange} className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white" required>
//           <option value="">Select Category</option>
//           <option value="Salary">Salary</option>
//           <option value="Freelance">Freelance</option>
//           <option value="Investments">Investments</option>
//         </select>
//         <input type="date" name="date" value={form.date} onChange={handleChange} className="w-full p-2 border rounded-md" required />
//         <input type="text" name="description" placeholder="Description (optional)" value={form.description} onChange={handleChange} className="w-full p-2 border rounded-md" />
//         <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md">
//           {type === "income" ? "Add Income" : "Add Expense"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default TransactionForm;

import { useState } from "react";

const TransactionForm = ({ addTransaction, type }) => {
  const [form, setForm] = useState({ amount: "", category: "", date: "", description: "", currency: localStorage.getItem("currency") || "₹" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCurrencyChange = (e) => {
    setForm({ ...form, currency: e.target.value });
    localStorage.setItem("currency", e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.amount || !form.category || !form.date) return;

    const userId = localStorage.getItem("userId") || "guest";

    addTransaction({
      ...form,
      id: Date.now(),
      amount: Number(form.amount),
      type,
      userId,
      currency: form.currency,
    });

    setForm({ amount: "", category: "", date: "", description: "", currency: localStorage.getItem("currency") || "₹" });
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">{type === "income" ? "Add Income" : "Add Expense"}</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-2 border rounded-md p-2">
          <select name="currency" value={form.currency} onChange={handleCurrencyChange} className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white p-2 rounded-md">
            <option value="₹">₹ (INR)</option>
            <option value="$">$ (USD)</option>
            <option value="€">€ (EUR)</option>
            <option value="£">£ (GBP)</option>
          </select>
          <input type="number" name="amount" placeholder="Amount" value={form.amount} onChange={handleChange} className="flex-1 p-1 focus:outline-none" required />
        </div>

        <select name="category" value={form.category} onChange={handleChange} className="w-full p-2 border rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white" required>
          <option value="">Select Category</option>
          <option value="Salary">Salary</option>
          <option value="Freelance">Freelance</option>
          <option value="Investments">Investments</option>
        </select>
        <input type="date" name="date" value={form.date} onChange={handleChange} className="w-full p-2 border rounded-md" required />
        <input type="text" name="description" placeholder="Description (optional)" value={form.description} onChange={handleChange} className="w-full p-2 border rounded-md" />
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md">
          {type === "income" ? "Add Income" : "Add Expense"}
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;