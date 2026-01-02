import { useTranslation } from "react-i18next"
import LogoutButton from "../../components/logoutButton";
import HouseholdWidget from "./HouseholdWidget";
import { useEffect, useState } from "react";
import HouseHold from "../household/Household";
import { HouseHoldModel } from "../../models/HouseHoldModel";
import api from "../../services/api";
import LoggedIn from "../../components/LoggedIn";
import UserModel from "../../models/UserModel";
import { useNavigate } from "react-router-dom";


function Dashboard() {

  const HOUSEHOLD_API = '/household';
  const USER_API = '/user';
  const AUTH_API = '/getUser';

  const { t } = useTranslation();

  const [newHouseholdName, setNewHouseholdName] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [userModel, setUserModel] = useState(null);

  const [households, setHouseholds] = useState([]);

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

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

  async function createNewHousehold() {
    setError("");

    const currentName = newHouseholdName.trim();
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
      console.log(response);
    } catch(err) {
      console.log(err);
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

  // YOU CAN MAKE YOUR CUSTOM LOADING SCREEN HERE
  if(loading) {
    return (<p>{t('generic.loading')}</p>)
  }
  

  return (
    <>
        <LogoutButton />
        <h1 className='text-center'>{ t('dashboard.title') }</h1>

        <h2 className="text-center">{t('dashboard.welcomeBack')} {userModel?.fullName}!</h2>

        <div className="flex flex-row w-full justify-evenly">
          <div>
            {/* List of households */}
            <h2>{t('dashboard.myHouseholds')}</h2>

            {householdList}
            
          </div>
          <div>
            {/* create household form */}
            <h2>{t('dashboard.createHousehold')} {newHouseholdName}</h2>
            
            <input type="text" maxLength={20} placeholder={t('dashboard.householdNamePlaceholder')} value={newHouseholdName} onInput={e => setNewHouseholdName(e.target.value)}></input>
            <button onClick={() => createNewHousehold()}>{t('dashboard.createHouseholdButton')}</button>

            <br></br>

            <p>{error}</p>
          </div>
        </div>

        {/* <button onClick={() => getCurrentUser()}>Test user</button> */}

        {/* <p>{user.firstname}</p> */}
    </>
  )
}

export default Dashboard
