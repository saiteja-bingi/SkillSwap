import axios from "axios";

const API_URL =
    import.meta.env.MODE === "development"
        ? "http://localhost:5000/api"
        : "https://skillswap-zrev.onrender.com/api";

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {

    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization =
            `Bearer ${token}`;
    }

    return config;
});

export default api;