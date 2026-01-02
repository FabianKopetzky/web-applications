import { useState } from "react"
import api from "../services/api";
import { useTranslation } from "react-i18next";

export default function HouseholdUsers({onUserAdded, onUserDeleted, userIdList, hasUnsavedChanges, users, loggedInUserId}) {

    const USER_API = "/user";
    const { t } = useTranslation();

    function alreadyContainsUser(id) {
        for(let i = 0; i < userIdList.length; i++) {
            if(userIdList[i].toString() == id.toString()) return true;
        }
        return false;
    }

    async function addUserToHousehold() {
        setError("");

        if(hasUnsavedChanges) {
            setError(t('household.error.unsavedChangesAdd'));
            return;
        }

        const address = email.trim();
        if(address.length <= 0) {
            setError(t('household.error.emptyMail'));
            return;
        }

        try {
            const accessToken = localStorage.getItem("accessToken");
            const response = await api.get(`${USER_API}/auth-by-email/${address}`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            console.log(response.data);
            
            if(alreadyContainsUser(response.data)) {
                setError(t('household.error.alreadyMember'));
                return;
            }

            onUserAdded(response.data);
        } catch(error) {
            console.log(error);
            setError(t('household.error.emailGeneric'));
        }
    }
    function removeUser(userId) {
        setRemoveError("");
        if(hasUnsavedChanges) {
            setRemoveError(t('household.error.unsavedChangesRemove'));
            return;
        }
        onUserDeleted(userId);
    }   

    const userList = users.map(user => {
        // only the owning user (index 0, default added) can see this, therefore its ensured that removing owner and removing self is not possible. If owner deletes household from dashboard, another user becomes owner (at index 0)
        const isOwningUser = loggedInUserId == user.id; 
        const removeButton = (<button onClick={() => removeUser(user.id)}>Remove</button>);
        return (<div className="flex flex-row gap-2">
            <p>{user.username}</p>
            {!isOwningUser && removeButton}
        </div>)
    });

    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [removeError, setRemoveError] = useState("");
    return (
        <>
            <h2>{t('household.memberList')}</h2>
            {userList}
            <p>{removeError}</p>
            <h2>{t('household.addUser')}</h2>
            <input type="text" placeholder={t('household.placeholder.email')} value={email} onInput={e => setEmail(e.target.value)} />
            <button onClick={() => addUserToHousehold()}>{t('household.addUserButton')}</button>
            <p>{error}</p>
        </>
    )
}