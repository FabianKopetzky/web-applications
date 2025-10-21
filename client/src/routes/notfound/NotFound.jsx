import { useTranslation } from "react-i18next"

function NotFound() {

  const { t } = useTranslation();

  return (
    <>
      <h1 className='text-center'>{ t('error.notFound') }</h1>
    </>
  )
}

export default NotFound
