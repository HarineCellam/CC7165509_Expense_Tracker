// import { useEffect, useState } from 'react';
// import {
//   FaChartBar,
//   FaChartPie,
//   FaMoneyCheckAlt,
//   FaRupeeSign
// } from 'react-icons/fa';
// import apiService from '../api';
// import BarChart from '../components/charts/BarChart';
// import PieChart from '../components/charts/PieChart';

// const Dashboard = () => {
//   const [incomeTotal, setIncomeTotal] = useState(0);
//   const [expenseTotal, setExpenseTotal] = useState(0);
//   const [budgetTotal, setBudgetTotal] = useState(0);
//   const [transactions, setTransactions] = useState([]);
//   const [budgets, setBudgets] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [barChartData, setBarChartData] = useState(null);
//   const [pieChartData, setPieChartData] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const user = JSON.parse(localStorage.getItem('user'));
//         const userId = user?._id;

//         // Fetch transactions and budgets in parallel
//         const [transactionsRes, budgetsRes] = await Promise.all([
//           apiService.transactions.getAll(userId),
//           apiService.budgets.getAll(userId)
//         ]);

//         setTransactions(transactionsRes.data);
//         setBudgets(budgetsRes.data);

//         // Calculate totals
//         const income = transactionsRes.data
//           .filter(t => t.type === 'income')
//           .reduce((sum, t) => sum + Math.abs(t.amount), 0);
        
//         const expense = transactionsRes.data
//           .filter(t => t.type === 'expense')
//           .reduce((sum, t) => sum + Math.abs(t.amount), 0);
        
//         const budgetTotal = budgetsRes.data.reduce((sum, b) => sum + b.amount, 0);

//         setIncomeTotal(income);
//         setExpenseTotal(expense);
//         setBudgetTotal(budgetTotal);

//         // Prepare chart data
//         prepareChartData(transactionsRes.data);
//       } catch (error) {
//         console.error('Error fetching dashboard data:', error);
//         if (error.response?.status === 401) {
//           localStorage.removeItem('token');
//           localStorage.removeItem('user');
//           window.location.href = '/login';
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // Prepare data for charts
//   const prepareChartData = (transactions) => {
//     // Monthly data for bar chart
//     const monthlyData = {
//       income: Array(12).fill(0),
//       expense: Array(12).fill(0)
//     };
    
//     transactions.forEach(t => {
//       if (!t.date) return;
      
//       const month = new Date(t.date).getMonth();
//       if (t.type === 'income') {
//         monthlyData.income[month] += Math.abs(t.amount);
//       } else if (t.type === 'expense') {
//         monthlyData.expense[month] += Math.abs(t.amount);
//       }
//     });
    
//     // Bar chart config
//     const barChartConfig = {
//       data: {
//         labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
//         datasets: [
//           {
//             label: 'Income',
//             data: monthlyData.income,
//             backgroundColor: 'rgba(54, 162, 235, 0.6)',
//             borderColor: 'rgba(54, 162, 235, 1)',
//             borderWidth: 1,
//           },
//           {
//             label: 'Expense',
//             data: monthlyData.expense,
//             backgroundColor: 'rgba(255, 99, 132, 0.6)',
//             borderColor: 'rgba(255, 99, 132, 1)',
//             borderWidth: 1,
//           },
//         ],
//       },
//       options: {
//         responsive: true,
//         plugins: {
//           legend: {
//             position: 'top',
//           },
//           title: {
//             display: true,
//             text: 'Monthly Income vs Expense',
//           },
//         },
//       }
//     };
    
//     // Category data for pie chart
//     const categoryMap = {};
    
//     transactions
//       .filter(t => t.type === 'expense')
//       .forEach(t => {
//         if (!categoryMap[t.category]) {
//           categoryMap[t.category] = 0;
//         }
//         categoryMap[t.category] += Math.abs(t.amount);
//       });
    
//     // Pie chart config
//     const pieChartConfig = {
//       data: {
//         labels: Object.keys(categoryMap),
//         datasets: [
//           {
//             data: Object.values(categoryMap),
//             backgroundColor: [
//               '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
//               '#9966FF', '#FF9F40', '#8AC926', '#1982C4',
//               '#6A4C93', '#F15BB5'
//             ],
//             borderColor: [
//               '#FFFFFF'
//             ],
//             borderWidth: 2,
//           },
//         ],
//       },
//       options: {
//         responsive: true,
//         plugins: {
//           legend: {
//             position: 'bottom',
//           },
//           title: {
//             display: true,
//             text: 'Expense by Category',
//           },
//         },
//       }
//     };
    
