import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [otpInput, setOtpInput] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

    const sendOTP = async () => {
        if (!email) {
            setError("Please enter your email address");
            return;
        }

        setIsLoading(true);
        setError("");
        try {
            const response = await api.post('/api/forgot-password', { email });
            setOtpSent(true);
            setSuccessMessage(response.data.message || "OTP sent to your email");
            setTimeout(() => setSuccessMessage(""), 5000);
        } catch (error) {
            setError(error.response?.data?.error || 'Failed to send OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const verifyOTP = async () => {
        if (!otpInput) {
            setError("Please enter the OTP");
            return;
        }

        setIsLoading(true);
        setError("");
        try {
            // First verify the OTP is valid
            await api.post('/api/verify-otp', { 
                email, 
                otp: otpInput
            });
            setOtpVerified(true);
            setSuccessMessage("OTP verified successfully");
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (error) {
            setError(error.response?.data?.error || 'Invalid OTP or expired. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const resetPassword = async () => {
        if (!newPassword || !confirmPassword) {
            setError("Please fill in all fields");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setIsLoading(true);
        setError("");
        try {
            await api.post('/api/reset-password', { 
                email, 
                otp: otpInput,
                newPassword 
            });
            
            setSuccessMessage("Password reset successfully! Redirecting to login...");
            setTimeout(() => navigate("/login"), 2000);
        } catch (error) {
            setError(error.response?.data?.error || 'Password reset failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold text-center mb-6">Password Recovery</h2>
                
                {successMessage && (
                    <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 p-3 rounded-md mb-4">
                        {successMessage}
                    </div>
                )}
                
                {error && (
                    <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-3 rounded-md mb-4">
                        {error}
                    </div>
                )}

                {/* Step 1: Enter Email */}
                {!otpSent && (
                    <div className="space-y-4">
                        <p className="text-gray-600 dark:text-gray-300">
                            Enter your email address to receive a password reset OTP
                        </p>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email" 
                            className="w-full p-3 rounded-md border dark:bg-gray-700 dark:border-gray-600" 
                        />
                        <button 
                            onClick={sendOTP} 
                            className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg text-lg w-full disabled:opacity-50"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Sending...' : 'Send OTP'}
                        </button>
                    </div>
                )}

                {/* Step 2: Verify OTP */}
                {otpSent && !otpVerified && (
                    <div className="space-y-4">
                        <p className="text-gray-600 dark:text-gray-300">
                            Enter the 6-digit OTP sent to {email}
                        </p>
                        <input 
                            type="text" 
                            value={otpInput} 
                            onChange={(e) => setOtpInput(e.target.value)}
                            placeholder="Enter OTP" 
                            className="w-full p-3 rounded-md border dark:bg-gray-700 dark:border-gray-600" 
                            maxLength="6"
                        />
                        <div className="flex space-x-4">
                            <button 
                                onClick={() => {
                                    setOtpSent(false);
                                    setOtpInput("");
                                }}
                                className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-3 px-6 rounded-lg text-lg flex-1"
                            >
                                Back
                            </button>
                            <button 
                                onClick={verifyOTP} 
                                className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg text-lg flex-1 disabled:opacity-50"
                                disabled={isLoading || otpInput.length !== 6}
                            >
                                {isLoading ? 'Verifying...' : 'Verify'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Reset Password After OTP Verification */}
                {otpVerified && (
                    <div className="space-y-4">
                        <p className="text-gray-600 dark:text-gray-300">
                            Create a new password for your account
                        </p>
                        
                        <div className="relative">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                value={newPassword} 
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="New Password" 
                                className="w-full p-3 rounded-md border dark:bg-gray-700 dark:border-gray-600 pr-10" 
                            />
                            <button 
                                type="button" 
                                onClick={togglePasswordVisibility} 
                                className="absolute right-3 top-3 text-gray-600 dark:text-gray-300"
                            >
                                {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                            </button>
                        </div>
                        
                        <div className="relative">
                            <input 
                                type={showConfirmPassword ? "text" : "password"} 
                                value={confirmPassword} 
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm Password" 
                                className="w-full p-3 rounded-md border dark:bg-gray-700 dark:border-gray-600 pr-10" 
                            />
                            <button 
                                type="button" 
                                onClick={toggleConfirmPasswordVisibility} 
                                className="absolute right-3 top-3 text-gray-600 dark:text-gray-300"
                            >
                                {showConfirmPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                            </button>
                        </div>
                        
                        <div className="flex space-x-4">
                            <button 
                                onClick={() => {
                                    setOtpVerified(false);
                                    setOtpInput("");
                                }}
                                className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-3 px-6 rounded-lg text-lg flex-1"
                            >
                                Back
                            </button>
                            <button 
                                onClick={resetPassword} 
                                className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg text-lg flex-1 disabled:opacity-50"
                                disabled={isLoading || !newPassword || !confirmPassword}
                            >
                                {isLoading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </div>
                    </div>
                )}

                <div className="mt-6 text-center">
                    <button 
                        onClick={() => navigate("/login")} 
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                        Remember your password? Login here
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;