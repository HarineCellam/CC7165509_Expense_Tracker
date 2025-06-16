import { useEffect, useState } from 'react';
import { FaCalendarAlt, FaChartPie, FaRupeeSign, FaTrashAlt } from 'react-icons/fa';

const Budget = () => {
  const [budgets, setBudgets] = useState([]);
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    period: 'monthly'
  });
  const [activeTab, setActiveTab] = useState('weekly');
  const [editingId, setEditingId] = useState(null);
  
  // Default categories (only expenses)
  const expenseCategories = [
    "Food", "Rent", "Transport", "Entertainment", 
    "Utilities", "Shopping", "Health", "Education", "Other"
  ];
  
  const periods = ['daily', 'weekly', 'monthly', 'yearly'];

  // Load budgets from localStorage on mount
  useEffect(() => {
    const userId = localStorage.getItem('userId') || 'guest';
    const savedBudgets = JSON.parse(localStorage.getItem(`budgets_${userId}`)) || [];
    setBudgets(savedBudgets);
  }, []);

  // Save budgets to localStorage whenever they change
  useEffect(() => {
    const userId = localStorage.getItem('userId') || 'guest';
    localStorage.setItem(`budgets_${userId}`, JSON.stringify(budgets));
  }, [budgets]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.category || !formData.amount) return;
    
    const newBudget = {
      id: editingId || Date.now(),
      ...formData,
      amount: Number(formData.amount)
    };
    
    if (editingId) {
      setBudgets(budgets.map(budget => 
        budget.id === editingId ? newBudget : budget
      ));
      setEditingId(null);
    } else {
      setBudgets([...budgets, newBudget]);
    }
    
    setFormData({
      category: '',
      amount: '',
      period: 'monthly'
    });
  };

  const handleEdit = (budget) => {
    setFormData({
      category: budget.category,
      amount: budget.amount,
      period: budget.period
    });
    setEditingId(budget.id);
  };

  const handleDelete = (id) => {
    setBudgets(budgets.filter(budget => budget.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setFormData({
        category: '',
        amount: '',
        period: 'monthly'
      });
    }
  };

  // Filter budgets by period
  const filteredBudgets = budgets.filter(budget => budget.period === activeTab);
  
  // Calculate total budget for active period
  const totalBudget = filteredBudgets.reduce((sum, budget) => sum + budget.amount, 0);
  
  // Calculate total budget across all periods
  const totalAllBudgets = budgets.reduce((sum, budget) => sum + budget.amount, 0);
  
  // Calculate progress for each budget
  const calculateProgress = (budget) => {
    // In a real app, this would compare with actual expenses
    const randomProgress = Math.floor(Math.random() * 100);
    return {
      value: randomProgress,
      status: randomProgress > 90 ? 'over' : randomProgress > 75 ? 'warning' : 'good'
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
            <FaChartPie className="text-blue-500" />
            Budget Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Set and track your budgets for different time periods and categories
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Budget Form */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FaCalendarAlt className="text-blue-500" />
              {editingId ? "Edit Budget" : "Create New Budget"}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                >
                  <option value="">Select a category</option>
                  {expenseCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Amount</label>
                <div className="flex items-center">
                  <span className="bg-gray-100 dark:bg-gray-700 p-3 rounded-l-lg border border-r-0 border-gray-300 dark:border-gray-600">
                    <FaRupeeSign />
                  </span>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="Enter amount"
                    min="1"
                    className="flex-1 p-3 bg-white dark:bg-gray-800 rounded-r-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Period</label>
                <div className="grid grid-cols-2 gap-2">
                  {periods.map(period => (
                    <label 
                      key={period}
                      className={`flex items-center justify-center p-3 rounded-lg border cursor-pointer ${
                        formData.period === period 
                          ? 'bg-blue-100 dark:bg-blue-900 border-blue-500 text-blue-700 dark:text-blue-300' 
                          : 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name="period"
                        value={period}
                        checked={formData.period === period}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      {period.charAt(0).toUpperCase() + period.slice(1)}
                    </label>
                  ))}
                </div>
              </div>
              
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-300"
              >
                {editingId ? "Update Budget" : "Create Budget"}
              </button>
              
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({
                      category: '',
                      amount: '',
                      period: 'monthly'
                    });
                  }}
                  className="w-full py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition duration-300"
                >
                  Cancel Edit
                </button>
              )}
            </form>
          </div>
          
          {/* Budget List */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            {/* Period Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <div className="flex">
                {periods.map(period => (
                  <button
                    key={period}
                    className={`flex-1 py-3 px-4 text-center font-medium ${
                      activeTab === period
                        ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-500'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                    }`}
                    onClick={() => setActiveTab(period)}
                  >
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Budget Summary */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/30 border-b border-blue-100 dark:border-blue-800">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Total {activeTab} budget:</h3>
                <div className="text-xl font-bold flex items-center">
                  <FaRupeeSign className="mr-1" />
                  {totalBudget.toLocaleString()}
                </div>
              </div>
            </div>
            
            {/* Budget List */}
            <div className="p-4 max-h-[500px] overflow-y-auto">
              {filteredBudgets.length === 0 ? (
                <div className="text-center py-10">
                  <div className="bg-gray-200 dark:bg-gray-700 border-2 border-dashed rounded-xl w-16 h-16 mx-auto flex items-center justify-center mb-4">
                    <FaRupeeSign className="text-2xl text-gray-500 dark:text-gray-400" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    No {activeTab} budgets created yet
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                    Create your first budget using the form
                  </p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {filteredBudgets.map(budget => {
                    const progress = calculateProgress(budget);
                    return (
                      <li 
                        key={budget.id}
                        className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium">{budget.category}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                              {budget.period}
                            </p>
                          </div>
                          <div className="text-lg font-bold flex items-center">
                            <FaRupeeSign className="mr-1" />
                            {budget.amount.toLocaleString()}
                          </div>
                        </div>
                        
                        <div className="mt-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span className={`font-medium ${
                              progress.status === 'over' ? 'text-red-500' : 
                              progress.status === 'warning' ? 'text-yellow-500' : 'text-green-500'
                            }`}>
                              {progress.value}%
                            </span>
                          </div>
                          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${
                                progress.status === 'over' ? 'bg-red-500' : 
                                progress.status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${progress.value}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="flex justify-end gap-2 mt-3">
                          <button
                            onClick={() => handleEdit(budget)}
                            className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(budget.id)}
                            className="px-3 py-1 text-sm bg-red-100 dark:bg-red-900/50 hover:bg-red-200 dark:hover:bg-red-800 text-red-600 dark:text-red-400 rounded-lg flex items-center"
                          >
                            <FaTrashAlt className="mr-1" /> Delete
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
        
        {/* Budget Insights */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FaChartPie className="text-blue-500" />
            Budget Insights
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
              <div className="text-sm text-blue-600 dark:text-blue-400">Total Budgets</div>
              <div className="text-2xl font-bold mt-1">{budgets.length}</div>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
              <div className="text-sm text-green-600 dark:text-green-400">Most Common Period</div>
              <div className="text-2xl font-bold mt-1 capitalize">
                {budgets.length > 0 
                  ? [...budgets].sort((a, b) => 
                      budgets.filter(budget => budget.period === b.period).length -
                      budgets.filter(budget => budget.period === a.period).length
                    )[0].period
                  : 'N/A'}
              </div>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-100 dark:border-purple-800">
              <div className="text-sm text-purple-600 dark:text-purple-400">Top Category</div>
              <div className="text-2xl font-bold mt-1">
                {budgets.length > 0 
                  ? [...budgets].sort((a, b) => 
                      budgets.filter(budget => budget.category === b.category).length -
                      budgets.filter(budget => budget.category === a.category).length
                    )[0].category
                  : 'N/A'}
              </div>
            </div>
            
            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-100 dark:border-orange-800">
              <div className="text-sm text-orange-600 dark:text-orange-400">Total Budget Amount</div>
              <div className="text-2xl font-bold mt-1 flex items-center">
                <FaRupeeSign className="mr-1" />
                {totalAllBudgets.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Budget;