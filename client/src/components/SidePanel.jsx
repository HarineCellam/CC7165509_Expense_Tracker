import { useNavigate } from "react-router-dom";

const SidePanel = () => {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("loggedInUser");
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find((u) => u.email === userEmail);
  const userInitial = user?.name?.charAt(0)?.toUpperCase() || "?";

  return (
  <div className="w-64 h-screen bg-white dark:bg-gray-900 p-4 shadow-xl flex flex-col justify-between">
    <div>
      <div
        onClick={() => navigate("/profile")}
        className="flex flex-col items-center mb-8 cursor-pointer transition transform hover:scale-105 duration-200"
      >
        <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold shadow-md">
          {userInitial}
        </div>
        <h2 className="text-lg font-semibold mt-3 text-blue-700 dark:text-blue-300">
          Your Profile
        </h2>
      </div>

      <ul className="flex flex-col gap-4 text-gray-700 dark:text-gray-200 font-medium">
        {[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Income", path: "/income" },
          { label: "Expense", path: "/expense" },
          { label: "Budget", path: "/budget" },
          { label: "Report", path: "/report" }
        ].map((item) => (
          <li
            key={item.path}
            onClick={() => navigate(item.path)}
            className="px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-800 hover:text-blue-700 dark:hover:text-white transition-all duration-200 transform hover:scale-[1.03]"
          >
            {item.label}
          </li>
        ))}
      </ul>
    </div>
    <div className="text-center mt-4">
      <button
        onClick={() => {
          localStorage.removeItem("loggedInUser");
          navigate("/login");
        }}
        className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition duration-200"
      >
        Logout
      </button>
    </div>
  </div>
);
};

export default SidePanel;