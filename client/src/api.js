import axios from 'axios';

// 1. Create Axios instance with default config
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  }
});
// 2. Request Interceptor - Add JWT token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Response Interceptor - Handle global errors
API.interceptors.response.use(
  (response) => {
    // Any status code within 2xx triggers this
    return response.data; // Return only the data part
  },
  (error) => {
    // Any status codes outside 2xx trigger this
    if (error.response) {
      // Server responded with a status code
      switch (error.response.status) {
        case 401:
          // Token expired or invalid
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          break;
        case 403:
          // Forbidden (no permission)
          console.error('Forbidden:', error.response.data);
          break;
        case 404:
          // Not found
          console.error('Not Found:', error.response.data);
          break;
        case 500:
          // Server error
          console.error('Server Error:', error.response.data);
          break;
        default:
          console.error('Unhandled Error:', error.response.data);
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('No Response:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('Request Error:', error.message);
    }
    
    return Promise.reject(error.response?.data || error.message);
  }
);

// 4. API Endpoints
const apiService = {
  // Auth
  auth: {
    signup: (userData) => API.post('/auth/signup', userData),
    login: (credentials) => API.post('/auth/login', credentials),
    forgotPassword: (email) => API.post('/auth/forgot-password', { email }),
    resetPassword: (data) => API.post('/auth/reset-password', data),
  },
  
  // Transactions
  transactions: {
    getAll: (userId) => API.get(`/transactions/${userId}`),
    create: (transactionData) => API.post('/transactions', transactionData),
    delete: (id) => API.delete(`/transactions/${id}`),
  },
  
  // Budgets
  budgets: {
    getAll: (userId) => API.get(`/budgets/${userId}`),
    create: (budgetData) => API.post('/budgets', budgetData),
    update: (id, budgetData) => API.put(`/budgets/${id}`, budgetData),
    delete: (id) => API.delete(`/budgets/${id}`),
  },
  
  // Profile
  profile: {
    get: (email) => API.get(`/profile/${email}`),
    update: (email, userData) => API.put(`/profile/${email}`, userData),
  }
};

export default apiService;