import { useEffect, useState } from "react";

const ProfilePage = () => {
  const [userData, setUserData] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const loggedInEmail = localStorage.getItem("loggedInUser");
    const currentUser = users.find((user) => user.email === loggedInEmail);
    if (currentUser) setUserData(currentUser);
  }, []);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = users.map((user) =>
      user.email === userData.email ? userData : user
    );
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  if (!userData.email) return <p className="text-center mt-20 text-gray-500">No user logged in.</p>;

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg mt-12 transition-all">
      <div className="flex items-center mb-6">
        <div className="w-16 h-16 rounded-full bg-blue-600 text-white text-3xl font-bold flex items-center justify-center shadow-md">
          {userData.name?.charAt(0)?.toUpperCase() || "?"}
        </div>
        <h2 className="ml-4 text-3xl font-semibold text-gray-800 dark:text-white">
          {userData.name || "Your Profile"}
        </h2>
      </div>

      <div className="space-y-6">
        {["name", "dob", "email", "phone", "jobTitle"].map((field) => (
          <div key={field}>
            <label className="block mb-1 text-sm font-medium text-gray-600 dark:text-gray-300 capitalize">
              {field}
            </label>
            {isEditing ? (
              <input
                type={field === "dob" ? "date" : "text"}
                name={field}
                value={userData[field] || ""}
                onChange={handleChange}
                readOnly={field === "email"}
                className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white"
              />
            ) : (
              <p className="p-3 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white">
                {userData[field] || "—"}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <button
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          className={`px-6 py-2 rounded-lg font-semibold transition-all ${
            isEditing
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {isEditing ? "Save Changes" : "Edit Profile"}
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;