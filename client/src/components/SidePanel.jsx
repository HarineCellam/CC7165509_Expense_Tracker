// import { useEffect, useState } from "react";
// import { FaBars, FaChartPie, FaFileAlt, FaHome, FaMoneyBill, FaSignOutAlt, FaTimes, FaUser } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";

// const SidePanel = ({ user }) => {
//   const navigate = useNavigate();
//   const [isOpen, setIsOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);
  
//   const userInitial = user?.name?.charAt(0)?.toUpperCase() || "?";

//   useEffect(() => {
//     const checkIfMobile = () => {
//       setIsMobile(window.innerWidth < 768);
//       if (window.innerWidth >= 768) {
//         setIsOpen(true);
//       } else {
//         setIsOpen(false);
//       }
//     };
    
//     checkIfMobile();
//     window.addEventListener("resize", checkIfMobile);
    
//     return () => window.removeEventListener("resize", checkIfMobile);
//   }, []);

//   const togglePanel = () => {
//     setIsOpen(!isOpen);
//   };

//   const handleNavigation = (path) => {
//     navigate(path);
//     if (isMobile) setIsOpen(false);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/login");
//   };

//   const navItems = [
//     { label: "Dashboard", path: "/dashboard", icon: <FaHome /> },
//     { label: "Income", path: "/income", icon: <FaMoneyBill /> },
//     { label: "Expense", path: "/expense", icon: <FaMoneyBill /> },
//     { label: "Budget", path: "/budget", icon: <FaChartPie /> },
//     { label: "Report", path: "/report", icon: <FaFileAlt /> },
//     { label: "Profile", path: "/profile", icon: <FaUser /> },
//   ];

//   return (
//     <>
//       <button
//         onClick={togglePanel}
//         className={`fixed top-20 left-4 z-50 p-3 rounded-lg bg-blue-600 text-white shadow-lg transition-all duration-300 md:hidden ${
//           isOpen ? "hidden" : "block"
//         }`}
//         aria-label="Toggle menu"
//         style={{ top: '4.5rem' }}
//       >
//         <FaBars className="text-xl" />
//       </button>

//       {isMobile && isOpen && (
//         <div 
//           className="fixed inset-0 bg-black bg-opacity-50 z-40"
//           onClick={togglePanel}
//         />
//       )}

//       <div
//         className={`fixed md:relative w-64 h-[calc(100vh-4rem)] bg-white dark:bg-gray-900 p-4 shadow-xl flex flex-col justify-between z-50 transition-all duration-300 ease-in-out ${
//           isOpen ? "left-0" : "-left-64"
//         }`}
//         style={{ top: '4rem' }}
//       >
//         {isMobile && (
//           <button
//             onClick={togglePanel}
//             className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-red-500 hover:text-white transition-colors"
//             aria-label="Close menu"
//           >
//             <FaTimes />
//           </button>
//         )}

//         <div>
//           <div
//             onClick={() => handleNavigation("/profile")}
//             className="flex flex-col items-center mb-8 cursor-pointer transition transform hover:scale-105 duration-200 mt-4"
//           >
//             <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold shadow-md">
//               {userInitial}
//             </div>
//             <h2 className="text-lg font-semibold mt-3 text-blue-700 dark:text-blue-300">
//               {user?.name || "Your Profile"}
//             </h2>
//             <p className="text-sm text-gray-600 dark:text-gray-400">
//               {user?.email || ""}
//             </p>
//           </div>

//           <ul className="flex flex-col gap-2 text-gray-700 dark:text-gray-200 font-medium">
//             {navItems.map((item) => (
//               <li
//                 key={item.path}
//                 onClick={() => handleNavigation(item.path)}
//                 className="flex items-center px-4 py-3 rounded-lg cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-800 hover:text-blue-700 dark:hover:text-white transition-all duration-200"
//               >
//                 <span className="mr-3 text-lg">{item.icon}</span>
//                 {item.label}
//               </li>
//             ))}
//           </ul>
//         </div>
        
//         <div className="mt-4">
//           <button
//             onClick={handleLogout}
//             className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg transition duration-200"
//           >
//             <FaSignOutAlt />
//             Logout
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };

// export default SidePanel;

// import { useEffect, useState } from "react";
// import { FaBars, FaChartPie, FaFileAlt, FaHome, FaMoneyBill, FaSignOutAlt, FaTimes, FaUser } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";

// const SidePanel = ({ user }) => {
//   const navigate = useNavigate();
//   const [isOpen, setIsOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);

//   const userInitial = user?.name?.charAt(0)?.toUpperCase() || "?";

//   useEffect(() => {
//     const checkIfMobile = () => {
//       setIsMobile(window.innerWidth < 768);
//       if (window.innerWidth >= 768) {
//         setIsOpen(true);
//       } else {
//         setIsOpen(false);
//       }
//     };

//     checkIfMobile();
//     window.addEventListener("resize", checkIfMobile);

//     return () => window.removeEventListener("resize", checkIfMobile);
//   }, []);

//   const togglePanel = () => {
//     setIsOpen((prev) => !prev);
//   };

//   const handleNavigation = (path) => {
//     navigate(path);
//     if (isMobile) setIsOpen(false);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     navigate("/login");
//   };

