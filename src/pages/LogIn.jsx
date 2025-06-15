import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMessage("");

        let users = JSON.parse(localStorage.getItem("users")) || [];

        const user = users.find(user => user.email === formData.email);

        if (!user) {
            setErrorMessage("User not found. Please check your email or create an account.");
            return;
        }

        if (user.password !== formData.password) {
            setErrorMessage("Incorrect password. Please try again.");
            return;
        }

        localStorage.setItem("loggedInUser", formData.email);
        navigate("/dashboard");
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold text-center mb-6">Welcome Back</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="w-full p-3 rounded-md border" />

                    <div className="relative">
                        <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" onChange={handleChange} required className="w-full p-3 rounded-md border pr-10" />
                        <button type="button" onClick={togglePasswordVisibility} className="absolute right-3 top-3 text-gray-600 dark:text-gray-300">
                            {showPassword ? <EyeSlashIcon className="w-6 h-6" /> : <EyeIcon className="w-6 h-6" />}
                        </button>
                    </div>

                    {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}

                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg text-lg w-full">
                        Login
                    </button>
                </form>
                <p className="text-center mt-4">
                    <button onClick={() => navigate("/forgotpassword")} className="text-blue-600 hover:underline">
                        Forgot Password?
                    </button>
                </p>
                <p className="text-center mt-4">
                    New to Expenz?{" "}
                    <button onClick={() => navigate("/signup")} className="text-blue-600 hover:underline">
                        Create your account
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Login;