//     setBarChartData(barChartConfig);
//     setPieChartData(pieChartConfig);
//   };
  
//   const getBudgetStatus = () => {
//     return budgets.map(budget => {
//       const spent = transactions
//         .filter(t => t.type === 'expense' && t.category === budget.category)
//         .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      
//       const progress = Math.min(100, (spent / budget.amount) * 100);
      
//       return {
//         ...budget,
//         spent,
//         progress,
//         status: progress > 90 ? 'over' : progress > 75 ? 'warning' : 'good'
//       };
//     });
//   };
  
//   // Format currency
//   const formatCurrency = (amount) => {
//     return `₹${amount.toLocaleString()}`;
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex items-center justify-between mb-8">
//           <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center">
//             <FaChartBar className="mr-3 text-blue-500" />
//             Financial Dashboard
//           </h1>
//           <div className="text-sm text-gray-500 dark:text-gray-400">
//             {new Date().toLocaleDateString('en-US', { 
//               weekday: 'long', 
//               year: 'numeric', 
//               month: 'long', 
//               day: 'numeric' 
//             })}
//           </div>
//         </div>
        
//         {/* Summary Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border-l-4 border-blue-500">
//             <div className="flex justify-between items-center">
//               <div>
//                 <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Income</h3>
//                 <p className="text-2xl font-bold mt-1 text-gray-800 dark:text-white">
//                   {formatCurrency(incomeTotal)}
//                 </p>
//               </div>
//               <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
//                 <FaMoneyCheckAlt className="text-blue-500 text-xl" />
//               </div>
//             </div>
//             <div className="mt-4 text-green-500 text-sm font-medium">
//               +0% from last month
//             </div>
//           </div>
          
//           <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border-l-4 border-red-500">
//             <div className="flex justify-between items-center">
//               <div>
//                 <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Expense</h3>
//                 <p className="text-2xl font-bold mt-1 text-gray-800 dark:text-white">
//                   {formatCurrency(expenseTotal)}
//                 </p>
//               </div>
//               <div className="bg-red-100 dark:bg-red-900 p-3 rounded-full">
//                 <FaMoneyCheckAlt className="text-red-500 text-xl" />
//               </div>
//             </div>
//             <div className="mt-4 text-red-500 text-sm font-medium">
//               -0% from last month
//             </div>
//           </div>
          
//           <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border-l-4 border-green-500">
//             <div className="flex justify-between items-center">
//               <div>
//                 <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Net Balance</h3>
//                 <p className={`text-2xl font-bold mt-1 ${
//                   incomeTotal - expenseTotal >= 0 
//                     ? 'text-green-600' 
//                     : 'text-red-600'
//                 }`}>
//                   {formatCurrency(incomeTotal - expenseTotal)}
//                 </p>
//               </div>
//               <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
//                 <FaChartPie className="text-green-500 text-xl" />
//               </div>
//             </div>
//             <div className="mt-4 text-sm font-medium">
//               {incomeTotal - expenseTotal >= 0 
//                 ? <span className="text-green-500">+₹{(incomeTotal - expenseTotal).toLocaleString()} surplus</span>
//                 : <span className="text-red-500">-₹{Math.abs(incomeTotal - expenseTotal).toLocaleString()} deficit</span>
//               }
//             </div>
//           </div>
          
//           <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border-l-4 border-purple-500">
//             <div className="flex justify-between items-center">
//               <div>
//                 <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Budget</h3>
//                 <p className="text-2xl font-bold mt-1 text-gray-800 dark:text-white">
//                   {formatCurrency(budgetTotal)}
//                 </p>
//               </div>
//               <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full">
//                 <FaChartBar className="text-purple-500 text-xl" />
//               </div>
//             </div>
//             <div className="mt-4 text-purple-500 text-sm font-medium">
//               {budgets.length} budget categories
//             </div>
//           </div>
//         </div>
        
//         {/* Charts Section */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//           <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
//             {barChartData && (
//               <BarChart data={barChartData.data} options={barChartData.options} />
//             )}
//           </div>
          
//           <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
//             {pieChartData && (
//               <PieChart data={pieChartData.data} options={pieChartData.options} />
//             )}
//           </div>
//         </div>
        
//         {/* Budget Progress Section */}
//         <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mb-8">
//           <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center">
//             <FaChartPie className="mr-2 text-blue-500" />
//             Budget Progress
//           </h2>
          
