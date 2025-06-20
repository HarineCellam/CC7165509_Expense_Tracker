// import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import apiService from '../api';

// const Login = () => {
//     const navigate = useNavigate();
//     const [formData, setFormData] = useState({ email: "", password: "" });
//     const [errorMessage, setErrorMessage] = useState("");
//     const [showPassword, setShowPassword] = useState(false);
//     const [isLoading, setIsLoading] = useState(false);

//     const togglePasswordVisibility = () => setShowPassword(!showPassword);

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async (e) => {
//   e.preventDefault();
//   setErrorMessage("");
//   setIsLoading(true);

//   try {
//     const response = await apiService.auth.login(formData); // Changed from api.post()
    
//     // Store the token in localStorage
//     localStorage.setItem('token', response.token);
    
//     // Store user data if available
//     if (response.user) {
//       localStorage.setItem('user', JSON.stringify(response.user));
//     }
    
//     // Redirect to dashboard
//     navigate("/dashboard");
//   } catch (error) {
//     setErrorMessage(
//       error.response?.data?.message || 
//       'Login failed. Please try again.'
//     );
//   } finally {
//     setIsLoading(false);
//   }
// };

//     return (
//         <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
//             <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
//                 <h2 className="text-3xl font-bold text-center mb-6">Welcome Back</h2>
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     <input 
//                         type="email" 
//                         name="email" 
//                         placeholder="Email" 
//                         onChange={handleChange} 
//                         required 
//                         className="w-full p-3 rounded-md border" 
//                     />

//                     <div className="relative">
//                         <input 
//                             type={showPassword ? "text" : "password"} 
//                             name="password" 
//                             placeholder="Password" 
//                             onChange={handleChange} 
//                             required 
//                             className="w-full p-3 rounded-md border pr-10" 
//                         />
//                         <button 
//                             type="button" 
//                             onClick={togglePasswordVisibility} 
//                             className="absolute right-3 top-3 text-gray-600 dark:text-gray-300"
//                         >
//                             {showPassword ? <EyeSlashIcon className="w-6 h-6" /> : <EyeIcon className="w-6 h-6" />}
//                         </button>
//                     </div>

//                     {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
//                     <div className="flex justify-center">
//                         <button 
//                             type="submit" 
//                             className="bg-gradient-to-r from-blue-600 to-purple-500 dark:from-gray-700 dark:to-gray-900 hover:from-blue-700 hover:to-purple-600 text-white py-3 px-6 rounded-lg text-lg transition-all duration-300 disabled:opacity-50"
//                             disabled={isLoading}
//                         >
//                             {isLoading ? 'Logging in...' : 'Login'}
//                         </button>
//                     </div>
//                 </form>
//                 <p className="text-center mt-4">
//                     <button onClick={() => navigate("/forgotpassword")} className="text-blue-600 hover:underline">
//                         Forgot Password?
//                     </button>
//                 </p>
//                 <p className="text-center mt-4">
//                     New to Expenz?{" "}
//                     <button onClick={() => navigate("/signup")} className="text-blue-600 hover:underline">
//                         Create your account
//                     </button>
//                 </p>
//             </div>
//         </div>
//     );
// };

// export default Login;

// import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import apiService from '../api';

// const Login = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     email: '',
//     password: ''
//   });
//   const [errorMessage, setErrorMessage] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const togglePasswordVisibility = () => setShowPassword(!showPassword);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//     if (errorMessage) setErrorMessage('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     // Client-side validation
//     if (!formData.email || !formData.password) {
//       setErrorMessage('Please fill in all fields');
//       return;
//     }

//     setIsLoading(true);
//     setErrorMessage('');

//     try {
//       const response = await apiService.auth.login({
//         email: formData.email.trim().toLowerCase(),
//         password: formData.password
//       });

//       // Store authentication data based on your backend response
//       localStorage.setItem('token', response.token);
//       localStorage.setItem('user', JSON.stringify({
//         id: response.data.user.id,
//         name: response.data.user.name,
//         email: response.data.user.email
//       }));

//       // Redirect to dashboard
//       navigate('/dashboard');
//     } catch (error) {
//       let errorMsg = 'Login failed. Please try again.';
      
//       if (error.response) {
//         // Match the error handling to your backend responses
//         switch (error.response.status) {
//           case 400:
//             errorMsg = error.response.data?.message || 'Invalid request';
//             break;
//           case 401:
//             errorMsg = 'Invalid email or password';
//             break;
//           case 500:
//             errorMsg = 'Server error. Please try again later';
//             break;
//           default:
//             if (error.response.data?.message) {
//               errorMsg = error.response.data.message;
//             }
//         }
//       } else if (error.request) {
//         errorMsg = 'No response from server. Check your connection.';
//       }

//       setErrorMessage(errorMsg);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
//         <div className="text-center">
//           <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
//             Sign in to your account
//           </h2>
//         </div>

//         {errorMessage && (
//           <div className="rounded-md bg-red-50 dark:bg-red-900/30 p-4">
//             <p className="text-sm text-red-700 dark:text-red-300">{errorMessage}</p>
//           </div>
//         )}

//         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//           <div className="rounded-md shadow-sm space-y-4">
//             <div>
//               <label htmlFor="email" className="sr-only">
//                 Email address
//               </label>
//               <input
//                 id="email"
//                 name="email"
//                 type="email"
//                 autoComplete="email"
//                 required
//                 value={formData.email}
//                 onChange={handleChange}
//                 className="appearance-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
//                 placeholder="Email address"
//               />
//             </div>
//             <div className="relative">
//               <label htmlFor="password" className="sr-only">
//                 Password
//               </label>
//               <input
//                 id="password"
//                 name="password"
//                 type={showPassword ? 'text' : 'password'}
//                 autoComplete="current-password"
//                 required
//                 minLength={8}
//                 value={formData.password}
//                 onChange={handleChange}
//                 className="appearance-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm pr-10"
//                 placeholder="Password"
//               />
//               <button
//                 type="button"
//                 className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
//                 onClick={togglePasswordVisibility}
//                 aria-label={showPassword ? 'Hide password' : 'Show password'}
//               >
//                 {showPassword ? (
//                   <EyeSlashIcon className="h-5 w-5" />
//                 ) : (
//                   <EyeIcon className="h-5 w-5" />
//                 )}
//               </button>
//             </div>
//           </div>

//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               <input
//                 id="remember-me"
//                 name="remember-me"
//                 type="checkbox"
//                 className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded"
//               />
//               <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
//                 Remember me
//               </label>
//             </div>

//             <div className="text-sm">
//               <button
//                 type="button"
//                 onClick={() => navigate('/forgot-password')}
//                 className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
//               >
//                 Forgot your password?
//               </button>
//             </div>
//           </div>

//           <div>
//             <button
//               type="submit"
//               disabled={isLoading}
//               className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
//                 isLoading ? 'opacity-75 cursor-not-allowed' : ''
//               }`}
//             >
//               {isLoading ? (
//                 <>
//                   <svg
//                     className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                   >
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                     ></circle>
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                     ></path>
//                   </svg>
//                   Signing in...
//                 </>
//               ) : (
//                 'Sign in'
//               )}
//             </button>
//           </div>
//         </form>

//         <div className="mt-6">
//           <div className="relative">
//             <div className="absolute inset-0 flex items-center">
//               <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
//             </div>
//             <div className="relative flex justify-center text-sm">
//               <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
//                 Don't have an account?
//               </span>
//             </div>
//           </div>

//           <div className="mt-6">
//             <button
//               type="button"
//               onClick={() => navigate('/signup')}
//               className="w-full flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
//             >
//               Create new account
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;


import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../api";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const togglePasswordVisibility = () =>
    setShowPassword((prev) => !prev);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    if (errorMessage) setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple client-side validation
    if (!formData.email || !formData.password) {
      setErrorMessage("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      // Call the login endpoint on your API
      const response = await apiService.auth.login({
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      });
      // Expected response shape:
      // { status: "success", token, data: { user: { id, name, email } } }

      // Store the token for further requests
      localStorage.setItem("token", response.token);
      // Optionally, store the user data for quick access
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Redirect to the dashboard after successful login
      navigate("/dashboard");
    } catch (error) {
      // Adjust error handling to match your backend's error format
      let errorMsg = "Login failed. Please try again.";
      if (error.response) {
        switch (error.response.status) {
          case 400:
            errorMsg = error.response.data?.message || "Invalid request";
            break;
          case 401:
            errorMsg = "Invalid email or password";
            break;
          case 500:
            errorMsg = "Server error. Please try again later";
            break;
          default:
            if (error.response.data?.message) {
              errorMsg = error.response.data.message;
            }
        }
      } else if (error.request) {
        errorMsg = "No response from server. Check your connection.";
      }
      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Sign in to your account
          </h2>
        </div>

        {errorMessage && (
          <div className="rounded-md bg-red-50 dark:bg-red-900/30 p-4">
            <p className="text-sm text-red-700 dark:text-red-300">{errorMessage}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                minLength={8}
                value={formData.password}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm pr-10"
                placeholder="Password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <button
                type="button"
                onClick={() => navigate('/forgotpassword')}
                className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
              >
                Forgot your password?
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isLoading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                Don't have an account?
              </span>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              Create new account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;