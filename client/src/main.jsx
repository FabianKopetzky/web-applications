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
import LoggedIn from './components/LoggedIn.jsx'
import Activate from './components/Activation.jsx'

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './assets/lang/en.json'
import de from './assets/lang/de.json'
import RegisterActivation from './routes/register/RegisterActivation.jsx'


const LANGUAGE_STORAGE = 'currentLanguage';

let lang = JSON.parse(localStorage.getItem(LANGUAGE_STORAGE));
if(lang === null || lang === undefined) lang = 'en'; 

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      de: { translation: de },
    },
    lng: lang,
    fallbackLng: 'en',

    interpolation: {
      escapeValue: false,
    },
  });

//! USE THIS FOR BUILD
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
  },
  {
    path: "register/:token",
    element: <RegisterActivation />  // full activation form
  },
]);

//! THIS IS FOR CLIENT SIDE TESTING
// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <App />,
//     errorElement: <NotFound />
//   },
//   {
//     path: "login",
//     element: <Login />
//   },
//   {
//     path: "register",
//     element: <Register />
//   },
//   {
//     path: "dashboard",
//     element: <Dashboard />
//   },
//   {
//     path: "household/:id",
//     element: <HouseHold />
//   },
//   {
//     path: "register/:token",
//     element: <RegisterActivation />  // full activation form
//   },
// ]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

export { LANGUAGE_STORAGE }
