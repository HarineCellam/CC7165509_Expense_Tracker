// import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js';
// import { useEffect, useState } from 'react';
// import { FaFileDownload, FaRupeeSign } from 'react-icons/fa';
// import * as XLSX from 'xlsx';
// import BarChart from '../components/charts/BarChart';

// // Register Chart.js components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement
// );

// const Report = () => {
//   const [reportType, setReportType] = useState('all');
//   const [timeRange, setTimeRange] = useState('monthly');
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');
//   const [reportData, setReportData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Fetch and process data
//   useEffect(() => {
//     const fetchData = () => {
//       setLoading(true);
      
//       // Get data from localStorage
//       const userId = localStorage.getItem('userId') || 'guest';
//       const transactions = JSON.parse(localStorage.getItem(`transactions_${userId}`)) || [];
//       const budgets = JSON.parse(localStorage.getItem(`budgets_${userId}`)) || [];
      
//       // Process data based on filters
//       const processedData = processData(transactions, budgets, reportType, timeRange, startDate, endDate);
      
//       setReportData(processedData);
//       setLoading(false);
//     };

//     fetchData();
//   }, [reportType, timeRange, startDate, endDate]);

//   const processData = (transactions, budgets, type, range, start, end) => {
//     // Filter transactions by date range
//     let filteredTransactions = transactions;
//     if (start && end) {
//       filteredTransactions = transactions.filter(t => {
//         const date = new Date(t.date);
//         return date >= new Date(start) && date <= new Date(end);
//       });
//     }

//     // Filter by report type
//     if (type === 'income') {
//       filteredTransactions = filteredTransactions.filter(t => t.type === 'income');
//     } else if (type === 'expense') {
//       filteredTransactions = filteredTransactions.filter(t => t.type === 'expense');
//     }

//     // Group data by time range
//     let groupedData = {};
//     const now = new Date();
    
//     if (range === 'monthly') {
//       // Group by month
//       const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
//       filteredTransactions.forEach(t => {
//         const date = new Date(t.date);
//         const month = months[date.getMonth()];
//         const year = date.getFullYear();
//         const key = `${month} ${year}`;
        
//         if (!groupedData[key]) {
//           groupedData[key] = { income: 0, expense: 0 };
//         }
        
//         if (t.type === 'income') {
//           groupedData[key].income += t.amount;
//         } else {
//           groupedData[key].expense += Math.abs(t.amount); // Use absolute value for expenses
//         }
//       });
//     } else if (range === 'weekly') {
//       // Group by week
//       filteredTransactions.forEach(t => {
//         const date = new Date(t.date);
//         const week = getWeekNumber(date);
//         const key = `Week ${week}`;
        
//         if (!groupedData[key]) {
//           groupedData[key] = { income: 0, expense: 0 };
//         }
        
//         if (t.type === 'income') {
//           groupedData[key].income += t.amount;
//         } else {
//           groupedData[key].expense += Math.abs(t.amount); // Use absolute value for expenses
//         }
//       });
//     }

//     // Process category data
//     const categoryData = {};
//     filteredTransactions.forEach(t => {
//       if (!categoryData[t.category]) {
//         categoryData[t.category] = { income: 0, expense: 0 };
//       }
      
//       if (t.type === 'income') {
//         categoryData[t.category].income += t.amount;
//       } else {
//         categoryData[t.category].expense += Math.abs(t.amount); // Use absolute value for expenses
//       }
//     });

//     // Process budget vs actual
//     const budgetComparison = {};
//     budgets.forEach(b => {
//       const spent = filteredTransactions
//         .filter(t => t.type === 'expense' && t.category === b.category)
//         .reduce((sum, t) => sum + Math.abs(t.amount), 0); // Use absolute value for expenses
      
//       budgetComparison[b.category] = {
//         budget: b.amount,
//         spent: spent,
//         remaining: b.amount - spent
//       };
//     });

//     return {
//       timeSeries: groupedData,
//       categories: categoryData,
//       budgetComparison,
//       rawTransactions: filteredTransactions
//     };
//   };

//   const getWeekNumber = (date) => {
//     const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
//     const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
//     return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
//   };

//   const exportToExcel = () => {
//     if (!reportData) return;

//     const data = [];
    
//     // Add time series data
//     Object.entries(reportData.timeSeries).forEach(([period, values]) => {
//       data.push({
//         Period: period,
//         Income: values.income,
//         Expense: values.expense,
//         Net: values.income - values.expense
//       });
//     });

//     // Add category data
//     data.push({}, { Category: 'Category Breakdown' });
//     Object.entries(reportData.categories).forEach(([category, values]) => {
//       data.push({
//         Category: category,
//         Income: values.income,
//         Expense: values.expense
//       });
//     });

//     // Add budget data
//     data.push({}, { Category: 'Budget Comparison' });
//     Object.entries(reportData.budgetComparison).forEach(([category, values]) => {
//       data.push({
//         Category: category,
//         Budget: values.budget,
//         Spent: values.spent,
//         Remaining: values.remaining,
//         Percentage: `${Math.round((values.spent / values.budget) * 100)}%`
//       });
//     });

