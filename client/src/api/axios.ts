import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL as string,
  withCredentials: true,
  timeout: 120000,
});

export default instance;