import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000', // Update if backend runs on different port
});

export default api;
