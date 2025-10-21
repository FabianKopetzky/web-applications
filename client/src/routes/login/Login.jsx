import { useTranslation } from "react-i18next"

function Login() {

  const { t } = useTranslation();
  return (
    <>
      <h1 className='text-center'>{ t('login.title') }</h1>
    </>
  )
}

export default Login
