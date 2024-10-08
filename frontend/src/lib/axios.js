import axios from 'axios';

const axiosInstance = axios.create({
  baseURL:
    import.meta.mode === 'development'
      ? 'http://localhost:3000'
      : 'https://api.example.com',
  withCredentials: true,
});

export default axiosInstance;
