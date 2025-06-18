import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js';
import { useEffect, useState } from 'react';
import { FaFileDownload, FaRupeeSign } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import BarChart from '../components/charts/BarChart';

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
  const [reportType, setReportType] = useState('all');
  const [timeRange, setTimeRange] = useState('monthly');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch and process data
  useEffect(() => {
    const fetchData = () => {
      setLoading(true);
      
      // Get data from localStorage
      const userId = localStorage.getItem('userId') || 'guest';
      const transactions = JSON.parse(localStorage.getItem(`transactions_${userId}`)) || [];
      const budgets = JSON.parse(localStorage.getItem(`budgets_${userId}`)) || [];
      
      // Process data based on filters
      const processedData = processData(transactions, budgets, reportType, timeRange, startDate, endDate);
      
      setReportData(processedData);
      setLoading(false);
    };

    fetchData();
  }, [reportType, timeRange, startDate, endDate]);

  const processData = (transactions, budgets, type, range, start, end) => {
    // Filter transactions by date range
    let filteredTransactions = transactions;
    if (start && end) {
      filteredTransactions = transactions.filter(t => {
        const date = new Date(t.date);
        return date >= new Date(start) && date <= new Date(end);
      });
    }

    // Filter by report type
    if (type === 'income') {
      filteredTransactions = filteredTransactions.filter(t => t.type === 'income');
    } else if (type === 'expense') {
      filteredTransactions = filteredTransactions.filter(t => t.type === 'expense');
    }

    // Group data by time range
    let groupedData = {};
    const now = new Date();
    
    if (range === 'monthly') {
      // Group by month
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      filteredTransactions.forEach(t => {
        const date = new Date(t.date);
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        const key = `${month} ${year}`;
        
        if (!groupedData[key]) {
          groupedData[key] = { income: 0, expense: 0 };
        }
        
        if (t.type === 'income') {
          groupedData[key].income += t.amount;
        } else {
          groupedData[key].expense += Math.abs(t.amount); // Use absolute value for expenses
        }
      });
    } else if (range === 'weekly') {
      // Group by week
      filteredTransactions.forEach(t => {
        const date = new Date(t.date);
        const week = getWeekNumber(date);
        const key = `Week ${week}`;
        
        if (!groupedData[key]) {
          groupedData[key] = { income: 0, expense: 0 };
        }
        
        if (t.type === 'income') {
          groupedData[key].income += t.amount;
        } else {
          groupedData[key].expense += Math.abs(t.amount); // Use absolute value for expenses
        }
      });
    }

    // Process category data
    const categoryData = {};
    filteredTransactions.forEach(t => {
      if (!categoryData[t.category]) {
        categoryData[t.category] = { income: 0, expense: 0 };
      }
      
      if (t.type === 'income') {
        categoryData[t.category].income += t.amount;
      } else {
        categoryData[t.category].expense += Math.abs(t.amount); // Use absolute value for expenses
      }
    });

    // Process budget vs actual
    const budgetComparison = {};
    budgets.forEach(b => {
      const spent = filteredTransactions
        .filter(t => t.type === 'expense' && t.category === b.category)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0); // Use absolute value for expenses
      
      budgetComparison[b.category] = {
        budget: b.amount,
        spent: spent,
        remaining: b.amount - spent
      };
    });

    return {
      timeSeries: groupedData,
      categories: categoryData,
      budgetComparison,
      rawTransactions: filteredTransactions
    };
  };

  const getWeekNumber = (date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  const exportToExcel = () => {
    if (!reportData) return;

    const data = [];
    
    // Add time series data
    Object.entries(reportData.timeSeries).forEach(([period, values]) => {
      data.push({
        Period: period,
        Income: values.income,
        Expense: values.expense,
        Net: values.income - values.expense
      });
    });

    // Add category data
    data.push({}, { Category: 'Category Breakdown' });
    Object.entries(reportData.categories).forEach(([category, values]) => {
      data.push({
        Category: category,
        Income: values.income,
        Expense: values.expense
      });
    });

    // Add budget data
    data.push({}, { Category: 'Budget Comparison' });
    Object.entries(reportData.budgetComparison).forEach(([category, values]) => {
      data.push({
        Category: category,
        Budget: values.budget,
        Spent: values.spent,
        Remaining: values.remaining,
        Percentage: `${Math.round((values.spent / values.budget) * 100)}%`
      });
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Financial Report");
    XLSX.writeFile(wb, "financial_report.xlsx");
  };

  // Calculate totals
  const totalIncome = reportData ? Object.values(reportData.timeSeries).reduce((sum, d) => sum + d.income, 0) : 0;
  const totalExpense = reportData ? Object.values(reportData.timeSeries).reduce((sum, d) => sum + d.expense, 0) : 0;
  const netBalance = totalIncome - totalExpense;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Financial Reports</h1>
          <button 
            onClick={exportToExcel}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            <FaFileDownload /> Export to Excel
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Report Type</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white"
              >
                <option value="all">Income & Expense</option>
                <option value="income">Income Only</option>
                <option value="expense">Expense Only</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time Range</label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white"
              >
                <option value="monthly">Monthly</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white"
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Total Income</h3>
            <p className="text-2xl font-bold text-green-600">
              <FaRupeeSign className="inline mr-1" />
              {totalIncome.toLocaleString()}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Total Expense</h3>
            <p className="text-2xl font-bold text-red-600">
              <FaRupeeSign className="inline mr-1" />
              {totalExpense.toLocaleString()}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Net Balance</h3>
            <p className={`text-2xl font-bold ${netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              <FaRupeeSign className="inline mr-1" />
              {netBalance.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Income vs Expense Over Time</h3>
            <BarChart 
              data={{
                labels: reportData ? Object.keys(reportData.timeSeries) : [],
                datasets: [
                  {
                    label: 'Income',
                    data: reportData ? Object.values(reportData.timeSeries).map(d => d.income) : [],
                    backgroundColor: 'rgba(54, 162, 235, 0.7)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                  },
                  {
                    label: 'Expense',
                    data: reportData ? Object.values(reportData.timeSeries).map(d => d.expense) : [],
                    backgroundColor: 'rgba(255, 99, 132, 0.7)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                  }
                ]
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: 'Income vs Expense Over Time',
                  },
                },
              }}
            />
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Category Breakdown</h3>
            <BarChart 
              data={{
                labels: reportData ? Object.keys(reportData.categories) : [],
                datasets: [
                  {
                    label: 'Income',
                    data: reportData ? Object.values(reportData.categories).map(d => d.income) : [],
                    backgroundColor: 'rgba(75, 192, 192, 0.7)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                  },
                  {
                    label: 'Expense',
                    data: reportData ? Object.values(reportData.categories).map(d => d.expense) : [],
                    backgroundColor: 'rgba(153, 102, 255, 0.7)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1
                  }
                ]
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: 'Category Breakdown',
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Budget Comparison */}
        {reportType !== 'income' && (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Budget vs Actual Spending</h3>
            <BarChart 
              data={{
                labels: reportData ? Object.keys(reportData.budgetComparison) : [],
                datasets: [
                  {
                    label: 'Budget',
                    data: reportData ? Object.values(reportData.budgetComparison).map(d => d.budget) : [],
                    backgroundColor: 'rgba(54, 162, 235, 0.7)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                  },
                  {
                    label: 'Actual',
                    data: reportData ? Object.values(reportData.budgetComparison).map(d => d.spent) : [],
                    backgroundColor: 'rgba(255, 99, 132, 0.7)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                  }
                ]
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: 'Budget vs Actual Spending',
                  },
                },
              }}
            />
          </div>
        )}

        {/* Transaction Table */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md overflow-x-auto">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Transaction Details</h3>
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
              {reportData && reportData.rawTransactions.length > 0 ? (
                reportData.rawTransactions.map((transaction, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                      {transaction.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                      {transaction.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        transaction.type === 'income' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                      transaction.type === 'income' 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      <FaRupeeSign className="inline mr-1" />
                      {Math.abs(transaction.amount).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    No transactions found for the selected filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Report;