import React from "react";
import { useTranslation } from "react-i18next";
import { Space, Spin, Typography } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const { Text } = Typography;
const LoadingSpinner = ({ text, size = "large", style = {} }) => {
    const { t } = useTranslation();

    return (
        <Space
            direction="vertical"
            size="large"
            style={{
                width: "100%",
                textAlign: "center",
                marginTop: 50,
                ...style,
            }}
        >
            <Spin indicator={<LoadingOutlined spin />} size={size} />
            <Text>{text || t("generic.loading")}</Text>

        </Space>
    );
};

export default LoadingSpinner;
