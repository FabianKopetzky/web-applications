import axios from 'redaxios'

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    withCredentials: true // automatically sends cookies - needed for authentication
});

// const token = localStorage.getItem('accessToken');
// console.log(token)
// const res = await api.get("/getUser", {
//   headers: { Authorization: `Bearer ${token}` }
// });
// console.log("Another" + token)

const token = localStorage.getItem('accessToken');

if (!token) {
  console.log("No user is logged in.");
  // Handle unauthenticated case, e.g., redirect to login
} else {
  try {
    const res = await api.get("/getUser", {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(res.data);
  } catch (error) {
    console.error("Error fetching user:", error);
    // Optionally handle invalid token (maybe logout)
  }
}


export default api;