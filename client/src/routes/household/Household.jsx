import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom"

import { HouseHoldModel } from "../../models/HouseHoldModel";

function HouseHold() {

  const { id } = useParams();
  const { t } = useTranslation();



  return (
    <>
      <h1 className='text-center'>{ t('household.title')} { id }</h1>
    </>
  )
}

export default HouseHold
