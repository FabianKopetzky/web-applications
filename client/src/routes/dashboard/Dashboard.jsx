import { useTranslation } from "react-i18next"

function Dashboard() {

  const { t } = useTranslation();

  return (
    <>
      <h1 className='text-center'>{ t('dashboard.title') }</h1>
    </>
  )
}

export default Dashboard