//     const ws = XLSX.utils.json_to_sheet(data);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Financial Report");
//     XLSX.writeFile(wb, "financial_report.xlsx");
//   };

//   // Calculate totals
//   const totalIncome = reportData ? Object.values(reportData.timeSeries).reduce((sum, d) => sum + d.income, 0) : 0;
//   const totalExpense = reportData ? Object.values(reportData.timeSeries).reduce((sum, d) => sum + d.expense, 0) : 0;
//   const netBalance = totalIncome - totalExpense;

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Financial Reports</h1>
//           <button 
//             onClick={exportToExcel}
//             className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
//           >
//             <FaFileDownload /> Export to Excel
//           </button>
//         </div>

//         {/* Filters */}
//         <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6">
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="flex-1">
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Report Type</label>
//               <select
//                 value={reportType}
//                 onChange={(e) => setReportType(e.target.value)}
//                 className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white"
//               >
//                 <option value="all">Income & Expense</option>
//                 <option value="income">Income Only</option>
//                 <option value="expense">Expense Only</option>
//               </select>
//             </div>

//             <div className="flex-1">
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time Range</label>
//               <select
//                 value={timeRange}
//                 onChange={(e) => setTimeRange(e.target.value)}
//                 className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white"
//               >
//                 <option value="monthly">Monthly</option>
//                 <option value="weekly">Weekly</option>
//               </select>
//             </div>

//             <div className="flex-1">
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
//               <input
//                 type="date"
//                 value={startDate}
//                 onChange={(e) => setStartDate(e.target.value)}
//                 className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white"
//               />
//             </div>

//             <div className="flex-1">
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
//               <input
//                 type="date"
//                 value={endDate}
//                 onChange={(e) => setEndDate(e.target.value)}
//                 className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Summary Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//           <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
//             <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Total Income</h3>
//             <p className="text-2xl font-bold text-green-600">
//               <FaRupeeSign className="inline mr-1" />
//               {totalIncome.toLocaleString()}
//             </p>
//           </div>
//           <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
//             <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Total Expense</h3>
//             <p className="text-2xl font-bold text-red-600">
//               <FaRupeeSign className="inline mr-1" />
//               {totalExpense.toLocaleString()}
//             </p>
//           </div>
//           <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
//             <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Net Balance</h3>
//             <p className={`text-2xl font-bold ${netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
//               <FaRupeeSign className="inline mr-1" />
//               {netBalance.toLocaleString()}
//             </p>
//           </div>
//         </div>

//         {/* Charts */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
//           <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
//             <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Income vs Expense Over Time</h3>
//             <BarChart 
//               data={{
//                 labels: reportData ? Object.keys(reportData.timeSeries) : [],
//                 datasets: [
//                   {
//                     label: 'Income',
//                     data: reportData ? Object.values(reportData.timeSeries).map(d => d.income) : [],
//                     backgroundColor: 'rgba(54, 162, 235, 0.7)',
//                     borderColor: 'rgba(54, 162, 235, 1)',
//                     borderWidth: 1
//                   },
//                   {
//                     label: 'Expense',
//                     data: reportData ? Object.values(reportData.timeSeries).map(d => d.expense) : [],
//                     backgroundColor: 'rgba(255, 99, 132, 0.7)',
//                     borderColor: 'rgba(255, 99, 132, 1)',
//                     borderWidth: 1
//                   }
//                 ]
//               }}
//               options={{
//                 responsive: true,
//                 plugins: {
//                   legend: {
//                     position: 'top',
//                   },
//                   title: {
//                     display: true,
//                     text: 'Income vs Expense Over Time',
//                   },
//                 },
//               }}
//             />
//           </div>
//           <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
//             <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Category Breakdown</h3>
//             <BarChart 
//               data={{
//                 labels: reportData ? Object.keys(reportData.categories) : [],
//                 datasets: [
//                   {
//                     label: 'Income',
//                     data: reportData ? Object.values(reportData.categories).map(d => d.income) : [],
//                     backgroundColor: 'rgba(75, 192, 192, 0.7)',
//                     borderColor: 'rgba(75, 192, 192, 1)',
//                     borderWidth: 1
//                   },
//                   {
//                     label: 'Expense',
//                     data: reportData ? Object.values(reportData.categories).map(d => d.expense) : [],
//                     backgroundColor: 'rgba(153, 102, 255, 0.7)',
//                     borderColor: 'rgba(153, 102, 255, 1)',
//                     borderWidth: 1
//                   }
//                 ]
//               }}
//               options={{
//                 responsive: true,
//                 plugins: {
//                   legend: {
//                     position: 'top',
//                   },
//                   title: {
//                     display: true,
//                     text: 'Category Breakdown',
//                   },
//                 },
//               }}
//             />
//           </div>
//         </div>

