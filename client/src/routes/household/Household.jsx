import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom"

import { HouseHoldModel, HouseHoldTask } from "../../models/HouseHoldModel";
import ChoreInput from "../../components/ChoreInput";
import { useState, useEffect } from "react";
import ChoreItem from "../../components/ChoreItem";
import api from "../../services/api";
import UserModel from "../../models/UserModel";

function HouseHold() {

  const HOUSEHOLD_API = '/household';
  const AUTH_API = '/getUser';
  const USER_API = '/user';

  const navigate = useNavigate();

  const { id } = useParams();
  const { t } = useTranslation();

  const [householdChores, setHouseholdChores] = useState([]);
  const [user, setUser] = useState(null);
  const [userModel, setUserModel] = useState(null);
  const [houseHold, setHousehold] = useState(null);
  const [householdUsers, setHouseholdUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
      async function loadData() {

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

        // HOUSEHOLD
        try {
          const accessToken = localStorage.getItem("accessToken");
          const response = await api.get(`${HOUSEHOLD_API}/${id}`, {
            headers: { Authorization: `Bearer ${accessToken}` }
          });
          console.log(response.data);
          setHousehold(response.data);
          setHouseholdChores(response.data.tasks);
          
          // USER NAMES
          const memberIds = response.data.members;

          const userPromises = memberIds.map(u_id =>
            api.get(`${USER_API}/${u_id}`, {
              headers: { Authorization: `Bearer ${accessToken}` }
            })
          );

          const usersResponses = await Promise.all(userPromises);
          const userNames = usersResponses.map(res => `${res.data.first_name} ${res.data.last_name}`);
          setHouseholdUsers(userNames);

          console.log(userNames);

        } catch(error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      }

      loadData();
  }, [id]);

  function generateKey(taskName, taskDesc) {
    return new Date()
      .toLocaleString()
      .trim()
      .replace(/[,.:/\\ ]/g, '')
       + (Math.floor(Math.random() * 1000))
       + taskName.substring(0, Math.min(4, taskName.length))
        + taskDesc.substring(0, Math.min(4, taskDesc.length))
  }

  function addTask(taskName, taskDescription, interval, lastDoneDate, assignedUser) {
    const newChore = new HouseHoldTask(taskName, taskDescription, interval, lastDoneDate, assignedUser, generateKey(taskName, taskDescription));
     setHouseholdChores([...householdChores, newChore]);
  }

  function updateTask(newItem) {
    setHouseholdChores(householdChores.map(item => item.key === newItem.key ? newItem : item ));
  }
  
  function deleteTask(itemToDelete) {
    setHouseholdChores(householdChores.filter(item => item.key !== itemToDelete.key));
  }


  const tableContent = householdChores.map(task => 
    (<ChoreItem taskItem={task} userList={householdUsers} onUpdate={item => updateTask(item)} onDelete={item => deleteTask(item)} key={task.key}/>)
  );

  // async function sendToDb() {
  //   try {
  //     const response = await api.post(HOUSEHOLD_API, new HouseHoldModel("My household name", householdChores));
  //     console.log(response);
  //   } catch(err) {
  //     console.log(err);
  //   }
  // }

  // YOU CAN MAKE YOUR CUSTOM LOADING SCREEN HERE
  if(loading) {
    return (<p>{t('generic.loading')}</p>)
  }

  return (
    <>
      <h1>{ t('household.title') } { houseHold?.householdName }</h1>

      <h2>{t('household.loggedInAs')} {userModel?.fullName}</h2>

      {/* No translation because it will most likely be replaced with icon? if not, sorry  */}
      <button onClick={() => navigate("/dashboard")}>Dashboard</button>

      <h2> {t('household.choreTitle')} </h2>
      <table>
        <thead>
          <tr>
            <th>{ t('household.task') }</th>
            <th>{ t('household.description') }</th>
            <th>{ t('household.interval') }</th>
            <th>{ t('household.lastDone') }</th>
            <th>{ t('household.assignedTo') }</th>
            <th>{ t('household.actions') }</th>
            <th>{ t('household.status') }</th>
            {/* <th>Key (remove later)</th> */}
          </tr>
        </thead>
        <tbody>
          {tableContent}
        </tbody>
      </table>

      <br></br>

      <ChoreInput onSubmit={addTask} userList={householdUsers} />

       {/* <button onClick={() => sendToDb()}>Debug send</button> */}
    </>

  )
}

export default HouseHold