//           {budgets.length === 0 ? (
//             <div className="text-center py-8">
//               <div className="bg-gray-200 dark:bg-gray-700 border-2 border-dashed rounded-xl w-16 h-16 mx-auto flex items-center justify-center mb-4">
//                 <FaRupeeSign className="text-2xl text-gray-500 dark:text-gray-400" />
//               </div>
//               <p className="text-gray-600 dark:text-gray-400">
//                 No budgets created yet
//               </p>
//               <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
//                 Create budgets to track your spending goals
//               </p>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {getBudgetStatus().map((budget) => (
//                 <div key={budget.id} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
//                   <div className="flex justify-between items-center mb-2">
//                     <h3 className="font-medium text-gray-800 dark:text-white">
//                       {budget.category}
//                     </h3>
//                     <div className="text-sm">
//                       <span className="font-medium">Spent: </span>
//                       <span className={`${
//                         budget.status === 'over' ? 'text-red-500' : 
//                         budget.status === 'warning' ? 'text-yellow-500' : 'text-green-500'
//                       }`}>
//                         ₹{budget.spent.toLocaleString()}
//                       </span> 
//                       <span className="mx-1">/</span> 
//                       <span>₹{budget.amount.toLocaleString()}</span>
//                     </div>
//                   </div>
                  
//                   <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
//                     <div 
//                       className={`h-2.5 rounded-full ${
//                         budget.status === 'over' ? 'bg-red-500' : 
//                         budget.status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
//                       }`}
//                       style={{ width: `${budget.progress}%` }}
//                     ></div>
//                   </div>
                  
//                   <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
//                     <span>0%</span>
//                     <span>{Math.round(budget.progress)}%</span>
//                     <span>100%</span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
        
//         {/* Recent Transactions */}
//         <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
//           <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center">
//             <FaMoneyCheckAlt className="mr-2 text-blue-500" />
//             Recent Transactions
//           </h2>
          
//           {transactions.length === 0 ? (
//             <div className="text-center py-8">
//               <div className="bg-gray-200 dark:bg-gray-700 border-2 border-dashed rounded-xl w-16 h-16 mx-auto flex items-center justify-center mb-4">
//                 <FaRupeeSign className="text-2xl text-gray-500 dark:text-gray-400" />
//               </div>
//               <p className="text-gray-600 dark:text-gray-400">
//                 No transactions recorded
//               </p>
//               <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
//                 Add income or expense to see them here
//               </p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//                 <thead className="bg-gray-50 dark:bg-gray-700">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
//                   {transactions.slice(0, 5).map((transaction) => (
//                     <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
//                         {transaction.date ? new Date(transaction.date).toLocaleDateString() : 'N/A'}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
//                         {transaction.description || '—'}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
//                         {transaction.category}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                           transaction.type === 'income' 
//                             ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
//                             : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
//                         }`}>
//                           {transaction.type}
//                         </span>
//                       </td>
//                       <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
//                         transaction.type === 'income' 
//                           ? 'text-green-600 dark:text-green-400' 
//                           : 'text-red-600 dark:text-red-400'
//                       }`}>
//                         {transaction.type === 'income' ? '+' : '-'}₹{Math.abs(transaction.amount).toLocaleString()}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

// import { useEffect, useState } from 'react';
// import {
//   FaChartBar,
//   FaChartPie,
//   FaMoneyCheckAlt,
//   FaRupeeSign
// } from 'react-icons/fa';
// import apiService from '../api';
// import BarChart from '../components/charts/BarChart';
// import PieChart from '../components/charts/PieChart';

// const Dashboard = () => {
//   const [incomeTotal, setIncomeTotal] = useState(0);
//   const [expenseTotal, setExpenseTotal] = useState(0);
//   const [budgetTotal, setBudgetTotal] = useState(0);
//   const [transactions, setTransactions] = useState([]);
//   const [budgets, setBudgets] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [barChartData, setBarChartData] = useState(null);
//   const [pieChartData, setPieChartData] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const user = JSON.parse(localStorage.getItem("user"));
//         const userId = user?._id;

//         // Fetch transactions and budgets in parallel
//         const [transactionsRes, budgetsRes] = await Promise.all([
//           apiService.transactions.getAll(userId),
//           apiService.budgets.getAll(userId),
//         ]);

//         setTransactions(transactionsRes.data);
//         setBudgets(budgetsRes.data);

