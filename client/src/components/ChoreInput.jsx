import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Form, Input, InputNumber, DatePicker, Select, Button, Typography,  Card, Space, Alert  } from "antd";
import dayjs from "dayjs";
import { PlusCircleOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

export default function ChoreInput({onSubmit, userList}) {

    const { t } = useTranslation();
    const [form] = Form.useForm();
    
    // const [taskName, setTaskName] = useState('');
    // const [taskDescription, setTaskDescription] = useState('');
    // const [interval, setInterval] = useState(1);
    // const [lastDoneDate, setLastDoneDate] = useState('');
    // const [assignedUser, setAssignedUser] = useState(userList[0]);

    const [errors, setErrors] = useState([]);

      function handleFinish(values) {
    const today = dayjs().format("YYYY-MM-DD");

    const validatedLastDone =
      !values.lastDone || values.lastDone.isAfter(dayjs())
        ? today
        : values.lastDone.format("YYYY-MM-DD");

    onSubmit(
      values.taskName,
      values.taskDescription || "",
      values.interval,
      validatedLastDone,
      values.assignedUser
    );

    form.resetFields();
  }


    // const errorList = (<ul>
    //   {errors.map(err => (<li>{err}</li>))}
    // </ul>);

    // const userOptions = userList.map(user => (<option value={user}>{user}</option>));

    return (
        <Card
            title={<Title level={4} style={{ margin: 0 }}>{t("household.addChore")}</Title>}
            style={{ maxWidth: 400, margin: "0 0", boxShadow: "0 4px 8px rgba(0,0,0,0.05)" }}

        >
            {errors.length > 0 && (
                <Alert
                    type="error"
                    message={t("household.error.general")}
                    description={
                        <ul style={{ margin: 0, paddingLeft: "20px" }}>
                            {errors.map((err, idx) => (<li key={idx}>{err}</li>))}
                        </ul>
                    }
                    style={{ marginBottom: 16 }}
                />
            )}

            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                initialValues={{
                    interval: 1,
                    assignedUser: userList?.[0],
                }}
            >
                <Form.Item
                    name="taskName"
                    label={t("household.task")}
                    rules={[{ required: true, message: t("household.error.taskName") }]}
                >
                    <Input placeholder={t("household.placeholder.task")} />
                </Form.Item>

                <Form.Item
                    name="taskDescription"
                    label={`${t("household.description")} (${t("generic.optional")})`}
                >
                    <Input placeholder={t("household.placeholder.description")} />
                </Form.Item>

                <Form.Item
                    name="interval"
                    label={t("household.interval")}
                    rules={[
                        { required: true },
                        { type: "number", min: 1, message: t("household.error.interval") },
                    ]}
                >
                    <InputNumber min={1} style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                    name="lastDone"
                    label={t("household.lastDone")}
                >
                    <DatePicker style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                    name="assignedUser"
                    label={t("household.assignedTo")}
                    rules={[{ required: true, message: t("household.error.assignedUser") }]}
                >
                    <Select>
                        {userList.map((user) => (
                            <Option key={user} value={user}>{user}</Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" icon={<PlusCircleOutlined />} htmlType="submit" block>
                        {t("household.addTask")}
                    </Button>
                </Form.Item>
            </Form>
        </Card>)
}