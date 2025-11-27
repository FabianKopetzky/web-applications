import { useTranslation } from "react-i18next";
import AuthForm from "../../components/AuthForm";
import { useParams } from "react-router-dom";

function RegisterActivation() {
  const { t } = useTranslation();
  const { token } = useParams();

  return (
    <>
      <h1 className="text-center">{t('register.title')}</h1>
      <AuthForm mode="activation" token={token} />
    </>
  );
}

export default RegisterActivation;


