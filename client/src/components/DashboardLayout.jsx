// import { useEffect, useState } from "react";
// import { Outlet, useNavigate } from "react-router-dom";
// import apiService from "../api";
// import SidePanel from "./SidePanel";

// const DashboardLayout = () => {
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUser = async () => {
//   try {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       navigate('/login');
//       return;
//     }
    
//     const email = localStorage.getItem("userEmail"); 
//     if (!email) {
//       throw new Error("Email not found in localStorage");
//     }

//     const response = await apiService.profile.get(email);
//     setUser(response);
//   } catch (error) {
//     console.error("Failed to fetch user:", error);
//     localStorage.removeItem("token");
//     navigate('/login');
//   }
// };

//     fetchUser();
//   }, [navigate]);

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     navigate('/login');
//   };

//   if (!user) {
//     return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
//   }

//   return (
//     <div className="flex flex-col min-h-screen">
//       <header className="fixed w-full bg-gradient-to-r from-blue-600 to-purple-600 dark:from-gray-800 dark:to-gray-900 shadow-lg py-3 px-6 flex justify-between items-center top-0 left-0 z-50 h-16">
//         <div className="flex items-center">
//           <div className="text-xl font-bold text-white">
//             <h1>Expenz</h1>
//           </div>
//         </div>
        
//         <div className="flex items-center space-x-4">
//           <div 
//             onClick={() => navigate("/profile")}
//             className="hidden md:flex items-center cursor-pointer"
//           >
//             <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-blue-600 font-bold">
//               {user?.name?.charAt(0).toUpperCase() || 'U'}
//             </div>
//             <span className="ml-2 text-white text-sm">
//               {user?.email || 'user@example.com'}
//             </span>
//           </div>
//           <button 
//             onClick={handleLogout}
//             className="bg-white/20 hover:bg-white/30 text-white px-4 py-1 rounded-lg text-sm transition-colors flex items-center"
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
//               <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
//             </svg>
//             Logout
//           </button>
//         </div>
//       </header>
      
//       <div className="flex flex-1 mt-16 h-[calc(100vh-4rem)]">
//         <div className="relative z-10 h-full overflow-y-auto pr-2 pt-1">
//           <div className="mr-4 mt-1">
//             <SidePanel user={user} />
//           </div>
//         </div>
        
//         <main className="flex-1 bg-gray-100 dark:bg-gray-900 p-6 overflow-y-auto">
//           <Outlet context={{ user }} />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default DashboardLayout;

// import { useEffect, useState } from "react";
// import { Outlet, useNavigate } from "react-router-dom";
// import apiService from "../api";
// import SidePanel from "./SidePanel";

// const DashboardLayout = () => {
//   const [user, setUser] = useState(null);
//   const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const initializeUser = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           navigate("/login");
//           return;
//         }

//         const storedUser = localStorage.getItem("user");
//         if (storedUser) {
//           setUser(JSON.parse(storedUser));
//         }

//         if (storedUser) {
//           const parsedUser = JSON.parse(storedUser);
//           const response = await apiService.profile.get(parsedUser.email);
//           const updatedUser = response.data || response;
//           setUser(updatedUser);
//           localStorage.setItem("user", JSON.stringify(updatedUser));
//         }
//       } catch (error) {
//         console.error("Error initializing user:", error);
//         handleLogout();
//       }
//     };

//     initializeUser();
//   }, [navigate]);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     navigate("/login");
//   };

//   if (!user) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         Loading...
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col min-h-screen">
//       {/* Navigation Bar - Fixed at top */}
//       <header className="fixed w-full bg-gradient-to-r from-blue-600 to-purple-600 dark:from-gray-800 dark:to-gray-900 shadow-lg py-3 px-6 flex justify-between items-center top-0 left-0 z-50 h-16">
//         <div className="flex items-center">
//           <div className="text-xl font-bold text-white">
//             <h1>Expenz</h1>
//           </div>
//         </div>
//         <div className="flex items-center space-x-4">
//           <button
//     className="text-white md:hidden"
//     onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
//     aria-label="Toggle Menu"
//   >
//     ☰
//   </button>

//         </div>
//       </header>

//       {/* Main Content Area */}
//       <div className="flex flex-1 mt-0">
//         {/* Side Panel - Fixed below nav bar */}
//         {/* <div className="fixed top-16 left-0 h-[calc(100vh-4rem)] z-40">
//           <SidePanel user={user} />
//         </div> */}
//         <div
//   className={`fixed top-16 z-40 transition-transform duration-300 bg-white dark:bg-gray-800 md:translate-x-0 ${
//     isSidePanelOpen ? 'translate-x-0' : '-translate-x-full'
//   } md:static md:block h-[calc(100vh-4rem)] w-64 shadow-md`}
// >
//   <SidePanel user={user} />
// </div>
        
//         {/* Main Content - Spaced properly from side panel */}
//         <main 
//           className="flex-1 bg-gray-100 dark:bg-gray-900 p-6 ml-64 overflow-y-auto"
//           style={{ minHeight: 'calc(100vh - 4rem)' }}
//         >
//           <Outlet context={{ user, setUser }} />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default DashboardLayout;

import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import apiService from "../api";
import SidePanel from "./SidePanel";

const DashboardLayout = () => {
  const [user, setUser] = useState(null);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          const response = await apiService.profile.get(parsedUser.email);
          const updatedUser = response.data || response;
          setUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
      } catch (error) {
        console.error("Error initializing user:", error);
        handleLogout();
      }
    };

    initializeUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const toggleSidePanel = () => {
    setIsSidePanelOpen(!isSidePanelOpen);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Navigation Bar - Fixed at top */}
      <header className="fixed w-full bg-gradient-to-r from-blue-600 to-purple-600 dark:from-gray-800 dark:to-gray-900 shadow-lg py-3 px-6 flex justify-between items-center top-0 left-0 z-50 h-16">
        <div className="flex items-center">
          <div className="text-xl font-bold text-white">
            <h1>Expenz</h1>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {/* <button
            className="text-white md:hidden"
            onClick={toggleSidePanel}
            aria-label="Toggle Menu"
          >
            {isSidePanelOpen ? "✕" : "☰"}
          </button> */}
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 pt-16">
        {/* Side Panel - Mobile overlay */}
        <div
  className={`top-16 transition-transform duration-300 bg-white dark:bg-gray-800 shadow-md h-[calc(100vh-4rem)] md:translate-x-0 ${
    isSidePanelOpen ? 'translate-x-0' : '-translate-x-full'
  } md:static md:block`}
>
  <SidePanel user={user} />
</div>
        
        {/* Side Panel - Fixed on desktop, overlay on mobile
        <div
          className={`fixed top-16 left-0 bottom-0 z-50 w-64 transform transition-transform duration-300 ease-in-out bg-white dark:bg-gray-800 shadow-lg md:shadow-none md:translate-x-0 ${
            isSidePanelOpen ? 'translate-x-0' : '-translate-x-full'
          } md:relative md:top-0 md:z-auto`}
        >
          <SidePanel user={user} />
        </div> */}
        
        {/* Main Content */}
        <main
  className="flex-1 bg-gray-100 dark:bg-gray-900 p-6 transition-all duration-300 md:ml-[272px]" // 256px side + 16px gap
  style={{ minHeight: 'calc(100vh - 4rem)' }}
>
  <Outlet context={{ user, setUser }} />
</main>
      </div>
    </div>
  );
};

export default DashboardLayout;