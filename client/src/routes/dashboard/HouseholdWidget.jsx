import { useTranslation } from "react-i18next";
import { Card, Typography, Button, Space } from 'antd';

function HouseholdWidget({houseHoldName, houseHoldID, memberCount, onClick, onDelete}) {
    
    const { t } = useTranslation();
    const { Title, Text } = Typography;

    return (
        <Card hoverable style={{  marginBottom: 16 }}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                {/* Household Name */}
                <Title level={4} style={{ margin: 0 }}>
                    {houseHoldName}
                </Title>

                {/* Member count */}
                <Text type="secondary">
                    ({t('dashboard.householdMembers')}: {memberCount})
                </Text>

                {/* Buttons */}
                <Space>
                    <Button type="primary" onClick={() => onClick(houseHoldID)}>
                        {t('dashboard.householdOpen')}
                    </Button>
                    <Button type="dashed" danger onClick={() => onDelete(houseHoldID)}>
                        {t('dashboard.householdDelete')}
                    </Button>
                </Space>
            </Space>
        </Card>
    );
}

export default HouseholdWidget;