import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        dob: "",
        email: "",
        phone: "",
        jobTitle: "",
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

    useEffect(() => {
        const savedData = localStorage.getItem("signupData");
        if (savedData) {
            setFormData(JSON.parse(savedData));
        }
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        let users = JSON.parse(localStorage.getItem("users")) || [];
        const userExists = users.some(user => user.email === formData.email);
    
        if (userExists) {
            alert("User already exists! Try signing in.");
            return;
        }
        users.push(formData);
        localStorage.setItem("users", JSON.stringify(users));
        navigate("/login");
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold text-center mb-6">Create Your Expenz Account</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required className="w-full p-3 rounded-md border" />
                    <input type="date" name="dob" onChange={handleChange} required className="w-full p-3 rounded-md border" />
                    <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="w-full p-3 rounded-md border" />
                    <input type="tel" name="phone" placeholder="Phone Number" onChange={handleChange} required className="w-full p-3 rounded-md border" />
                    <input type="text" name="jobTitle" placeholder="Job Title" onChange={handleChange} required className="w-full p-3 rounded-md border" />
                    {/* <input type="password" name="password" placeholder="Password" onChange={handleChange} required className="w-full p-3 rounded-md border" />
                    <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} required className="w-full p-3 rounded-md border" /> */}
                    <div className="relative">
                        <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" onChange={handleChange} required className="w-full p-3 rounded-md border pr-10" />
                        <button type="button" onClick={togglePasswordVisibility} className="absolute right-3 top-3 text-gray-600 dark:text-gray-300">
                            {showPassword ? <EyeSlashIcon className="w-6 h-6" /> : <EyeIcon className="w-6 h-6" />}
                        </button>
                    </div>
                    <div className="relative">
                        <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} required className="w-full p-3 rounded-md border pr-10" />
                        <button type="button" onClick={toggleConfirmPasswordVisibility} className="absolute right-3 top-3 text-gray-600 dark:text-gray-300">
                            {showConfirmPassword ? <EyeSlashIcon className="w-6 h-6" /> : <EyeIcon className="w-6 h-6" />}
                        </button>
                    </div>
                    <div className="flex justify-center">
                        <button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-500 dark:from-gray-700 dark:to-gray-900 hover:from-blue-700 hover:to-purple-600 text-white py-3 px-6 rounded-lg text-lg transition-all duration-300"> Create Account </button>
                    </div>
                </form>
                <p className="text-center mt-4">
                    Already a Member?{" "}
                    <button onClick={() => navigate("/login")} className="text-blue-600 hover:underline">
                        Log In
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Signup;