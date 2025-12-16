import axios from 'redaxios'

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    withCredentials: true // automatically sends cookies - needed for authentication
});

const token = localStorage.getItem('accessToken');
console.log(token)
const res = await api.get("/getUser", {
  headers: { Authorization: `Bearer ${token}` }
});
console.log("Another" + token)

export default api;