import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
})

// Add request interceptor to include Clerk token
axiosInstance.interceptors.request.use(
    async (config) => {
        // Get token from Clerk
        const token = await window.Clerk?.session?.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;