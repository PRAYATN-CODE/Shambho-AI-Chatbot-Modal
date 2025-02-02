import axios from 'axios';
const api_url = import.meta.env.API_URL;

const axiosInstance = axios.create({
    baseURL: `http://localhost:5000`,
})

export default axiosInstance;