//         {/* Budget Comparison */}
//         {reportType !== 'income' && (
//           <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6">
//             <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Budget vs Actual Spending</h3>
//             <BarChart 
//               data={{
//                 labels: reportData ? Object.keys(reportData.budgetComparison) : [],
//                 datasets: [
//                   {
//                     label: 'Budget',
//                     data: reportData ? Object.values(reportData.budgetComparison).map(d => d.budget) : [],
//                     backgroundColor: 'rgba(54, 162, 235, 0.7)',
//                     borderColor: 'rgba(54, 162, 235, 1)',
//                     borderWidth: 1
//                   },
//                   {
//                     label: 'Actual',
//                     data: reportData ? Object.values(reportData.budgetComparison).map(d => d.spent) : [],
//                     backgroundColor: 'rgba(255, 99, 132, 0.7)',
//                     borderColor: 'rgba(255, 99, 132, 1)',
//                     borderWidth: 1
//                   }
//                 ]
//               }}
//               options={{
//                 responsive: true,
//                 plugins: {
//                   legend: {
//                     position: 'top',
//                   },
//                   title: {
//                     display: true,
//                     text: 'Budget vs Actual Spending',
//                   },
//                 },
//               }}
//             />
//           </div>
//         )}

//         {/* Transaction Table */}
//         <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md overflow-x-auto">
//           <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Transaction Details</h3>
//           <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//             <thead className="bg-gray-50 dark:bg-gray-700">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
//               {reportData && reportData.rawTransactions.length > 0 ? (
//                 reportData.rawTransactions.map((transaction, index) => (
//                   <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
//                       {new Date(transaction.date).toLocaleDateString()}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
//                       {transaction.description}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
//                       {transaction.category}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm">
//                       <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                         transaction.type === 'income' 
//                           ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
//                           : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
//                       }`}>
//                         {transaction.type}
//                       </span>
//                     </td>
//                     <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
//                       transaction.type === 'income' 
//                         ? 'text-green-600 dark:text-green-400' 
//                         : 'text-red-600 dark:text-red-400'
//                     }`}>
//                       <FaRupeeSign className="inline mr-1" />
//                       {Math.abs(transaction.amount).toLocaleString()}
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
//                     No transactions found for the selected filters
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Report;

// import {
//   ArcElement,
//   BarElement,
//   CategoryScale,
//   Chart as ChartJS,
//   Legend,
//   LinearScale,
//   Title,
//   Tooltip,
// } from "chart.js";
// import { useEffect, useState } from "react";
// import { FaFileDownload } from "react-icons/fa";
// import * as XLSX from "xlsx";
// import BarChart from "../components/charts/BarChart";
// import PieChart from "../components/charts/PieChart";

// // Register Chart.js components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement
// );

