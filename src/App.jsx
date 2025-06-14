import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';

function App() {

  return (
    <Router>
      <div className='min-h-screen flex flex-col bg-white dark:bg-gray-900'>
        <nav className='w-full shadow-md'>
          <div className='mx-auto flex justify-between items-center bg-white text-blue-800 dark:bg-gray-800 dark:text-white px-6 py-4'>
            <h1 className='text-2xl font-bold text-blue-800 dark:text-white'>
              Expenz
            </h1>
            <div className='space-x-6'>
              <Link to="/" className='text-blue-600 hover:text-blue-800 font-medium transition-colors'>Home</Link>
            </div>
          </div>
        </nav>
        <main className="flex-1 flex justify-center items-start bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
          <div className="w-full rounded-lg shadow p-8 mt-8 bg-white dark:bg-gray-800">
            <Routes>
              <Route path='/' element={<Home/>} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App
