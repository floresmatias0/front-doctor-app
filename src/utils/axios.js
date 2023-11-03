import axios from 'axios';

export const instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    timeout: 5000,
    headers: {
        // 'X-Custom-Header': 'foobar'
        'Content-Type': 'application/json'
    }
});

export const instanceUpload = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    timeout: 300000,
    headers: {
        // 'X-Custom-Header': 'foobar'
        'Content-Type': 'multipart/form-data'
    }
});