// const Report = () => {
//   const [reportType, setReportType] = useState("all"); // all/income/expense
//   const [timeRange, setTimeRange] = useState("monthly"); // monthly/weekly
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [reportData, setReportData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Fetch and process data when filters change
//   useEffect(() => {
//     const fetchData = () => {
//       setLoading(true);

//       // Use the stored transactions and budgets (assumed to be stored by userId)
//       const userId = localStorage.getItem("userId") || "guest";
//       const transactions =
//         JSON.parse(localStorage.getItem(`transactions_${userId}`)) || [];
//       const budgets =
//         JSON.parse(localStorage.getItem(`budgets_${userId}`)) || [];

//       // Process data based on filters
//       const processedData = processData(
//         transactions,
//         budgets,
//         reportType,
//         timeRange,
//         startDate,
//         endDate
//       );
//       setReportData(processedData);
//       setLoading(false);
//     };

//     fetchData();
//   }, [reportType, timeRange, startDate, endDate]);

//   const processData = (transactions, budgets, type, range, start, end) => {
//     // Filter transactions by date range
//     let filteredTransactions = transactions;
//     if (start && end) {
//       filteredTransactions = transactions.filter((t) => {
//         const date = new Date(t.date);
//         return date >= new Date(start) && date <= new Date(end);
//       });
//     }
//     // Filter by report type if not "all"
//     if (type === "income") {
//       filteredTransactions = filteredTransactions.filter(
//         (t) => t.type === "income"
//       );
//     } else if (type === "expense") {
//       filteredTransactions = filteredTransactions.filter(
//         (t) => t.type === "expense"
//       );
//     }

//     // Group data by time range
//     let groupedData = {};
//     if (range === "monthly") {
//       const months = [
//         "Jan",
//         "Feb",
//         "Mar",
//         "Apr",
//         "May",
//         "Jun",
//         "Jul",
//         "Aug",
//         "Sep",
//         "Oct",
//         "Nov",
//         "Dec",
//       ];
//       filteredTransactions.forEach((t) => {
//         if (!t.date) return;
//         const date = new Date(t.date);
//         const month = months[date.getMonth()];
//         const year = date.getFullYear();
//         const key = `${month} ${year}`;
//         if (!groupedData[key]) {
//           groupedData[key] = { income: 0, expense: 0 };
//         }
//         if (t.type === "income") {
//           groupedData[key].income += t.amount;
//         } else if (t.type === "expense") {
//           groupedData[key].expense += Math.abs(t.amount);
//         }
//       });
//     } else if (range === "weekly") {
//       // Group by week number
//       filteredTransactions.forEach((t) => {
//         if (!t.date) return;
//         const date = new Date(t.date);
//         const week = getWeekNumber(date);
//         const key = `Week ${week}`;
//         if (!groupedData[key]) {
//           groupedData[key] = { income: 0, expense: 0 };
//         }
//         if (t.type === "income") {
//           groupedData[key].income += t.amount;
//         } else if (t.type === "expense") {
//           groupedData[key].expense += Math.abs(t.amount);
//         }
//       });
//     }

//     // Process category data for expenses (or income, if needed)
//     const categoryData = {};
//     filteredTransactions.forEach((t) => {
//       if (!categoryData[t.category]) {
//         categoryData[t.category] = { income: 0, expense: 0 };
//       }
//       if (t.type === "income") {
//         categoryData[t.category].income += t.amount;
//       } else {
//         categoryData[t.category].expense += Math.abs(t.amount);
//       }
//     });

//     // Process budget vs. actual
//     const budgetComparison = {};
//     budgets.forEach((b) => {
//       const spent = filteredTransactions
//         .filter((t) => t.type === "expense" && t.category === b.category)
//         .reduce((sum, t) => sum + Math.abs(t.amount), 0);
//       budgetComparison[b.category] = {
//         budget: b.amount,
//         spent: spent,
//         remaining: b.amount - spent,
//       };
//     });

//     return {
//       timeSeries: groupedData,
//       categories: categoryData,
//       budgetComparison,
//       rawTransactions: filteredTransactions,
//     };
//   };

//   const getWeekNumber = (date) => {
//     const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
//     const pastDays = (date - firstDayOfYear) / 86400000;
//     return Math.ceil((pastDays + firstDayOfYear.getDay() + 1) / 7);
//   };

//   // Export reportData to an Excel file
//   const exportToExcel = () => {
//     if (!reportData) return;
//     const data = [];

//     // Time series data
//     Object.entries(reportData.timeSeries).forEach(([period, values]) => {
//       data.push({
//         Period: period,
//         Income: values.income,
//         Expense: values.expense,
//         Net: values.income - values.expense,
//       });
//     });

//     // Category breakdown
//     data.push({});
//     data.push({ Category: "Category Breakdown" });
//     Object.entries(reportData.categories).forEach(([category, values]) => {
//       data.push({
//         Category: category,
//         Income: values.income,
//         Expense: values.expense,
//       });
//     });

//     // Budget comparison
//     data.push({});
//     data.push({ Category: "Budget Comparison" });
//     Object.entries(reportData.budgetComparison).forEach(
//       ([category, values]) => {
//         data.push({
//           Category: category,
//           Budget: values.budget,
//           Spent: values.spent,
//           Remaining: values.remaining,
//           Percentage: `${Math.round((values.spent / values.budget) * 100)}%`,
//         });
//       }
//     );

//     const worksheet = XLSX.utils.json_to_sheet(data);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Financial Report");
//     XLSX.writeFile(workbook, "financial_report.xlsx");
//   };

//   // Calculate totals from the time series data
//   const totalIncome = reportData
//     ? Object.values(reportData.timeSeries).reduce((sum, d) => sum + d.income, 0)
//     : 0;
//   const totalExpense = reportData
//     ? Object.values(reportData.timeSeries).reduce((sum, d) => sum + d.expense, 0)
//     : 0;
//   const netBalance = totalIncome - totalExpense;

//   const formatCurrency = (amount) => {
//     return `₹${amount.toLocaleString()}`;
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 md:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
//       <div className="max-w-6xl mx-auto">
//         <header className="mb-8">
//           <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
//             Financial Report
//           </h1>
//           <p className="text-gray-600 dark:text-gray-400 mt-2">
//             View and export your financial data.
//           </p>
//         </header>

//         {/* Filter Options */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//           <div>
//             <label className="block text-sm mb-1">Report Type</label>
//             <select
//               value={reportType}
//               onChange={(e) => setReportType(e.target.value)}
//               className="w-full p-2 rounded border"
//             >
//               <option value="all">All</option>
//               <option value="income">Income</option>
//               <option value="expense">Expense</option>
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm mb-1">Time Range</label>
//             <select
//               value={timeRange}
//               onChange={(e) => setTimeRange(e.target.value)}
//               className="w-full p-2 rounded border"
//             >
//               <option value="monthly">Monthly</option>
//               <option value="weekly">Weekly</option>
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm mb-1">Start Date</label>
//             <input
//               type="date"
//               value={startDate}
//               onChange={(e) => setStartDate(e.target.value)}
//               className="w-full p-2 rounded border"
//             />
//           </div>
//           <div>
//             <label className="block text-sm mb-1">End Date</label>
//             <input
//               type="date"
//               value={endDate}
//               onChange={(e) => setEndDate(e.target.value)}
//               className="w-full p-2 rounded border"
//             />
//           </div>
//         </div>

//         {/* Charts */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//           {barChartData && <BarChart chartData={barChartData} />}
//           {pieChartData && <PieChart chartData={pieChartData} />}
//         </div>

//         {/* Totals and Export Button */}
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//           <div className="mb-4 md:mb-0">
//             <h3 className="text-xl font-bold">
//               Total Income:{" "}
//               <span className="text-green-600">{formatCurrency(totalIncome)}</span>
//             </h3>
//             <h3 className="text-xl font-bold">
//               Total Expense:{" "}
//               <span className="text-red-600">{formatCurrency(totalExpense)}</span>
//             </h3>
//             <h3 className="text-xl font-bold">
//               Net Balance:{" "}
//               <span className="text-blue-600">{formatCurrency(netBalance)}</span>
//             </h3>
//           </div>
//           <button
//             onClick={exportToExcel}
//             className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-300"
//           >
//             <FaFileDownload className="mr-2" />
//             Export to Excel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Report;

// import {
//   ArcElement,
//   BarElement,
//   CategoryScale,
//   Chart as ChartJS,
//   Legend,
//   LinearScale,
//   Title,
//   Tooltip,
// } from "chart.js";
// import { useEffect, useState } from "react";
// import { FaFileDownload } from "react-icons/fa";
// import * as XLSX from "xlsx";
// import BarChart from "../components/charts/BarChart";
// import PieChart from "../components/charts/PieChart";

// // Register Chart.js components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement
// );

// const Report = () => {
//   const [reportType, setReportType] = useState("all");
//   const [timeRange, setTimeRange] = useState("monthly");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [reportData, setReportData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [barChartData, setBarChartData] = useState(null);
//   const [pieChartData, setPieChartData] = useState(null);

//   // Fetch and process data when filters change
//   useEffect(() => {
//     const fetchData = () => {
//       setLoading(true);

//       const userId = localStorage.getItem("userId") || "guest";
//       const transactions =
//         JSON.parse(localStorage.getItem(`transactions_${userId}`)) || [];
//       const budgets =
//         JSON.parse(localStorage.getItem(`budgets_${userId}`)) || [];

//       const processedData = processData(
//         transactions,
//         budgets,
//         reportType,
//         timeRange,
//         startDate,
//         endDate
//       );
//       setReportData(processedData);
      
//       // Prepare chart data
//       prepareChartData(processedData);
//       setLoading(false);
//     };

//     fetchData();
//   }, [reportType, timeRange, startDate, endDate]);

//   const prepareChartData = (data) => {
//     if (!data) return;

//     // Prepare bar chart data
//     const barData = {
//       labels: Object.keys(data.timeSeries),
//       datasets: [
//         {
//           label: "Income",
//           data: Object.values(data.timeSeries).map(d => d.income),
//           backgroundColor: "rgba(54, 162, 235, 0.6)",
//           borderColor: "rgba(54, 162, 235, 1)",
//           borderWidth: 1,
//         },
//         {
//           label: "Expense",
//           data: Object.values(data.timeSeries).map(d => d.expense),
//           backgroundColor: "rgba(255, 99, 132, 0.6)",
//           borderColor: "rgba(255, 99, 132, 1)",
//           borderWidth: 1,
//         },
//       ],
//     };

//     // Prepare pie chart data (expenses by category)
//     const pieData = {
//       labels: Object.keys(data.categories),
//       datasets: [
//         {
//           data: Object.values(data.categories).map(d => d.expense),
//           backgroundColor: [
//             "#FF6384",
//             "#36A2EB",
//             "#FFCE56",
//             "#4BC0C0",
//             "#9966FF",
//             "#FF9F40",
//           ],
//           borderColor: "#fff",
//           borderWidth: 1,
//         },
//       ],
//     };

//     setBarChartData({
//       data: barData,
//       options: {
//         responsive: true,
//         plugins: {
//           legend: {
//             position: "top",
//           },
//           title: {
//             display: true,
//             text: "Income vs Expense Over Time",
//           },
//         },
//       },
//     });

//     setPieChartData({
//       data: pieData,
//       options: {
//         responsive: true,
//         plugins: {
//           legend: {
//             position: "bottom",
//           },
//           title: {
//             display: true,
//             text: "Expenses by Category",
//           },
//         },
//       },
//     });
//   };

//   const processData = (transactions, budgets, type, range, start, end) => {
//     // Filter transactions by date range
//     let filteredTransactions = transactions;
//     if (start && end) {
//       filteredTransactions = transactions.filter((t) => {
//         const date = new Date(t.date);
//         return date >= new Date(start) && date <= new Date(end);
//       });
//     }
    
//     // Filter by report type if not "all"
//     if (type === "income") {
//       filteredTransactions = filteredTransactions.filter(
//         (t) => t.type === "income"
//       );
//     } else if (type === "expense") {
//       filteredTransactions = filteredTransactions.filter(
//         (t) => t.type === "expense"
//       );
//     }

//     // Group data by time range
//     let groupedData = {};
//     if (range === "monthly") {
//       const months = [
//         "Jan", "Feb", "Mar", "Apr", "May", "Jun",
//         "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
//       ];
//       filteredTransactions.forEach((t) => {
//         if (!t.date) return;
//         const date = new Date(t.date);
//         const month = months[date.getMonth()];
//         const year = date.getFullYear();
//         const key = `${month} ${year}`;
//         if (!groupedData[key]) {
//           groupedData[key] = { income: 0, expense: 0 };
//         }
//         if (t.type === "income") {
//           groupedData[key].income += t.amount;
//         } else if (t.type === "expense") {
//           groupedData[key].expense += Math.abs(t.amount);
//         }
//       });
//     } else if (range === "weekly") {
//       filteredTransactions.forEach((t) => {
//         if (!t.date) return;
//         const date = new Date(t.date);
//         const week = getWeekNumber(date);
//         const key = `Week ${week}`;
//         if (!groupedData[key]) {
//           groupedData[key] = { income: 0, expense: 0 };
//         }
//         if (t.type === "income") {
//           groupedData[key].income += t.amount;
//         } else if (t.type === "expense") {
//           groupedData[key].expense += Math.abs(t.amount);
//         }
//       });
//     }

//     // Process category data
//     const categoryData = {};
//     filteredTransactions.forEach((t) => {
//       if (!categoryData[t.category]) {
//         categoryData[t.category] = { income: 0, expense: 0 };
//       }
//       if (t.type === "income") {
//         categoryData[t.category].income += t.amount;
//       } else {
//         categoryData[t.category].expense += Math.abs(t.amount);
//       }
//     });

//     // Process budget vs. actual
//     const budgetComparison = {};
//     budgets.forEach((b) => {
//       const spent = filteredTransactions
//         .filter((t) => t.type === "expense" && t.category === b.category)
//         .reduce((sum, t) => sum + Math.abs(t.amount), 0);
//       budgetComparison[b.category] = {
//         budget: b.amount,
//         spent: spent,
//         remaining: b.amount - spent,
//       };
//     });

//     return {
//       timeSeries: groupedData,
//       categories: categoryData,
//       budgetComparison,
//       rawTransactions: filteredTransactions,
//     };
//   };

//   const getWeekNumber = (date) => {
//     const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
//     const pastDays = (date - firstDayOfYear) / 86400000;
//     return Math.ceil((pastDays + firstDayOfYear.getDay() + 1) / 7);
//   };

//   const exportToExcel = () => {
//     if (!reportData) return;
//     const data = [];

//     // Time series data
//     Object.entries(reportData.timeSeries).forEach(([period, values]) => {
//       data.push({
//         Period: period,
//         Income: values.income,
//         Expense: values.expense,
//         Net: values.income - values.expense,
//       });
//     });

//     // Category breakdown
//     data.push({});
//     data.push({ Category: "Category Breakdown" });
//     Object.entries(reportData.categories).forEach(([category, values]) => {
//       data.push({
//         Category: category,
//         Income: values.income,
//         Expense: values.expense,
//       });
//     });

//     // Budget comparison
//     data.push({});
//     data.push({ Category: "Budget Comparison" });
//     Object.entries(reportData.budgetComparison).forEach(
//       ([category, values]) => {
//         data.push({
//           Category: category,
//           Budget: values.budget,
//           Spent: values.spent,
//           Remaining: values.remaining,
//           Percentage: `${Math.round((values.spent / values.budget) * 100)}%`,
//         });
//       }
//     );

//     const worksheet = XLSX.utils.json_to_sheet(data);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Financial Report");
//     XLSX.writeFile(workbook, "financial_report.xlsx");
//   };

//   const totalIncome = reportData
//     ? Object.values(reportData.timeSeries).reduce((sum, d) => sum + d.income, 0)
//     : 0;
//   const totalExpense = reportData
//     ? Object.values(reportData.timeSeries).reduce((sum, d) => sum + d.expense, 0)
//     : 0;
//   const netBalance = totalIncome - totalExpense;

//   const formatCurrency = (amount) => {
//     return `₹${amount.toLocaleString()}`;
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 md:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
//       <div className="max-w-6xl mx-auto">
//         <header className="mb-8">
//           <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
//             Financial Report
//           </h1>
//           <p className="text-gray-600 dark:text-gray-400 mt-2">
//             View and export your financial data.
//           </p>
//         </header>

//         {/* Filter Options */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//           <div>
//             <label className="block text-sm mb-1">Report Type</label>
//             <select
//               value={reportType}
//               onChange={(e) => setReportType(e.target.value)}
//               className="w-full p-2 rounded border"
//             >
//               <option value="all">All</option>
//               <option value="income">Income</option>
//               <option value="expense">Expense</option>
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm mb-1">Time Range</label>
//             <select
//               value={timeRange}
//               onChange={(e) => setTimeRange(e.target.value)}
//               className="w-full p-2 rounded border"
//             >
//               <option value="monthly">Monthly</option>
//               <option value="weekly">Weekly</option>
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm mb-1">Start Date</label>
//             <input
//               type="date"
//               value={startDate}
//               onChange={(e) => setStartDate(e.target.value)}
//               className="w-full p-2 rounded border"
//             />
//           </div>
//           <div>
//             <label className="block text-sm mb-1">End Date</label>
//             <input
//               type="date"
//               value={endDate}
//               onChange={(e) => setEndDate(e.target.value)}
//               className="w-full p-2 rounded border"
//             />
//           </div>
//         </div>

//         {/* Charts */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//           {barChartData && <BarChart data={barChartData.data} options={barChartData.options} />}
//           {pieChartData && <PieChart data={pieChartData.data} options={pieChartData.options} />}
//         </div>

//         {/* Totals and Export Button */}
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//           <div className="mb-4 md:mb-0">
//             <h3 className="text-xl font-bold">
//               Total Income:{" "}
//               <span className="text-green-600">{formatCurrency(totalIncome)}</span>
//             </h3>
//             <h3 className="text-xl font-bold">
//               Total Expense:{" "}
//               <span className="text-red-600">{formatCurrency(totalExpense)}</span>
//             </h3>
//             <h3 className="text-xl font-bold">
//               Net Balance:{" "}
//               <span className={netBalance >= 0 ? "text-green-600" : "text-red-600"}>
//                 {formatCurrency(netBalance)}
//               </span>
//             </h3>
//           </div>
//           <button
//             onClick={exportToExcel}
//             className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-300"
//           >
//             <FaFileDownload className="mr-2" />
//             Export to Excel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Report;
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { useEffect, useState } from "react";
import { FaFileDownload, FaRupeeSign } from "react-icons/fa";
import * as XLSX from "xlsx";
import BarChart from "../components/charts/BarChart";
import PieChart from "../components/charts/PieChart";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Report = () => {
  const [reportType, setReportType] = useState("all");
  const [timeRange, setTimeRange] = useState("monthly");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [barChartData, setBarChartData] = useState(null);
  const [pieChartData, setPieChartData] = useState(null);

  // Fetch and process data when filters change
  useEffect(() => {
    const fetchData = () => {
      setLoading(true);

      const userId = localStorage.getItem("userId") || "guest";
      const transactions =
        JSON.parse(localStorage.getItem(`transactions_${userId}`)) || [];
      const budgets =
        JSON.parse(localStorage.getItem(`budgets_${userId}`)) || [];

      const processedData = processData(
        transactions,
        budgets,
        reportType,
        timeRange,
        startDate,
        endDate
      );
      setReportData(processedData);
      
      prepareChartData(processedData);
      setLoading(false);
    };

    fetchData();
  }, [reportType, timeRange, startDate, endDate]);

  const prepareChartData = (data) => {
    if (!data) return;

    // Bar chart data
    const barData = {
      labels: Object.keys(data.timeSeries),
      datasets: [
        {
          label: "Income",
          data: Object.values(data.timeSeries).map(d => d.income),
          backgroundColor: "rgba(54, 162, 235, 0.7)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
        {
          label: "Expense",
          data: Object.values(data.timeSeries).map(d => d.expense),
          backgroundColor: "rgba(255, 99, 132, 0.7)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
        },
      ],
    };

    // Pie chart data (expenses by category)
    const pieData = {
      labels: Object.keys(data.categories),
      datasets: [
        {
          data: Object.values(data.categories).map(d => d.expense),
          backgroundColor: [
            "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", 
            "#9966FF", "#FF9F40", "#8AC24A", "#607D8B"
          ],
          borderColor: "#fff",
          borderWidth: 1,
        },
      ],
    };

    setBarChartData({
      data: barData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
            labels: {
              color: "#6B7280",
            },
          },
          title: {
            display: true,
            text: "Income vs Expense Over Time",
            color: "#6B7280",
            font: {
              size: 16
            }
          },
        },
        scales: {
          x: {
            grid: {
              color: "rgba(209, 213, 219, 0.3)",
            },
            ticks: {
              color: "#6B7280",
            },
          },
          y: {
            grid: {
              color: "rgba(209, 213, 219, 0.3)",
            },
            ticks: {
              color: "#6B7280",
            },
          },
        },
      },
    });

    setPieChartData({
      data: pieData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "right",
            labels: {
              color: "#6B7280",
              boxWidth: 15,
              padding: 15
            },
          },
          title: {
            display: true,
            text: "Expenses by Category",
            color: "#6B7280",
            font: {
              size: 16
            }
          },
        },
      },
    });
  };

  const processData = (transactions, budgets, type, range, start, end) => {
    // Filter transactions by date range
    let filteredTransactions = transactions;
    if (start && end) {
      filteredTransactions = transactions.filter((t) => {
        const date = new Date(t.date);
        return date >= new Date(start) && date <= new Date(end);
      });
    }
    
    // Filter by report type if not "all"
    if (type === "income") {
      filteredTransactions = filteredTransactions.filter(
        (t) => t.type === "income"
      );
    } else if (type === "expense") {
      filteredTransactions = filteredTransactions.filter(
        (t) => t.type === "expense"
      );
    }

    // Group data by time range
    let groupedData = {};
    if (range === "monthly") {
      const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ];
      filteredTransactions.forEach((t) => {
        if (!t.date) return;
        const date = new Date(t.date);
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        const key = `${month} ${year}`;
        if (!groupedData[key]) {
          groupedData[key] = { income: 0, expense: 0 };
        }
        if (t.type === "income") {
          groupedData[key].income += t.amount;
        } else if (t.type === "expense") {
          groupedData[key].expense += Math.abs(t.amount);
        }
      });
    } else if (range === "weekly") {
      filteredTransactions.forEach((t) => {
        if (!t.date) return;
        const date = new Date(t.date);
        const week = getWeekNumber(date);
        const key = `Week ${week}`;
        if (!groupedData[key]) {
          groupedData[key] = { income: 0, expense: 0 };
        }
        if (t.type === "income") {
          groupedData[key].income += t.amount;
        } else if (t.type === "expense") {
          groupedData[key].expense += Math.abs(t.amount);
        }
      });
    }

    // Process category data
    const categoryData = {};
    filteredTransactions.forEach((t) => {
      if (!categoryData[t.category]) {
        categoryData[t.category] = { income: 0, expense: 0 };
      }
      if (t.type === "income") {
        categoryData[t.category].income += t.amount;
      } else {
        categoryData[t.category].expense += Math.abs(t.amount);
      }
    });

    // Process budget vs. actual
    const budgetComparison = {};

  budgets.forEach((b) => {
    const categoryExpenses = filteredTransactions
      .filter(t => 
        t.type === 'expense' && 
        t.category.toLowerCase() === b.category.toLowerCase()
      )
      .reduce((sum, t) => sum + t.amount, 0); // Removed Math.abs() since amounts are positive
    
    budgetComparison[b.category] = {
      budget: b.amount,
      spent: categoryExpenses,
      remaining: b.amount - categoryExpenses,
    };
  });
    return {
      timeSeries: groupedData,
      categories: categoryData,
      budgetComparison,
      rawTransactions: filteredTransactions,
    };
  };

  const getWeekNumber = (date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDays = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDays + firstDayOfYear.getDay() + 1) / 7);
  };

  const exportToExcel = () => {
    if (!reportData) return;
    const data = [];

    // Time series data
    Object.entries(reportData.timeSeries).forEach(([period, values]) => {
      data.push({
        Period: period,
        Income: values.income,
        Expense: values.expense,
        Net: values.income - values.expense,
      });
    });

    // Category breakdown
    data.push({});
    data.push({ Category: "Category Breakdown" });
    Object.entries(reportData.categories).forEach(([category, values]) => {
      data.push({
        Category: category,
        Income: values.income,
        Expense: values.expense,
      });
    });

    // Budget comparison
    data.push({});
    data.push({ Category: "Budget Comparison" });
    Object.entries(reportData.budgetComparison).forEach(
      ([category, values]) => {
        data.push({
          Category: category,
          Budget: values.budget,
          Spent: values.spent,
          Remaining: values.remaining,
          Percentage: `${Math.round((values.spent / values.budget) * 100)}%`,
        });
      }
    );

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Financial Report");
    XLSX.writeFile(workbook, "financial_report.xlsx");
  };

  const totalIncome = reportData
    ? Object.values(reportData.timeSeries).reduce((sum, d) => sum + d.income, 0)
    : 0;
  const totalExpense = reportData
    ? Object.values(reportData.timeSeries).reduce((sum, d) => sum + d.expense, 0)
    : 0;
  const netBalance = totalIncome - totalExpense;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                Financial Reports
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Analyze and export your financial data
              </p>
            </div>
            <button
              onClick={exportToExcel}
              className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <FaFileDownload />
              <span>Export to Excel</span>
            </button>
          </div>
        </header>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Report Type
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Income & Expense</option>
                <option value="income">Income Only</option>
                <option value="expense">Expense Only</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Time Range
              </label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="monthly">Monthly</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border-l-4 border-green-500">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Income</h3>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400 flex items-center">
              <FaRupeeSign className="mr-1" />
              {Number(totalIncome).toLocaleString()}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border-l-4 border-red-500">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Expense</h3>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400 flex items-center">
              <FaRupeeSign className="mr-1" />
              {Number(totalExpense).toLocaleString()}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border-l-4 border-blue-500">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Net Balance</h3>
            <p className={`text-2xl font-bold flex items-center ${
              netBalance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              <FaRupeeSign className="mr-1" />
              {Number(netBalance).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 h-[400px]">
            {barChartData && <BarChart data={barChartData.data} options={barChartData.options} />}
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 h-[400px]">
            {pieChartData && <PieChart data={pieChartData.data} options={pieChartData.options} />}
          </div>
        </div>

        {/* Budget Comparison (only shown for expense reports) */}
      {reportType !== 'income' && reportData && (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
      Budget vs Actual Spending
    </h3>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Category
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Budget
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Spent
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Remaining
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Progress
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {Object.entries(reportData.budgetComparison).map(([category, values]) => {
            // Calculate percentage spent (cap at 100% to avoid overflow visuals)
            const percentageSpent = values.budget > 0 
              ? Math.min((values.spent / values.budget) * 100, 100) 
              : 0;
            
            // Determine status for color coding
            const status = percentageSpent > 100 ? 'over' : 
                          percentageSpent > 75 ? 'warning' : 'good';
            
            // Calculate remaining amount
            const remaining = values.budget - values.spent;

            return (
              <tr key={category} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
                  {category}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                  <div className="flex items-center">
                    <FaRupeeSign className="mr-1" />
                    {values.budget.toLocaleString()}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                  <div className="flex items-center">
                    <FaRupeeSign className="mr-1" />
                    {values.spent.toLocaleString()}
                  </div>
                </td>
                <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${
                  remaining >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  <div className="flex items-center">
                    <FaRupeeSign className="mr-1" />
                    {Math.abs(remaining).toLocaleString()}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${
                          status === 'over' ? 'bg-red-600' :
                          status === 'warning' ? 'bg-yellow-500' : 'bg-green-600'
                        }`}
                        style={{ width: `${percentageSpent}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-xs font-medium text-gray-600 dark:text-gray-300">
                      {Math.round(percentageSpent)}%
                    </span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
)}
    </div>
  </div>
);
}
export default Report;