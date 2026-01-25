import { useTranslation } from "react-i18next"
import AuthForm from "../../components/AuthForm";

function Register() {

  const { t } = useTranslation();

  return (
    <>
            <AuthForm mode="register" />
    </>
  )
}

export default Register