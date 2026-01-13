import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import NotFound from './routes/notfound/NotFound.jsx';
import Login from './routes/login/Login.jsx';
import Register from './routes/register/Register.jsx';
import Dashboard from './routes/dashboard/Dashboard.jsx';
import HouseHold from './routes/household/Household.jsx';
import LoggedIn from './components/LoggedIn.jsx';
import Activate from './components/Activation.jsx';

import i18n from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';
import en from './assets/lang/en.json';
import de from './assets/lang/de.json';
import RegisterActivation from './routes/register/RegisterActivation.jsx';
import MainLayout from './layouts/MainLayout.jsx';
import MinimalLayout from './layouts/MinimalLayout.jsx';
import { ConfigProvider } from 'antd';
import enUS from 'antd/locale/en_US';
import deDE from 'antd/locale/de_DE';


const LANGUAGE_STORAGE = 'currentLanguage';

let lang = JSON.parse(localStorage.getItem(LANGUAGE_STORAGE));
if (lang === null || lang === undefined) lang = 'en';

i18n.use(initReactI18next).init({
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
function AntdI18nProvider({ children }) {
  const { i18n } = useTranslation();

  // Pick AntD locale dynamically based on i18next language
  const locale = i18n.language === 'de' ? deDE : enUS;

  return <ConfigProvider locale={locale}>{children}</ConfigProvider>;
}


//! USE THIS FOR BUILD
const router = createBrowserRouter([
  {
    element: <MainLayout isLoggedIn={false} />,
    children: [
      {
        path: '/',
        element: <App />,
        errorElement: <NotFound />,
      },
    ],
  },
  {
  element: (
    <LoggedIn>
      <MainLayout isLoggedIn={true} />
    </LoggedIn>
  ),
  children: [
    { path: "dashboard", element: <Dashboard /> },
    { path: "household/:id", element: <HouseHold /> },
  ],
},
  {
    element: <MinimalLayout />,
    children: [
      {
        path: 'register/:token',
        element: <RegisterActivation />, // full activation form
      },
            {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
    ]
  }
]);

// ! THIS IS FOR CLIENT SIDE TESTING
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
    <AntdI18nProvider>
      <RouterProvider router={router} />
    </AntdI18nProvider>
  </StrictMode>
);

export { LANGUAGE_STORAGE };
