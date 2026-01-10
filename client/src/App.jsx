import { useTranslation } from 'react-i18next'
import './App.css'
import { LANGUAGE_STORAGE } from './main';
import { Button, Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
// import { Layout, Menu } from "antd";
import MainLayout from "./layouts/MainLayout";

const { Header, Content, Footer } = Layout;

function App() {

  const { t, i18n } = useTranslation();

  function changeLanguage() {
    i18n.changeLanguage(i18n.language === 'en' ? 'de' : 'en');
    localStorage.setItem(LANGUAGE_STORAGE, JSON.stringify(i18n.language));
  }

  return (
    <>
    {/* <MainLayout></MainLayout> */}


{/* 

    <Link to={"/register"}>
    <Button type='default'> {t('register.title')}</Button>
    </Link>
    <Link to={"/login"}>
    <Button type='primary'> {t('login.title')}</Button>
    </Link>

      <h1 className='text-center'>{ t('landing.appTitle') }</h1>
      <p className='text-center'>{ t('landing.greeting') }</p>
      <br />
      <Button onClick={() => changeLanguage()}>{ t('generic.changeLang') }</Button> */}
    </>
  )
}

export default App
