import { useTranslation } from "react-i18next"
import LogoutButton from "../../components/logoutButton";
import HouseholdWidget from "./HouseholdWidget";
import { useState } from "react";
import HouseHold from "../household/Household";
import { HouseHoldModel } from "../../models/HouseHoldModel";
import api from "../../services/api";


function Dashboard() {

  const HOUSEHOLD_API = '/household';
  const AUTH_API = '/auth/getUser';

  const { t } = useTranslation();

  const [newHouseholdName, setNewHouseholdName] = useState('');
  const [error, setError] = useState('');

  async function getCurrentUser() {
    try {
      const response = await api.get(AUTH_API);
      console.log("Response:");
      console.log(response);
      console.log("Data:");
      console.log(response.data);
    } catch(err) {
      console.log(err);
    }
  }

  async function createNewHousehold() {
    setError("");

    const currentName = newHouseholdName.trim();
    if(currentName.length <= 0) {
      setError("Your household's name cannot be empty");
      return;
    }

    console.log("Created");
    const newHousehold = new HouseHoldModel(currentName, []);
    
    try {
      const response = await api.post(HOUSEHOLD_API, newHousehold);
      console.log(response);
    } catch(err) {
      console.log(err);
    }
  }
  

  return (
    <>
        <LogoutButton />
        <h1 className='text-center'>{ t('dashboard.title') }</h1>

        <div className="flex flex-row w-full justify-evenly">
          <div>
            {/* List of households */}
            <h2>My households</h2>
            <HouseholdWidget houseHoldName={"Test 1"} houseHoldID={"dsdfjksdjkf"} />
            <HouseholdWidget houseHoldName={"Test 2"} houseHoldID={"dsdfjksdjkf"} />
            <HouseholdWidget houseHoldName={"Test 3"} houseHoldID={"dsdfjksdjkf"} />
            <HouseholdWidget houseHoldName={"Test 4"} houseHoldID={"dsdfjksdjkf"} />
            
          </div>
          <div>
            {/* create household form */}
            <h2>Create new household: {newHouseholdName}</h2>
            
            <input type="text" maxLength={20} placeholder="New Household Name" value={newHouseholdName} onInput={e => setNewHouseholdName(e.target.value)}></input>
            <button onClick={() => createNewHousehold()}>Create</button>

            <br></br>

            <p>{error}</p>
          </div>
        </div>

        <button onClick={() => getCurrentUser()}>Test user</button>

        {/* <p>{user.firstname}</p> */}
    </>
  )
}

export default Dashboard
