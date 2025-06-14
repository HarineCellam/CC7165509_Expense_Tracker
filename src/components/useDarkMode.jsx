import { useEffect, useState } from 'react';

export default function useDarkMode() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return [theme, setTheme];
}

{/* <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`w-12 h-6 flex items-center bg-gray-300 dark:bg-gray-600 rounded-full p-1 transition duration-300 ease-in-out ${theme === 'dark' ? 'justify-end' : 'justify-start'}`}
              aria-label="Toggle Theme">
                <div className="w-4 h-4 bg-yellow-400 dark:bg-white rounded-full shadow-md transition duration-300" />
              </button> */}