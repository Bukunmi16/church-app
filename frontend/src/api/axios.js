import axios from "axios";
import useAuthStore from "../stores/auth.store";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // Include credentials (cookies) in requests
});

let refreshPromise = null;

api.interceptors.request.use((config) => {
    const accessToken = useAuthStore.getState().accessToken;

    if(accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config
})

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
    
    if(error.response && error.response.status === 401){
        return Promise.reject(error)
    }

    originalRequest._retry = true;


    try {
        if (!refreshPromise) {
            refreshPromise = useAuthStore.getState().refresh();
        }

        await refreshPromise;

        return api(originalRequest);
    } 
    catch (refreshError) {
        return Promise.reject(error);
    } finally{
        refreshPromise = null;
    }
}
)

export default api;