//         // Calculate totals
//         const income = transactionsRes.data
//           .filter((t) => t.type === "income")
//           .reduce((sum, t) => sum + Math.abs(t.amount), 0);
//         const expense = transactionsRes.data
//           .filter((t) => t.type === "expense")
//           .reduce((sum, t) => sum + Math.abs(t.amount), 0);
//         const overallBudget = budgetsRes.data.reduce(
//           (sum, b) => sum + b.amount,
//           0
//         );

//         setIncomeTotal(income);
//         setExpenseTotal(expense);
//         setBudgetTotal(overallBudget);

//         // Prepare chart data
//         prepareChartData(transactionsRes.data);
//       } catch (error) {
//         console.error("Error fetching dashboard data:", error);
//         if (error.response?.status === 401) {
//           localStorage.removeItem("token");
//           localStorage.removeItem("user");
//           window.location.href = "/login";
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // Prepare data for charts.
//   const prepareChartData = (transactions) => {
//     // Monthly data for bar chart
//     const monthlyData = {
//       income: Array(12).fill(0),
//       expense: Array(12).fill(0),
//     };

//     transactions.forEach((t) => {
//       if (!t.date) return;
//       const month = new Date(t.date).getMonth();
//       if (t.type === "income") {
//         monthlyData.income[month] += Math.abs(t.amount);
//       } else if (t.type === "expense") {
//         monthlyData.expense[month] += Math.abs(t.amount);
//       }
//     });

//     const barChartConfig = {
//       data: {
//         labels: [
//           "Jan",
//           "Feb",
//           "Mar",
//           "Apr",
//           "May",
//           "Jun",
//           "Jul",
//           "Aug",
//           "Sep",
//           "Oct",
//           "Nov",
//           "Dec",
//         ],
//         datasets: [
//           {
//             label: "Income",
//             data: monthlyData.income,
//             backgroundColor: "rgba(54, 162, 235, 0.6)",
//             borderColor: "rgba(54, 162, 235, 1)",
//             borderWidth: 1,
//           },
//           {
//             label: "Expense",
//             data: monthlyData.expense,
//             backgroundColor: "rgba(255, 99, 132, 0.6)",
//             borderColor: "rgba(255, 99, 132, 1)",
//             borderWidth: 1,
//           },
//         ],
//       },
//       options: {
//         responsive: true,
//         plugins: {
//           legend: {
//             position: "top",
//           },
//           title: {
//             display: true,
//             text: "Monthly Income vs Expense",
//           },
//         },
//       },
//     };

//     // Category data for pie chart (expenses only)
//     const categoryMap = {};
//     transactions
//       .filter((t) => t.type === "expense")
//       .forEach((t) => {
//         if (!categoryMap[t.category]) {
//           categoryMap[t.category] = 0;
//         }
//         categoryMap[t.category] += Math.abs(t.amount);
//       });

//     const pieChartConfig = {
//       data: {
//         labels: Object.keys(categoryMap),
//         datasets: [
//           {
//             data: Object.values(categoryMap),
//             backgroundColor: [
//               "#FF6384",
//               "#36A2EB",
//               "#FFCE56",
//               "#4BC0C0",
//               "#9966FF",
//               "#FF9F40",
//               "#8AC926",
//               "#1982C4",
//               "#6A4C93",
//               "#F15BB5",
//             ],
//             borderColor: ["#FFFFFF"],
//             borderWidth: 2,
//           },
//         ],
//       },
//       options: {
//         responsive: true,
//         plugins: {
//           legend: {
//             position: "bottom",
//           },
//           title: {
//             display: true,
//             text: "Expense by Category",
//           },
//         },
//       },
//     };

//     setBarChartData(barChartConfig);
//     setPieChartData(pieChartConfig);
//   };

//   const formatCurrency = (amount) => {
//     return `₹${amount.toLocaleString()}`;
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   // return (
//   //   <div className="p-4 md:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
//   //     <div className="max-w-6xl mx-auto">
//   //       <header className="mb-8">
//   //         <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
//   //           <FaChartBar className="text-blue-500" />
//   //           Dashboard
//   //         </h1>
//   //         <p className="text-gray-600 dark:text-gray-400 mt-2">
//   //           Overview of your Income, Expenses, and Budget.
//   //         </p>
//   //       </header>

