import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        dob: "",
        address: "",
        city: "",
        state: "",
        country: "",
        postalCode: "",
        occupation: "",
        gender: "",
        maritalStatus: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name.trim()) newErrors.name = "Full name is required";
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Invalid email format";
        }
        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        } else if (!/[A-Z]/.test(formData.password)) {
            newErrors.password = "Password must contain at least one uppercase letter";
        } else if (!/[0-9]/.test(formData.password)) {
            newErrors.password = "Password must contain at least one number";
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }
        if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
        if (!formData.dob) newErrors.dob = "Date of birth is required";
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setIsLoading(true);
        setSuccessMessage("");
        
        try {
            const response = await api.post('/api/signup', {
                name: formData.name.trim(),
                email: formData.email.trim().toLowerCase(),
                password: formData.password,
                phone: formData.phone.trim(),
                dob: formData.dob,
                address: formData.address.trim(),
                city: formData.city.trim(),
                state: formData.state.trim(),
                country: formData.country.trim(),
                postalCode: formData.postalCode.trim(),
                occupation: formData.occupation.trim(),
                gender: formData.gender,
                maritalStatus: formData.maritalStatus
            });

            setSuccessMessage("Account created successfully! Redirecting to login...");
            setTimeout(() => navigate("/login"), 2000);
        } catch (error) {
            const errorMsg = error.response?.data?.error || 'Signup failed. Please try again.';
            setErrors(prev => ({ ...prev, form: errorMsg }));
        } finally {
            setIsLoading(false);
        }
    };

    const getPasswordStrength = (password) => {
        if (!password) return 0;
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        return strength;
    };

    const getPasswordStrengthColor = (password) => {
        const strength = getPasswordStrength(password);
        switch(strength) {
            case 1: return 'bg-red-500';
            case 2: return 'bg-yellow-500';
            case 3: return 'bg-blue-500';
            case 4: return 'bg-green-500';
            default: return 'bg-gray-200 dark:bg-gray-600';
        }
    };

    const getPasswordStrengthText = (password) => {
        const strength = getPasswordStrength(password);
        switch(strength) {
            case 0: return 'Very weak';
            case 1: return 'Weak';
            case 2: return 'Moderate';
            case 3: return 'Strong';
            case 4: return 'Very strong';
            default: return '';
        }
    };
    
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-2xl overflow-y-auto max-h-[90vh] scrollbar-hide">
                <h2 className="text-3xl font-bold text-center mb-6">Create Your Account</h2>
                
                {successMessage && (
                    <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 p-3 rounded-md mb-4">
                        {successMessage}
                    </div>
                )}
                
                {errors.form && (
                    <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-3 rounded-md mb-4">
                        {errors.form}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Personal Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Personal Information</h3>
                        
                        <div>
                            <label className="block text-sm font-medium mb-1">Full Name*</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`w-full p-3 rounded-md border ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} dark:bg-gray-700`}
                                placeholder="John Doe"
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium mb-1">Email*</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full p-3 rounded-md border ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} dark:bg-gray-700`}
                                placeholder="john@example.com"
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium mb-1">Phone Number*</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className={`w-full p-3 rounded-md border ${errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} dark:bg-gray-700`}
                                placeholder="1234567890"
                            />
                            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium mb-1">Date of Birth*</label>
                            <input
                                type="date"
                                name="dob"
                                value={formData.dob}
                                onChange={handleChange}
                                className={`w-full p-3 rounded-md border ${errors.dob ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} dark:bg-gray-700`}
                                max={new Date().toISOString().split('T')[0]}
                            />
                            {errors.dob && <p className="text-red-500 text-sm mt-1">{errors.dob}</p>}
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium mb-1">Gender</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                            >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                                <option value="prefer-not-to-say">Prefer not to say</option>
                            </select>
                        </div>
                    </div>

                    {/* Account Security */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Account Security</h3>
                        
                        <div>
                            <label className="block text-sm font-medium mb-1">Password*</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`w-full p-3 rounded-md border ${errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} dark:bg-gray-700 pr-10`}
                                    placeholder="At least 8 characters"
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-3 top-3 text-gray-600 dark:text-gray-300"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                            
                            {/* Password Strength Indicator */}
                            {formData.password && (
                                <div className="mt-2">
                                    <div className="flex items-center gap-1 mb-1">
                                        {[1, 2, 3, 4].map((level) => (
                                            <div 
                                                key={level}
                                                className={`h-1 flex-1 rounded-full ${
                                                    getPasswordStrength(formData.password) >= level 
                                                        ? getPasswordStrengthColor(formData.password) 
                                                        : 'bg-gray-200 dark:bg-gray-600'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {getPasswordStrengthText(formData.password)}
                                        {getPasswordStrength(formData.password) < 3 && " - Include uppercase letters and numbers for stronger password"}
                                    </p>
                                </div>
                            )}
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium mb-1">Confirm Password*</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className={`w-full p-3 rounded-md border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} dark:bg-gray-700 pr-10`}
                                    placeholder="Re-enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={toggleConfirmPasswordVisibility}
                                    className="absolute right-3 top-3 text-gray-600 dark:text-gray-300"
                                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                >
                                    {showConfirmPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                            
                            {/* Password Match Indicator */}
                            {formData.password && formData.confirmPassword && (
                                <div className="mt-2 flex items-center">
                                    {formData.password === formData.confirmPassword ? (
                                        <span className="text-green-500 text-sm">✓ Passwords match</span>
                                    ) : (
                                        <span className="text-red-500 text-sm">✗ Passwords don't match</span>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Additional Information */}
                        <div className="pt-2">
                            <h3 className="text-lg font-semibold">Additional Information</h3>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium mb-1">Occupation</label>
                            <input
                                type="text"
                                name="occupation"
                                value={formData.occupation}
                                onChange={handleChange}
                                className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                                placeholder="Your profession"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium mb-1">Marital Status</label>
                            <select
                                name="maritalStatus"
                                value={formData.maritalStatus}
                                onChange={handleChange}
                                className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                            >
                                <option value="">Select Marital Status</option>
                                <option value="single">Single</option>
                                <option value="married">Married</option>
                                <option value="divorced">Divorced</option>
                                <option value="widowed">Widowed</option>
                            </select>
                        </div>
                    </div>

                    {/* Address Information */}
                    <div className="md:col-span-2 space-y-4">
                        <h3 className="text-lg font-semibold">Address Information</h3>
                        
                        <div>
                            <label className="block text-sm font-medium mb-1">Address</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                                placeholder="Street address"
                            />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                                    placeholder="City"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium mb-1">State/Province</label>
                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                                    placeholder="State"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium mb-1">Postal Code</label>
                                <input
                                    type="text"
                                    name="postalCode"
                                    value={formData.postalCode}
                                    onChange={handleChange}
                                    className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                                    placeholder="Postal code"
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium mb-1">Country</label>
                            <input
                                type="text"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                                placeholder="Country"
                            />
                        </div>
                    </div>

                    <div className="md:col-span-2 flex justify-center pt-4">
                        <button
                            type="submit"
                            className="bg-gradient-to-r from-blue-600 to-purple-500 dark:from-gray-700 dark:to-gray-900 hover:from-blue-700 hover:to-purple-600 text-white py-3 px-8 rounded-lg text-lg font-medium transition-all duration-300 disabled:opacity-50"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating Account...
                                </span>
                            ) : (
                                "Create Account"
                            )}
                                                </button>
                </div>
            </form>

            <div className="mt-6 text-center text-sm">
                <p className="text-gray-600 dark:text-gray-300">
                    Already have an account?{' '}
                    <button 
                        type = "button"
                        onClick={() => navigate("/login")} 
                        className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                    >
                        Sign In
                    </button>
                </p>
            </div>
        </div>
    </div>
);
}

export default Signup;