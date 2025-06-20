import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import DashboardLayout from './components/DashboardLayout';
import Budget from './pages/Budget';
import Dashboard from './pages/Dashboard';
import Expense from './pages/Expense';
import ForgotPassword from './pages/ForgotPassword';
import Home from './pages/Home';
import Income from './pages/Income';
import LogIn from './pages/LogIn';
import ProfilePage from './pages/ProfilePage';
import Report from './pages/Report';
import SignUp from './pages/SignUp';

function App() {

  return (
    <Router basename='/'>
      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
        <main className="flex-1 flex justify-center items-start bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
          <div className="w-full rounded-lg p-4 md:p-8 mt-0 md:mt-8 bg-white dark:bg-gray-800">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LogIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgotpassword" element={<ForgotPassword />} />
              <Route element={<DashboardLayout />}>
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/income" element={<Income />} />
                <Route path="/expense" element={<Expense />} />
                <Route path="/budget" element={<Budget />} />
                <Route path="/report" element={<Report />} />
              </Route>
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;