//   //       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//   //         <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex flex-col items-center">
//   //           <span className="text-lg font-medium text-gray-600 dark:text-gray-300">
//   //             Income
//   //           </span>
//   //           <span className="text-3xl font-bold text-green-600">
//   //             {formatCurrency(incomeTotal)}
//   //           </span>
//   //           <FaRupeeSign size={32} className="mt-2 text-green-600" />
//   //         </div>
//   //         <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex flex-col items-center">
//   //           <span className="text-lg font-medium text-gray-600 dark:text-gray-300">
//   //             Expense
//   //           </span>
//   //           <span className="text-3xl font-bold text-red-600">
//   //             {formatCurrency(expenseTotal)}
//   //           </span>
//   //           <FaRupeeSign size={32} className="mt-2 text-red-600" />
//   //         </div>
//   //         <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex flex-col items-center">
//   //           <span className="text-lg font-medium text-gray-600 dark:text-gray-300">
//   //             Budget
//   //           </span>
//   //           <span className="text-3xl font-bold text-blue-600">
//   //             {formatCurrency(budgetTotal)}
//   //           </span>
//   //           <FaChartPie size={32} className="mt-2 text-blue-600" />
//   //         </div>
//   //       </div>

//   //       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//   //         {barChartData && <BarChart chartData={barChartData} />}
//   //         {pieChartData && <PieChart chartData={pieChartData} />}
//   //       </div>
//   //     </div>
//   //   </div>
//   // );
//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex items-center justify-between mb-8">
//           <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center">
//             <FaChartBar className="mr-3 text-blue-500" />
//             Financial Dashboard
//           </h1>
//           <div className="text-sm text-gray-500 dark:text-gray-400">
//             {new Date().toLocaleDateString('en-US', { 
//               weekday: 'long', 
//               year: 'numeric', 
//               month: 'long', 
//               day: 'numeric' 
//             })}
//           </div>
//         </div>
        
//         {/* Summary Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border-l-4 border-blue-500">
//             <div className="flex justify-between items-center">
//               <div>
//                 <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Income</h3>
//                 <p className="text-2xl font-bold mt-1 text-gray-800 dark:text-white">
//                   {formatCurrency(incomeTotal)}
//                 </p>
//               </div>
//               <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
//                 <FaMoneyCheckAlt className="text-blue-500 text-xl" />
//               </div>
//             </div>
//             <div className="mt-4 text-green-500 text-sm font-medium">
//               +0% from last month
//             </div>
//           </div>
          
//           <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border-l-4 border-red-500">
//             <div className="flex justify-between items-center">
//               <div>
//                 <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Expense</h3>
//                 <p className="text-2xl font-bold mt-1 text-gray-800 dark:text-white">
//                   {formatCurrency(expenseTotal)}
//                 </p>
//               </div>
//               <div className="bg-red-100 dark:bg-red-900 p-3 rounded-full">
//                 <FaMoneyCheckAlt className="text-red-500 text-xl" />
//               </div>
//             </div>
//             <div className="mt-4 text-red-500 text-sm font-medium">
//               -0% from last month
//             </div>
//           </div>
          
//           <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border-l-4 border-green-500">
//             <div className="flex justify-between items-center">
//               <div>
//                 <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Net Balance</h3>
//                 <p className={`text-2xl font-bold mt-1 ${
//                   incomeTotal - expenseTotal >= 0 
//                     ? 'text-green-600' 
//                     : 'text-red-600'
//                 }`}>
//                   {formatCurrency(incomeTotal - expenseTotal)}
//                 </p>
//               </div>
//               <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
//                 <FaChartPie className="text-green-500 text-xl" />
//               </div>
//             </div>
//             <div className="mt-4 text-sm font-medium">
//               {incomeTotal - expenseTotal >= 0 
//                 ? <span className="text-green-500">+₹{(incomeTotal - expenseTotal).toLocaleString()} surplus</span>
//                 : <span className="text-red-500">-₹{Math.abs(incomeTotal - expenseTotal).toLocaleString()} deficit</span>
//               }
//             </div>
//           </div>
          
//           <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border-l-4 border-purple-500">
//             <div className="flex justify-between items-center">
//               <div>
//                 <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Budget</h3>
//                 <p className="text-2xl font-bold mt-1 text-gray-800 dark:text-white">
//                   {formatCurrency(budgetTotal)}
//                 </p>
//               </div>
//               <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full">
//                 <FaChartBar className="text-purple-500 text-xl" />
//               </div>
//             </div>
//             <div className="mt-4 text-purple-500 text-sm font-medium">
//               {budgets.length} budget categories
//             </div>
//           </div>
//         </div>
        
//         {/* Charts Section */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//           <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
//             {barChartData && (
//               <BarChart data={barChartData.data} options={barChartData.options} />
//             )}
//           </div>
          
//           <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
//             {pieChartData && (
//               <PieChart data={pieChartData.data} options={pieChartData.options} />
//             )}
//           </div>
//         </div>
        
