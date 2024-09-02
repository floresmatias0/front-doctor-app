import axios from 'axios';

export const instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL, 
    headers: {
        'Content-Type': 'application/json'
    }
});

instance.interceptors.request.use(config => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, error => {
    localStorage?.removeItem("user");
    localStorage?.removeItem("authToken");
    window.location.href = `${
      import.meta.env.VITE_BACKEND_URL
    }/auth/google/logout`;
    return Promise.reject(error);
});

export const instanceUpload = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    headers: {
        'Content-Type': 'multipart/form-data'
    }
});