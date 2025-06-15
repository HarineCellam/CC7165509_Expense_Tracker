import emailjs from "emailjs-com";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false); 
    const [otpInput, setOtpInput] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const generateOTP = () => {
        return Math.floor(100000 + Math.random() * 900000).toString(); 
    };

    const sendOTP = () => {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    const userExists = users.some(user => user.email === email);

    if (!userExists) {
        alert("Email not found! Try signing up.");
        return;
    }

    const otp = generateOTP();

    let otpList = JSON.parse(localStorage.getItem("otpList")) || [];

    otpList.push({ email, otp, timestamp: Date.now() });

    localStorage.setItem("otpList", JSON.stringify(otpList));

    const templateParams = {
        email: email,
        passcode: otp,
        time: new Date(Date.now() + 15 * 60000).toLocaleTimeString(),
    };

    emailjs.send(
        "service_i98ozws",
        "template_wb8z61k",
        templateParams,
        "lSCnmAhkXcyxWspmR"
        ).then(() => {
            setOtpSent(true);
            alert("OTP sent successfully! Please check your email.");
        }).catch(() => {
            alert("Failed to send OTP. Please try again.");
        });
    };

    const verifyOTP = () => {
    let otpList = JSON.parse(localStorage.getItem("otpList")) || [];

    const storedOTP = otpList.find(entry => entry.email === email && entry.otp === otpInput);

    if (!storedOTP) {
        alert("Invalid OTP or email mismatch. Please try again.");
        return;
    }

    alert("OTP verified! You can now reset your password.");

    otpList = otpList.filter(entry => entry.email !== email || entry.otp !== otpInput);
    localStorage.setItem("otpList", JSON.stringify(otpList));
    setOtpVerified(true);
    };

    const resetPassword = () => {
    if (newPassword !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    let userIndex = users.findIndex(user => user.email === email);

    if (userIndex !== -1) {
        users[userIndex].password = newPassword;
        users[userIndex].confirmPassword = confirmPassword;

        localStorage.setItem("users", JSON.stringify(users));
        alert("Password reset successful! Please log in.");
        navigate("/login");
        }
    };

    const cleanExpiredOTPs = () => {
    let otpList = JSON.parse(localStorage.getItem("otpList")) || [];
    const currentTime = Date.now();

    otpList = otpList.filter(entry => currentTime - entry.timestamp < 15 * 60000);
    localStorage.setItem("otpList", JSON.stringify(otpList));
    };
    cleanExpiredOTPs();

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold text-center mb-6">Forgot Password</h2>

                {/* Step 1: Enter Email */}
                {!otpSent && (
                    <div>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email" className="w-full p-3 rounded-md border" />
                        <button onClick={sendOTP} className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg text-lg w-full mt-4">
                            Send OTP
                        </button>
                    </div>
                )}

                {/* Step 2: Verify OTP */}
                {otpSent && !otpVerified && (
                    <div>
                        <input type="text" value={otpInput} onChange={(e) => setOtpInput(e.target.value)}
                            placeholder="Enter OTP" className="w-full p-3 rounded-md border mt-4" />
                        <button onClick={verifyOTP} className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg text-lg w-full mt-4">
                            Verify OTP
                        </button>
                    </div>
                )}

                {/* Step 3: Reset Password After OTP Verification */}
                {otpVerified && (
                    <div>
                        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="New Password" className="w-full p-3 rounded-md border mt-4" />
                        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm Password" className="w-full p-3 rounded-md border mt-4" />
                        <button onClick={resetPassword} className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg text-lg w-full mt-4">
                            Reset Password
                        </button>
                    </div>
                )}

                <p className="text-center mt-4">
                    <button onClick={() => navigate("/login")} className="text-blue-600 hover:underline">
                        Back to Login
                    </button>
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;