//         {/* Budget Progress Section */}
//         <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mb-8">
//           <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center">
//             <FaChartPie className="mr-2 text-blue-500" />
//             Budget Progress
//           </h2>
          
//           {budgets.length === 0 ? (
//             <div className="text-center py-8">
//               <div className="bg-gray-200 dark:bg-gray-700 border-2 border-dashed rounded-xl w-16 h-16 mx-auto flex items-center justify-center mb-4">
//                 <FaRupeeSign className="text-2xl text-gray-500 dark:text-gray-400" />
//               </div>
//               <p className="text-gray-600 dark:text-gray-400">
//                 No budgets created yet
//               </p>
//               <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
//                 Create budgets to track your spending goals
//               </p>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {getBudgetStatus().map((budget) => (
//                 <div key={budget.id} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
//                   <div className="flex justify-between items-center mb-2">
//                     <h3 className="font-medium text-gray-800 dark:text-white">
//                       {budget.category}
//                     </h3>
//                     <div className="text-sm">
//                       <span className="font-medium">Spent: </span>
//                       <span className={`${
//                         budget.status === 'over' ? 'text-red-500' : 
//                         budget.status === 'warning' ? 'text-yellow-500' : 'text-green-500'
//                       }`}>
//                         ₹{budget.spent.toLocaleString()}
//                       </span> 
//                       <span className="mx-1">/</span> 
//                       <span>₹{budget.amount.toLocaleString()}</span>
//                     </div>
//                   </div>
                  
//                   <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
//                     <div 
//                       className={`h-2.5 rounded-full ${
//                         budget.status === 'over' ? 'bg-red-500' : 
//                         budget.status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
//                       }`}
//                       style={{ width: `${budget.progress}%` }}
//                     ></div>
//                   </div>
                  
//                   <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
//                     <span>0%</span>
//                     <span>{Math.round(budget.progress)}%</span>
//                     <span>100%</span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
        
//         {/* Recent Transactions */}
//         <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
//           <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center">
//             <FaMoneyCheckAlt className="mr-2 text-blue-500" />
//             Recent Transactions
//           </h2>
          
//           {transactions.length === 0 ? (
//             <div className="text-center py-8">
//               <div className="bg-gray-200 dark:bg-gray-700 border-2 border-dashed rounded-xl w-16 h-16 mx-auto flex items-center justify-center mb-4">
//                 <FaRupeeSign className="text-2xl text-gray-500 dark:text-gray-400" />
//               </div>
//               <p className="text-gray-600 dark:text-gray-400">
//                 No transactions recorded
//               </p>
//               <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
//                 Add income or expense to see them here
//               </p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//                 <thead className="bg-gray-50 dark:bg-gray-700">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
//                   {transactions.slice(0, 5).map((transaction) => (
//                     <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
//                         {transaction.date ? new Date(transaction.date).toLocaleDateString() : 'N/A'}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
//                         {transaction.description || '—'}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
//                         {transaction.category}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                           transaction.type === 'income' 
//                             ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
//                             : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
//                         }`}>
//                           {transaction.type}
//                         </span>
//                       </td>
//                       <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
//                         transaction.type === 'income' 
//                           ? 'text-green-600 dark:text-green-400' 
//                           : 'text-red-600 dark:text-red-400'
//                       }`}>
//                         {transaction.type === 'income' ? '+' : '-'}₹{Math.abs(transaction.amount).toLocaleString()}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

// ... (keep all the imports and state declarations the same)

import { useEffect, useState } from 'react';
import {
  FaChartBar,
  FaChartPie,
  FaMoneyCheckAlt,
  FaRupeeSign
} from 'react-icons/fa';
import apiService from '../api';
import BarChart from '../components/charts/BarChart';
import PieChart from '../components/charts/PieChart';

