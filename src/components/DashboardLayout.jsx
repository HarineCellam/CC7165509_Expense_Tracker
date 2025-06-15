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