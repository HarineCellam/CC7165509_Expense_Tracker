import { useEffect, useState } from 'react';
import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import DashboardLayout from "./components/DashboardLayout";
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

  const [shadow, setShadow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShadow(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  return (
    <Router>
      <div className='min-h-screen flex flex-col bg-white dark:bg-gray-900'>
          <nav className={`w-full fixed top-0 left-0 z-50 bg-white dark:bg-gray-800 transition-shadow ${shadow ? 'shadow-md' : 'shadow-none'}`}>
          <div className='mx-auto flex justify-between items-center bg-white text-blue-800 dark:bg-gray-800 dark:text-white px-6 py-4'>
            <h1 className='text-2xl font-bold text-blue-800 dark:text-white'>
              Expenz
            </h1>
            <div className='space-x-6'>
              <Link to="/" className='text-blue-600 hover:text-blue-800 font-medium transition-colors'>Home</Link>
              <a href="#about" className='text-blue-600 hover:text-blue-800 font-medium transition-colors'>About</a>
              <a href="#services" className='text-blue-600 hover:text-blue-800 font-medium transition-colors'>Services</a>
              <a href="#contact" className='text-blue-600 hover:text-blue-800 font-medium transition-colors'>Contact</a>
              <Link to="/login" className='text-blue-600 hover:text-blue-800 font-medium transition-colors'>Log In</Link>
              <Link to="/signup" className='text-blue-600 hover:text-blue-800 font-medium transition-colors'>Sign Up</Link>
            </div>
          </div>
        </nav>
        <main className="flex-1 flex pt-[72px] justify-center items-start bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
          <div className="w-full rounded-lg shadow p-8 mt-8 bg-white dark:bg-gray-800">
            <Routes>
              <Route path='/' element={<Home/>} />
              <Route path="/login" element={<LogIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path='/forgotpassword' element={<ForgotPassword />} />
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
