import axios from 'axios';

export const instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    timeout: 5000,
    credentials: 'include',
    withCredentials: true,
    mode: 'cors', 
    headers: {
        'Content-Type': 'application/json'
    }
});

export const instanceUpload = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    timeout: 300000,
    headers: {
        'Content-Type': 'multipart/form-data'
    }
});