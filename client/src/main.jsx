import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import NotFound from './routes/notfound/NotFound.jsx'
import Login from './routes/login/Login.jsx'
import Register from './routes/register/Register.jsx'
import Dashboard from './routes/dashboard/Dashboard.jsx'
import HouseHold from './routes/household/Household.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />
  },
  {
    path: "login",
    element: <Login />
  },
  {
    path: "register",
    element: <Register />
  },
  {
    path: "dashboard",
    element: <Dashboard />
  },
  {
    path: "household/:id",
    element: <HouseHold />
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
