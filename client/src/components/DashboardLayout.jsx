import { Outlet, useNavigate } from "react-router-dom";
import SidePanel from "./SidePanel";

const DashboardLayout = () => {

  const userEmail = localStorage.getItem("loggedInUser");
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find((u) => u.email === userEmail);
  const userInitial = user?.name?.charAt(0)?.toUpperCase() || "?";
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    navigate('/login');
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Enhanced Navbar */}
      <header className="fixed w-full bg-gradient-to-r from-blue-600 to-purple-600 dark:from-gray-800 dark:to-gray-900 shadow-lg py-3 px-6 flex justify-between items-center top-0 left-0 z-50 h-16">
        <div className="flex items-center">
          <div className="text-xl font-bold text-white">
            <h1>Expenz</h1>
          </div>
        </div>
        
  
        <div className="flex items-center space-x-4">
  <div 
    onClick={() => handleNavigation("/profile")}
    className="hidden md:flex items-center cursor-pointer"
  >
    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-blue-600 font-bold">
      {user?.name?.charAt(0).toUpperCase() || 'U'}
    </div>
    <span className="ml-2 text-white text-sm">
      {user?.email || 'user@example.com'}
    </span>
  </div>
  <button 
    onClick={handleLogout}
    className="bg-white/20 hover:bg-white/30 text-white px-4 py-1 rounded-lg text-sm transition-colors flex items-center"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
    </svg>
    Logout
  </button>
</div>
      </header>
      
      <div className="flex flex-1 mt-16 h-[calc(100vh-4rem)]"> {/* Added height calculation */}
        {/* SidePanel with proper scrolling and gap */}
        <div className="relative z-10 h-full overflow-y-auto pr-2 pt-1"> {/* Added top padding */}
          <div className="mr-4 mt-1"> {/* Added top margin for gap */}
            <SidePanel />
          </div>
        </div>
        
        {/* Main content area with gap */}
        <main className="flex-1 bg-gray-100 dark:bg-gray-900 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;