//   const navItems = [
//     { label: "Dashboard", path: "/dashboard", icon: <FaHome /> },
//     { label: "Income", path: "/income", icon: <FaMoneyBill /> },
//     { label: "Expense", path: "/expense", icon: <FaMoneyBill /> },
//     { label: "Budget", path: "/budget", icon: <FaChartPie /> },
//     { label: "Report", path: "/report", icon: <FaFileAlt /> },
//     { label: "Profile", path: "/profile", icon: <FaUser /> },
//   ];

//   return (
//     <>
//       <button
//         onClick={togglePanel}
//         className={`fixed top-20 left-4 z-50 p-3 rounded-lg bg-blue-600 text-white shadow-lg transition-all duration-300 md:hidden ${
//           isOpen ? "hidden" : "block"
//         }`}
//         aria-label="Toggle menu"
//         style={{ top: '4.5rem' }}
//       >
//         <FaBars className="text-xl" />
//       </button>

//       {isMobile && isOpen && (
//         <div 
//           className="fixed inset-0 bg-black bg-opacity-50 z-40"
//           onClick={togglePanel}
//         />
//       )}

//       <div
//         className={`fixed md:relative w-64 h-[calc(100vh-4rem)] bg-white dark:bg-gray-900 p-4 shadow-xl flex flex-col justify-between z-50 transition-all duration-300 ease-in-out ${
//           isOpen ? "left-0" : "-left-64"
//         }`}
//         style={{ top: '4rem' }}
//       >
//         {isMobile && (
//           <button
//             onClick={togglePanel}
//             className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-red-500 hover:text-white transition-colors"
//             aria-label="Close menu"
//           >
//             <FaTimes />
//           </button>
//         )}

//         <div>
//           <div
//             onClick={() => handleNavigation("/profile")}
//             className="flex flex-col items-center mb-8 cursor-pointer transition transform hover:scale-105 duration-200 mt-4"
//           >
//             <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold shadow-md">
//               {userInitial}
//             </div>
//             <h2 className="text-lg font-semibold mt-3 text-blue-700 dark:text-blue-300">
//               {user?.name || "Your Profile"}
//             </h2>
//             <p className="text-sm text-gray-600 dark:text-gray-400">
//               {user?.email || ""}
//             </p>
//           </div>

//           <ul className="flex flex-col gap-2 text-gray-700 dark:text-gray-200 font-medium">
//             {navItems.map((item) => (
//               <li
//                 key={item.path}
//                 onClick={() => handleNavigation(item.path)}
//                 className="flex items-center px-4 py-3 rounded-lg cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-800 hover:text-blue-700 dark:hover:text-white transition-all duration-200"
//               >
//                 <span className="mr-3 text-lg">{item.icon}</span>
//                 {item.label}
//               </li>
//             ))}
//           </ul>
//         </div>
        
//         <div className="mt-4">
//           <button
//             onClick={handleLogout}
//             className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg transition duration-200"
//           >
//             <FaSignOutAlt />
//             Logout
//           </button>
//         </div>
//       </div>
//     </>
//   );
  
// };

// export default SidePanel;

import { useEffect, useState } from "react";
import { FaBars, FaChartPie, FaFileAlt, FaHome, FaMoneyBill, FaSignOutAlt, FaTimes, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SidePanel = ({ user }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Safely get user initial
  const userInitial = user?.name?.charAt(0)?.toUpperCase() || "?";

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      setIsOpen(window.innerWidth >= 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const togglePanel = () => setIsOpen(prev => !prev);

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) setIsOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: <FaHome /> },
    { label: "Income", path: "/income", icon: <FaMoneyBill /> },
    { label: "Expense", path: "/expense", icon: <FaMoneyBill /> },
    { label: "Budget", path: "/budget", icon: <FaChartPie /> },
    { label: "Report", path: "/report", icon: <FaFileAlt /> },
    { label: "Profile", path: "/profile", icon: <FaUser /> },
  ];

  return (
    <>
      <button
        onClick={togglePanel}
        className={`fixed top-4 left-4 z-50 p-3 rounded-lg bg-blue-600 text-white shadow-lg transition-all duration-300 md:hidden ${
          isOpen ? "hidden" : "block"
        }`}
        aria-label="Toggle menu"
      >
        <FaBars className="text-xl" />
      </button>

      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={togglePanel}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 p-4 shadow-xl flex flex-col z-50 transition-all duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:relative md:h-[100vh]`}
      >
        {isMobile && (
          <button
            onClick={togglePanel}
            className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-red-500 hover:text-white transition-colors"
            aria-label="Close menu"
          >
            <FaTimes />
          </button>
        )}

        <div className="flex-1 overflow-y-auto">
          <div
            onClick={() => handleNavigation("/profile")}
            className="flex flex-col items-center py-6 cursor-pointer group"
          >
            <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold shadow-md group-hover:bg-blue-700 transition-colors mb-2">
              {userInitial}
            </div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">YOUR PROFILE</p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {user?.email || "user@example.com"}
            </p>
          </div>

          <ul className="mt-4 flex flex-col gap-1 text-gray-700 dark:text-gray-200 font-medium">
            {navItems.map((item) => (
              <li
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className="flex items-center px-4 py-3 rounded-lg cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-800 hover:text-blue-700 dark:hover:text-white transition-all duration-200"
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.label}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="py-4 pb-16 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition duration-200"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default SidePanel;