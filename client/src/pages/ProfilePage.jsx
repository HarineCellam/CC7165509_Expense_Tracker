// import { useEffect, useState } from "react";

// const ProfilePage = () => {
//   const [userData, setUserData] = useState({});
//   const [isEditing, setIsEditing] = useState(false);

//   useEffect(() => {
//     const users = JSON.parse(localStorage.getItem("users")) || [];
//     const loggedInEmail = localStorage.getItem("loggedInUser");
//     const currentUser = users.find((user) => user.email === loggedInEmail);
//     if (currentUser) setUserData(currentUser);
//   }, []);

//   const handleChange = (e) => {
//     setUserData({ ...userData, [e.target.name]: e.target.value });
//   };

//   const handleSave = () => {
//     const users = JSON.parse(localStorage.getItem("users")) || [];
//     const updatedUsers = users.map((user) =>
//       user.email === userData.email ? userData : user
//     );
//     localStorage.setItem("users", JSON.stringify(updatedUsers));
//     setIsEditing(false);
//     alert("Profile updated successfully!");
//   };

//   if (!userData.email) return <p className="text-center mt-20 text-gray-500">No user logged in.</p>;

//   return (
//     <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg mt-12 transition-all">
//       <div className="flex items-center mb-6">
//         <div className="w-16 h-16 rounded-full bg-blue-600 text-white text-3xl font-bold flex items-center justify-center shadow-md">
//           {userData.name?.charAt(0)?.toUpperCase() || "?"}
//         </div>
//         <h2 className="ml-4 text-3xl font-semibold text-gray-800 dark:text-white">
//           {userData.name || "Your Profile"}
//         </h2>
//       </div>

//       <div className="space-y-6">
//         {["name", "dob", "email", "phone", "jobTitle"].map((field) => (
//           <div key={field}>
//             <label className="block mb-1 text-sm font-medium text-gray-600 dark:text-gray-300 capitalize">
//               {field}
//             </label>
//             {isEditing ? (
//               <input
//                 type={field === "dob" ? "date" : "text"}
//                 name={field}
//                 value={userData[field] || ""}
//                 onChange={handleChange}
//                 readOnly={field === "email"}
//                 className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white"
//               />
//             ) : (
//               <p className="p-3 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white">
//                 {userData[field] || "—"}
//               </p>
//             )}
//           </div>
//         ))}
//       </div>

//       <div className="text-center mt-8">
//         <button
//           onClick={isEditing ? handleSave : () => setIsEditing(true)}
//           className={`px-6 py-2 rounded-lg font-semibold transition-all ${
//             isEditing
//               ? "bg-green-600 hover:bg-green-700 text-white"
//               : "bg-blue-600 hover:bg-blue-700 text-white"
//           }`}
//         >
//           {isEditing ? "Save Changes" : "Edit Profile"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;

import { useEffect, useState } from "react";
import apiService from "../api";

const ProfilePage = () => {
  // Get the logged-in user from localStorage.
  const [userData, setUserData] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const email = storedUser?.email;

  if (!email) return;

  apiService.profile
    .get(email)
    .then((res) => {
      const user = res.data || res; // handle both with/without wrapper
      setUserData(user);
      localStorage.setItem("user", JSON.stringify(user));
    })
    .catch((err) => {
      console.error("Failed to load profile:", err);
    });
}, []);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // Here you can add an API call to update the profile on your server.
    // For now, we're updating the localStorage value.
    localStorage.setItem("user", JSON.stringify(userData));
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  if (!userData.email) {
    return (
      <p className="text-center mt-20 text-gray-500">
        No user logged in.
      </p>
    );
  }

  // Fields to display/update. Adjust or add fields as necessary.
  const fields = [
  { key: "name", label: "Name", type: "text" },
  { key: "dob", label: "Date of Birth", type: "date" },
  { key: "email", label: "Email", type: "email" },
  { key: "phone", label: "Phone", type: "text" },
  { key: "occupation", label: "Occupation", type: "text" },
  { key: "gender", label: "Gender", type: "text" },
  { key: "maritalStatus", label: "Marital Status", type: "text" },
  { key: "address", label: "Address", type: "text" },
  { key: "city", label: "City", type: "text" },
  { key: "state", label: "State", type: "text" },
  { key: "country", label: "Country", type: "text" },
  { key: "postalCode", label: "Postal Code", type: "text" },
];

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
        {fields.map((field) => (
          <div key={field.key}>
            <label className="block mb-1 text-sm font-medium text-gray-600 dark:text-gray-300">
              {field.label}
            </label>
            {isEditing ? (
              <input
                type={field.type}
                name={field.key}
                value={userData[field.key] || ""}
                onChange={handleChange}
                // email is read-only since it’s an identifier in our app
                readOnly={field.key === "email"}
                className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white"
              />
            ) : (
              <p className="p-3 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white">
                {userData[field.key] || "—"}
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