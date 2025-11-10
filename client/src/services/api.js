import axios from 'redaxios'

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    withCredentials: true // automatically sends cookies - needed for authentication
});

export default api;