const Dashboard = () => {
  const [incomeTotal, setIncomeTotal] = useState(0);
  const [expenseTotal, setExpenseTotal] = useState(0);
  const [budgetTotal, setBudgetTotal] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [barChartData, setBarChartData] = useState(null);
  const [pieChartData, setPieChartData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user?._id) {
          throw new Error("User not authenticated");
        }

        // Initialize with empty arrays in case API fails
        let transactionsData = [];
        let budgetsData = [];

        try {
          const [transactionsRes, budgetsRes] = await Promise.all([
            apiService.transactions.getAll(user._id),
            apiService.budgets.getAll(user._id),
          ]);
          
          transactionsData = transactionsRes?.data || [];
          budgetsData = budgetsRes?.data || [];
        } catch (apiError) {
          console.error("API Error:", apiError);
          // Continue with empty arrays
        }

        setTransactions(transactionsData);
        setBudgets(budgetsData);

        // Calculate totals safely
        const income = transactionsData
          .filter(t => t?.type === "income")
          .reduce((sum, t) => sum + Math.abs(t?.amount || 0), 0);
          
        const expense = transactionsData
          .filter(t => t?.type === "expense")
          .reduce((sum, t) => sum + Math.abs(t?.amount || 0), 0);
          
        const overallBudget = budgetsData.reduce(
          (sum, b) => sum + (b?.amount || 0), 0
        );

        setIncomeTotal(income);
        setExpenseTotal(expense);
        setBudgetTotal(overallBudget);

        // Prepare chart data only if we have transactions
        if (transactionsData.length > 0) {
          prepareChartData(transactionsData);
        }
      } catch (error) {
        console.error("Dashboard error:", error);
        setError(error.message);
        
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const prepareChartData = (transactions) => {
    // Safe data preparation with null checks
    const monthlyData = {
      income: Array(12).fill(0),
      expense: Array(12).fill(0),
    };

    transactions.forEach((t) => {
      if (!t?.date) return;
      try {
        const month = new Date(t.date).getMonth();
        if (t.type === "income") {
          monthlyData.income[month] += Math.abs(t.amount || 0);
        } else if (t.type === "expense") {
          monthlyData.expense[month] += Math.abs(t.amount || 0);
        }
      } catch (e) {
        console.warn("Invalid transaction date", t.date);
      }
    });

    // Bar chart config with safe data
    setBarChartData({
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [
          {
            label: "Income",
            data: monthlyData.income,
            backgroundColor: "rgba(54, 162, 235, 0.6)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
          {
            label: "Expense",
            data: monthlyData.expense,
            backgroundColor: "rgba(255, 99, 132, 0.6)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "top" },
          title: { display: true, text: "Monthly Income vs Expense" },
        },
      },
    });

    // Pie chart with safe data
    const categoryMap = {};
    transactions
      .filter(t => t?.type === "expense")
      .forEach(t => {
        const category = t?.category || 'Uncategorized';
        categoryMap[category] = (categoryMap[category] || 0) + Math.abs(t?.amount || 0);
      });

    setPieChartData({
      data: {
        labels: Object.keys(categoryMap),
        datasets: [
          {
            data: Object.values(categoryMap),
            backgroundColor: [
              "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF",
              "#FF9F40", "#8AC926", "#1982C4", "#6A4C93", "#F15BB5"
            ],
            borderColor: ["#FFFFFF"],
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "bottom" },
          title: { display: true, text: "Expense by Category" },
        },
      },
    });
  };

  const formatCurrency = (amount) => {
    return `₹${Math.abs(amount).toLocaleString()}`;
  };

  const getBudgetStatus = () => {
    if (!budgets?.length) return [];
    
    return budgets.map(budget => {
      const spent = transactions
        .filter(t => t?.category === budget?.category && t?.type === "expense")
        .reduce((sum, t) => sum + Math.abs(t?.amount || 0), 0);
      
      const progress = Math.min((spent / (budget?.amount || 1)) * 100, 100);
      
      return {
        id: budget._id || Math.random(),
        category: budget.category || 'Uncategorized',
        amount: budget.amount || 0,
        spent,
        progress,
        status: progress > 100 ? 'over' : progress > 80 ? 'warning' : 'good'
      };
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error loading dashboard:</strong> {error}
        </div>
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center">
            <FaChartBar className="mr-3 text-blue-500" />
            Financial Dashboard
          </h1>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border-l-4 border-blue-500">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Income</h3>
                <p className="text-2xl font-bold mt-1 text-gray-800 dark:text-white">
                  {formatCurrency(incomeTotal)}
                </p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                <FaMoneyCheckAlt className="text-blue-500 text-xl" />
              </div>
            </div>
            <div className="mt-4 text-green-500 text-sm font-medium">
              +0% from last month
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border-l-4 border-red-500">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Expense</h3>
                <p className="text-2xl font-bold mt-1 text-gray-800 dark:text-white">
                  {formatCurrency(expenseTotal)}
                </p>
              </div>
              <div className="bg-red-100 dark:bg-red-900 p-3 rounded-full">
                <FaMoneyCheckAlt className="text-red-500 text-xl" />
              </div>
            </div>
            <div className="mt-4 text-red-500 text-sm font-medium">
              -0% from last month
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border-l-4 border-green-500">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Net Balance</h3>
                <p className={`text-2xl font-bold mt-1 ${
                  incomeTotal - expenseTotal >= 0 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {formatCurrency(incomeTotal - expenseTotal)}
                </p>
              </div>
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                <FaChartPie className="text-green-500 text-xl" />
              </div>
            </div>
            <div className="mt-4 text-sm font-medium">
              {incomeTotal - expenseTotal >= 0 
                ? <span className="text-green-500">+₹{(incomeTotal - expenseTotal).toLocaleString()} surplus</span>
                : <span className="text-red-500">-₹{Math.abs(incomeTotal - expenseTotal).toLocaleString()} deficit</span>
              }
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border-l-4 border-purple-500">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Budget</h3>
                <p className="text-2xl font-bold mt-1 text-gray-800 dark:text-white">
                  {formatCurrency(budgetTotal)}
                </p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full">
                <FaChartBar className="text-purple-500 text-xl" />
              </div>
            </div>
            <div className="mt-4 text-purple-500 text-sm font-medium">
              {budgets.length} budget categories
            </div>
          </div>
        </div>
        
        {/* Charts Section */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
  {/* Bar Chart */}
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md h-[400px]">
    <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
      Monthly Income vs Expense
    </h3>
    <div className="h-[300px] w-full">
      {barChartData ? (
        <BarChart 
          data={barChartData.data} 
          options={barChartData.options} 
        />
      ) : (
        <div className="h-full flex flex-col items-center justify-center text-gray-400">
          <FaChartBar className="text-4xl mb-3" />
          <p>No transaction data available</p>
        </div>
      )}
    </div>
  </div>

  {/* Pie Chart */}
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md h-[400px]">
    <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
      Expense by Category
    </h3>
    <div className="h-[300px] w-full">
      {pieChartData && pieChartData.data.labels.length > 0 ? (
        <PieChart 
          data={pieChartData.data} 
          options={pieChartData.options} 
        />
      ) : (
        <div className="h-full flex flex-col items-center justify-center text-gray-400">
          <FaChartPie className="text-4xl mb-3" />
          <p>No expense data available</p>
        </div>
      )}
    </div>
  </div>
</div>
        
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center">
          <FaChartPie className="mr-2 text-blue-500" />
          Budget Progress
        </h2>
        
        {budgets && budgets.length > 0 ? (
          <div className="space-y-4">
            {getBudgetStatus().map((budget) => (
              <div key={budget.id} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-gray-800 dark:text-white">
                    {budget.category}
                  </h3>
                  <div className="text-sm">
                    <span className="font-medium">Spent: </span>
                    <span className={`${
                      budget.status === 'over' ? 'text-red-500' : 
                      budget.status === 'warning' ? 'text-yellow-500' : 'text-green-500'
                    }`}>
                      ₹{budget.spent.toLocaleString()}
                    </span> 
                    <span className="mx-1">/</span> 
                    <span>₹{budget.amount.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${
                      budget.status === 'over' ? 'bg-red-500' : 
                      budget.status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${budget.progress}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>0%</span>
                  <span>{Math.round(budget.progress)}%</span>
                  <span>100%</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="bg-gray-200 dark:bg-gray-700 border-2 border-dashed rounded-xl w-16 h-16 mx-auto flex items-center justify-center mb-4">
              <FaRupeeSign className="text-2xl text-gray-500 dark:text-gray-400" />
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              No budgets created yet
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
              Create budgets to track your spending goals
            </p>
          </div>
        )}
      </div>
      
      {/* Recent Transactions */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center">
          <FaMoneyCheckAlt className="mr-2 text-blue-500" />
          Recent Transactions
        </h2>
        
        {transactions && transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {transactions.slice(0, 5).map((transaction) => (
                  <tr key={transaction._id || transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                      {transaction.date ? new Date(transaction.date).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                      {transaction.description || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                      {transaction.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        transaction.type === 'income' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                      }`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                      transaction.type === 'income' 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}₹{Math.abs(transaction.amount).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="bg-gray-200 dark:bg-gray-700 border-2 border-dashed rounded-xl w-16 h-16 mx-auto flex items-center justify-center mb-4">
              <FaRupeeSign className="text-2xl text-gray-500 dark:text-gray-400" />
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              No transactions recorded
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
              Add income or expense to see them here
            </p>
          </div>
        )}
      </div>
    </div>
  </div>
);
};

export default Dashboard;
