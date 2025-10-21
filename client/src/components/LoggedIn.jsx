import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom"

function LoggedIn(props) {
  let isLoggedIn = true;

  const { t } = useTranslation();
  
  if(!isLoggedIn) {
    return (<>
        <h1 className='text-center'>{ t('login.prompt') }</h1>
        <Link to="/login">{ t('login.promptTitle') }</Link>
    </>)
  }
  return <>{ props.children }</>
}

export default LoggedIn
