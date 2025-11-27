import { useTranslation } from "react-i18next"
import AuthForm from "../../components/AuthForm";

function Login() {

  const { t } = useTranslation();
  return (
    <>
      <h1 className='text-center'>{ t('login.title') }</h1>
      <AuthForm mode="login" />
    </>
  )
}

export default Login
