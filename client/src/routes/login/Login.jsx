import { useTranslation } from "react-i18next"
import AuthForm from "../../components/AuthForm";

function Login() {

  const { t } = useTranslation();
  return (
    <>
      <AuthForm mode="login" />
    </>
  )
}

export default Login
