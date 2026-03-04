import axios from 'axios';

// Create axios instance
const axiosInstance = axios.create({
   baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
    withCredentials: true,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
    }
});

// Function to get cookie by name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        const cookieValue = parts.pop()?.split(';').shift();
        return cookieValue || null;
    }
    return null;
}

// Add request interceptor to include CSRF token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = getCookie('XSRF-TOKEN');

        if (token) {
            config.headers['X-XSRF-TOKEN'] = decodeURIComponent(token);
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
