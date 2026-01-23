import { useTranslation } from "react-i18next"
import HouseholdWidget from "./HouseholdWidget";
import { useEffect, useState } from "react";
import HouseHold from "../household/Household";
import { HouseHoldModel } from "../../models/HouseHoldModel";
import api from "../../services/api";
import UserModel from "../../models/UserModel";
import { useNavigate } from "react-router-dom";
  import { Row, Col, Form, Input, Button, Typography, Alert } from "antd";
  import LoadingSpinner from "../../components/LoadingSpinner.jsx";

const { Title, Text } = Typography;

function Dashboard() {

  const HOUSEHOLD_API = '/household';
  const USER_API = '/user';
  const AUTH_API = '/getUser';

  const { t } = useTranslation();

  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [userModel, setUserModel] = useState(null);

  const [households, setHouseholds] = useState([]);

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

    const [form] = Form.useForm();

  useEffect(() => {
      async function loadUserData() {

        // USER
        try {
          console.log("Token:", localStorage.getItem('accessToken'));

          const accessToken = localStorage.getItem("accessToken");
          const response = await api.get(AUTH_API, {
            headers: { Authorization: `Bearer ${accessToken}` }
          });
          console.log("Response:");
          console.log(response);
          console.log("Data:");
          console.log(response.data);
          
          setUser(response.data);
          setUserModel(new UserModel(response.data._id, response.data.first_name, response.data.last_name, response.data.permissions));
        } catch(err) {
          console.log(err);
        }

        // HOUSEHOLDS
        try {
          const accessToken = localStorage.getItem("accessToken");
          const response = await api.get(`${HOUSEHOLD_API}/from_user`, {
            headers: { Authorization: `Bearer ${accessToken}` }
          });
          console.log(response.data);
          setHouseholds([...response.data]);
        } catch(error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      }

      loadUserData();
  }, []);

  async function createNewHousehold(values) {
    setError("");

    const currentName = values.householdName?.trim();
    if(currentName.length <= 0) {
      setError(t('dashboard.error.householdNameEmpty'));
      return;
    }

    const newHousehold = new HouseHoldModel(currentName, [], [user?._id.toString()]);
    
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await api.post(HOUSEHOLD_API, newHousehold, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      setHouseholds([...households, response.data]);
      form.resetFields();
      console.log(response);
    } catch(err) {
      console.log(err);
      setError(t("dashboard.error.creatingHousehold"));
    }
  }

  async function deleteHouseholdFromUser(household_id) {
    console.log(`Deleted household: ${household_id}`);

    if (!user?._id) return;

    const accessToken = localStorage.getItem("accessToken");
    try {
      const household = households.find(h => h._id === household_id);
      if (!household) return;

      const updatedMembers = household.members.filter(
        memberId => memberId !== user._id.toString()
      );

      const response = await api.put(`${HOUSEHOLD_API}/${household_id}`, {
        members: updatedMembers
      }, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      console.log("Updated household:", response.data);

      setHouseholds(prev =>
        prev.filter(h => h._id !== household_id)
      );

    } catch (err) {
      console.error("Failed to remove household:", err);
    }
  }
  function openHousehold(household_id) {
    console.log(`Clicked household: ${household_id}`);
    navigate(`/household/${household_id.toString()}`);
  }

  const householdList = (<>
    {households.map(household => 
      (<HouseholdWidget 
        houseHoldID={household._id} 
        houseHoldName={household.householdName} 
        memberCount={household.members.length}
        onDelete={() => deleteHouseholdFromUser(household._id)}
        onClick={() => openHousehold(household._id)}
     />))}
  </>);

  if(loading) {
    return <LoadingSpinner />
  }
  

  return (
    <div style={{ padding: "2rem" }}>
      <Title level={1} style={{ textAlign: "center" }}>
        {t("dashboard.title")}
      </Title>
      <Title level={3} style={{ textAlign: "center" }}>
        {t("dashboard.welcomeBack")} {userModel?.fullName}!
      </Title>

      {error && <Alert type="error" message={error} style={{ marginBottom: 20 }} />}

      <Row gutter={32} justify="space-around">
        <Col xs={24} md={10}>
          <Title level={4}>{t("dashboard.myHouseholds")}</Title>
          {households.map((household) => (
            <HouseholdWidget
              key={household._id}
              houseHoldID={household._id}
              houseHoldName={household.householdName}
              memberCount={household.members.length}
              onDelete={() => deleteHouseholdFromUser(household._id)}
              onClick={() => openHousehold(household._id)}
            />
          ))}
        </Col>

        <Col xs={24} md={10}>
          <Title level={4}>{t("dashboard.createHousehold")}</Title>

          <Form form={form} layout="vertical" onFinish={createNewHousehold}>
            <Form.Item
              name="householdName"
              rules={[
                { required: true, message: t("dashboard.error.householdNameEmpty") },
                { max: 20, message: t("dashboard.error.householdNameTooLong") },
              ]}
            >
              <Input placeholder={t("dashboard.householdNamePlaceholder")} />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                {t("dashboard.createHouseholdButton")}
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard
