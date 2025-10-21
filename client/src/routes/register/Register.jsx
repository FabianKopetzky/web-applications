import { useTranslation } from "react-i18next"

function Register() {

  const { t } = useTranslation();

  return (
    <>
      <h1 className='text-center'>{ t('register.title') }</h1>
    </>
  )
}

export default Register
