import { useTranslation } from "react-i18next";
import AuthForm from "../../components/AuthForm";
import { useParams } from "react-router-dom";

function RegisterActivation() {
  const { t } = useTranslation();
  const { token } = useParams();

  return (
    <>
      <AuthForm mode="activation" token={token} />
    </>
  );
}

export default RegisterActivation;


