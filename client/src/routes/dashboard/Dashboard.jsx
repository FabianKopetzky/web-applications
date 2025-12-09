import { useTranslation } from "react-i18next"
import LogoutButton from "../../components/logoutButton";


function Dashboard() {

  const { t } = useTranslation();
  

  return (
    <>
          <LogoutButton />
      <h1 className='text-center'>{ t('dashboard.title') }</h1>

      {/* <p>{user.firstname}</p> */}
    </>
  )
}

export default Dashboard
