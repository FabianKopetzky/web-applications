import { useTranslation } from 'react-i18next'
import './App.css'

function App() {

  const { t, i18n } = useTranslation();

  return (
    <>
      <h1 className='text-center'>{ t('landing.appTitle') }</h1>
      <p className='text-center'>{ t('landing.greeting') }</p>
      <br />
      <button onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'de' : 'en')}>{ t('generic.changeLang') }</button>
    </>
  )
}

export default App
