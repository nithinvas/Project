import axios from 'axios';
const BASE_URL = import.meta.env.VITE_APP_API_URL;

export default axios.create({
    baseURL: `${BASE_URL}/api`
});

export const axiosPrivate = axios.create({
    baseURL: `${BASE_URL}/api`,
    headers: { 'Content-Type': 'application/json' },
    // withCredentials: true
});