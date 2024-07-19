import axios from "axios";

export const axiosInstance = axios.create({
    // baseURL:  "https://task-manager-backend-jiwj.onrender.com/api"
    baseURL:"http://localhost:5000/api"
})