import {useState} from "react"
import api from "../services/api";
import {useTranslation} from "react-i18next";
import {Button, Tooltip, Space, Typography, Input, Row, Col} from "antd"

import {PlusCircleOutlined, CloseOutlined} from '@ant-design/icons';

export default function HouseholdUsers({
                                           onUserAdded,
                                           onUserDeleted,
                                           userIdList,
                                           hasUnsavedChanges,
                                           users,
                                           loggedInUserId
                                       }) {

    const {Title, Text} = Typography;
    const USER_API = "/user";
    const {t} = useTranslation();

    function alreadyContainsUser(id) {
        for (let i = 0; i < userIdList.length; i++) {
            if (userIdList[i].toString() == id.toString()) return true;
        }
        return false;
    }

    async function addUserToHousehold() {
        setError("");

        if (hasUnsavedChanges) {
            setError(t('household.error.unsavedChangesAdd'));
            return;
        }

        const address = email.trim();
        if (address.length <= 0) {
            setError(t('household.error.emptyMail'));
            return;
        }

        try {
            const accessToken = localStorage.getItem("accessToken");
            const response = await api.get(`${USER_API}/auth-by-email/${address}`, {
                headers: {Authorization: `Bearer ${accessToken}`}
            });
            console.log(response.data);

            if (alreadyContainsUser(response.data)) {
                setError(t('household.error.alreadyMember'));
                return;
            }

            onUserAdded(response.data);
        } catch (error) {
            console.log(error);
            setError(t('household.error.emailGeneric'));
        }
    }

    function removeUser(userId) {
        setRemoveError("");
        if (hasUnsavedChanges) {
            setRemoveError(t('household.error.unsavedChangesRemove'));
            return;
        }
        onUserDeleted(userId);
    }

    const userList = users.map(user => {
        // only the owning user (index 0, default added) can see this, therefore its ensured that removing owner and removing self is not possible. If owner deletes household from dashboard, another user becomes owner (at index 0)
        const isOwningUser = loggedInUserId == user.id;
        const removeButton = (
            <Tooltip title={t('generic.remove')} placement="left">
                <Button size="small" type="text" icon={<CloseOutlined/>} onClick={() => removeUser(user.id)}/>
            </Tooltip>
        );
        const ownerUser = (
            <span></span>
        )
        return (
            <div className="flex items-center gap-1">
                {!isOwningUser && removeButton}
                <span>{user.username}</span>
                {isOwningUser && `(${t("user.owner")})`}
            </div>
        )
    });

    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [removeError, setRemoveError] = useState("");
    return (
        <>
            <Row gutter={24}>
                {/* Left column: Member list */}
                <Col xs={24} md={12}>
                    <Title level={2}>{t('household.memberList')}</Title>
                    {userList}
                    {removeError && <Text type="danger">{removeError}</Text>}
                </Col>

                {/* Right column: Add user */}
                <Col xs={24} md={12}>
                    <Title level={2}>{t('household.addUser')}</Title>
                    <Space>
                        <Input
                            type="text"
                            placeholder={t('household.placeholder.email')}
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                        <Button
                            type="primary"
                            icon={<PlusCircleOutlined/>}
                            onClick={() => addUserToHousehold()}
                        >
                            {t('household.addUserButton')}
                        </Button>
                    </Space>
                    {error && <Text type="danger">{error}</Text>}
                </Col>
            </Row>

        </>
    )
}