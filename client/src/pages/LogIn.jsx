import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setIsLoading(true);

        try {
            const response = await api.post('/api/login', formData);
            
            // Store the token in localStorage
            localStorage.setItem('token', response.data.token);
            
            // Redirect to dashboard
            navigate("/dashboard");
        } catch (error) {
            setErrorMessage(error.response?.data?.error || 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold text-center mb-6">Welcome Back</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input 
                        type="email" 
                        name="email" 
                        placeholder="Email" 
                        onChange={handleChange} 
                        required 
                        className="w-full p-3 rounded-md border" 
                    />

                    <div className="relative">
                        <input 
                            type={showPassword ? "text" : "password"} 
                            name="password" 
                            placeholder="Password" 
                            onChange={handleChange} 
                            required 
                            className="w-full p-3 rounded-md border pr-10" 
                        />
                        <button 
                            type="button" 
                            onClick={togglePasswordVisibility} 
                            className="absolute right-3 top-3 text-gray-600 dark:text-gray-300"
                        >
                            {showPassword ? <EyeSlashIcon className="w-6 h-6" /> : <EyeIcon className="w-6 h-6" />}
                        </button>
                    </div>

                    {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
                    <div className="flex justify-center">
                        <button 
                            type="submit" 
                            className="bg-gradient-to-r from-blue-600 to-purple-500 dark:from-gray-700 dark:to-gray-900 hover:from-blue-700 hover:to-purple-600 text-white py-3 px-6 rounded-lg text-lg transition-all duration-300 disabled:opacity-50"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Logging in...' : 'Login'}
                        </button>
                    </div>
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