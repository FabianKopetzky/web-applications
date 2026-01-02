import { useTranslation } from "react-i18next";

function HouseholdWidget({houseHoldName, houseHoldID, memberCount, onClick, onDelete}) {
    
    const { t } = useTranslation();

    return (<>
        <div>
            <h4>{houseHoldName}</h4>
            <p>({t('dashboard.householdMembers')}: {memberCount})</p>
            <button onClick={() => onClick(houseHoldID)}>{t('dashboard.householdOpen')}</button>
            <button onClick={() => onDelete(houseHoldID)}>{t('dashboard.householdDelete')}</button>
        </div>
    </>)
}

export default HouseholdWidget;