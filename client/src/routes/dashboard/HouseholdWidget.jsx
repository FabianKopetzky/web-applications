import { useTranslation } from "react-i18next";
import {Button} from "antd"

function HouseholdWidget({houseHoldName, houseHoldID, memberCount, onClick, onDelete}) {
    
    const { t } = useTranslation();

    return (<>
        <div>
            <h4>{houseHoldName}</h4>
            <p>({t('dashboard.householdMembers')}: {memberCount})</p>
            <Button type="primary" onClick={() => onClick(houseHoldID)}>{t('dashboard.householdOpen')}</Button>
            <Button type="dashed" danger onClick={() => onDelete(houseHoldID)}>{t('dashboard.householdDelete')}</Button>
        </div>
    </>)
}

export default HouseholdWidget;