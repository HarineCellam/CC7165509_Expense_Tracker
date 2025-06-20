import axios from 'axios';

// 1. Create an Axios instance with default config
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  }
});

// 2. Request Interceptor - Add JWT token to every request if available
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 3. Response Interceptor - Global error handling and returning only response data
API.interceptors.response.use(
  (response) => {
    return response.data; // Return only the data part
  },
  (error) => {
    if (error.response) {
      // Server responded with a status code outside the 2xx range
      switch (error.response.status) {
        case 401:
          // Token expired or invalid - clear any stored tokens/users and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          break;
        case 403:
          console.error('Forbidden:', error.response.data);
          break;
        case 404:
          console.error('Not Found:', error.response.data);
          break;
        case 500:
          console.error('Server Error:', error.response.data);
          break;
        default:
          console.error('Unhandled Error:', error.response.data);
      }
    } else if (error.request) {
      console.error('No Response:', error.request);
    } else {
      console.error('Request Error:', error.message);
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

// 4. Define API Endpoints
const apiService = {
  // Auth endpoints
  auth: {
    signup: (userData) => API.post('/auth/signup', userData),
    login: (credentials) => API.post('/auth/login', credentials),
    forgotPassword: (email) => API.post('/auth/forgot-password', { email }),
    resetPassword: (data) => API.post('/auth/reset-password', data),
  },

  // Transaction endpoints
  transactions: {
    getAll: (userId) => API.get(`api/transactions/${userId}`),
    create: (transactionData) => API.post('api/transactions', transactionData),
    delete: (id) => API.delete(`api/transactions/${id}`),
  },

  // Budget endpoints
  budgets: {
    getAll: (userId) => API.get(`/budgets/${userId}`),
    create: (budgetData) => API.post('/budgets', budgetData),
    update: (id, budgetData) => API.put(`/budgets/${id}`, budgetData),
    delete: (id) => API.delete(`/budgets/${id}`),
  },

  // Profile endpoints (assuming you create these endpoints in the backend)
  profile: {
    get: (email) => API.get(`/profile/${email}`),
    update: (email, userData) => API.put(`/profile/${email}`, userData),
  }
};

export default apiService;
export { API };
