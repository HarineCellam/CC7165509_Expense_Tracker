import { useEffect, useState } from "react";

const ProfilePage = () => {
    const [userData, setUserData] = useState({});
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const loggedInEmail = localStorage.getItem("loggedInUser"); 
        const currentUser = users.find(user => user.email === loggedInEmail);
        if (currentUser) setUserData(currentUser);
    }, []);

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const updatedUsers = users.map(user =>
            user.email === userData.email ? userData : user
        );
        localStorage.setItem("users", JSON.stringify(updatedUsers));
        setIsEditing(false);
        alert("Profile updated successfully!");
    };

    if (!userData.email) return <p className="text-center">No user logged in.</p>;
    return (
        <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-600 text-white text-2xl font-bold">{userData.name.charAt(0).toUpperCase()} </div>
            <h2 className="text-2xl font-bold text-center mb-4">Your Profile</h2>
            <div className="space-y-4">
                {["name", "dob", "email", "phone", "jobTitle"].map((field) => (
                    <div key={field}>
                        <label className="block font-semibold capitalize">{field}</label>
                        {isEditing ? (
                            <input 
                            type={field === "dob" ? "date" : "text"}
                            name={field}
                            value={userData[field] || ""}
                            onChange={handleChange}
                            readOnly={field === "email"}
                            className="w-full p-2 rounded-md border"/>
                        ) : (
                            <p className="bg-gray-100 dark:bg-gray-700 p-2 rounded">{userData[field]}</p>
                        )}
                    </div>
                ))}
                <div className="text-center mt-4">
                    {isEditing ? (
                        <button
                            onClick={handleSave}
                            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
                        >
                            Save
                        </button>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                        >
                            Edit
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;