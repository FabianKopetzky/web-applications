import { useTranslation } from "react-i18next"
import AuthForm from "../../components/AuthForm";

function Register() {

  const { t } = useTranslation();

  return (
    <>
      <h1 className='text-center'>{ t('register.title') }</h1>
            <AuthForm mode="register" />
    </>
  )
}

export default Register