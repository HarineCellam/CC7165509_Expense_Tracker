import { Outlet } from "react-router-dom";
import SidePanel from "./SidePanel";

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen">
      <SidePanel />
      <main className="flex-1 bg-gray-100 dark:bg-gray-900 p-6 ml-4 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;


// import { useState } from "react";
// import { Outlet } from "react-router-dom";
// import SidePanel from "./SidePanel";

// const DashboardLayout = () => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   return (
//     <div className="flex min-h-screen">
//       {/* Sidebar - Always visible on desktop, hidden by default on mobile */}
//       <aside
//         className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-200 dark:bg-gray-800 h-screen transition-transform duration-300 transform md:translate-x-0 ${
//           isSidebarOpen ? "translate-x-0" : "-translate-x-full"
//         } md:relative md:block`}
//       >
//         <SidePanel />
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 bg-gray-100 dark:bg-gray-900 p-6 overflow-y-auto">
//         {/* Mobile Toggle Button */}
//         <button
//           className="md:hidden fixed top-4 left-4 bg-blue-600 text-white p-2 rounded-md"
//           onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//         >
//           {isSidebarOpen ? "Close Menu" : "Open Menu"}
//         </button>

//         <Outlet />
//       </main>
//     </div>
//   );
// };

// export default DashboardLayout;