import { useTranslation } from 'react-i18next'
import './App.css'
import { LANGUAGE_STORAGE } from './main';

function App() {

  const { t, i18n } = useTranslation();

  function changeLanguage() {
    i18n.changeLanguage(i18n.language === 'en' ? 'de' : 'en');
    localStorage.setItem(LANGUAGE_STORAGE, JSON.stringify(i18n.language));
  }

  return (
    <>
      <a href="/register">Register</a> <br />
      <a href="/login">Login</a>
      <h1 className='text-center'>{ t('landing.appTitle') }</h1>
      <p className='text-center'>{ t('landing.greeting') }</p>
      <br />
      <button onClick={() => changeLanguage()}>{ t('generic.changeLang') }</button>
    </>
  )
}

export default App
