import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom"

import { HouseHoldTask } from "../../models/HouseHoldModel";
import ChoreInput from "../../components/ChoreInput";
import { useState, useEffect, useRef } from "react";
import ChoreItem from "../../components/ChoreItem";
import api from "../../services/api";
import UserModel from "../../models/UserModel";
import AddPeopleInput from "../../components/HouseholdUsers";

function HouseHold() {

  const HOUSEHOLD_API = '/household';
  const AUTH_API = '/getUser';
  const USER_API = '/user';

  const navigate = useNavigate();

  const { id } = useParams();
  const { t } = useTranslation();

  // const [originalChores, setOriginalChores] = useState([]);

  const [householdChores, setHouseholdChores] = useState([]);
  const [user, setUser] = useState(null);
  const [userModel, setUserModel] = useState(null);
  const [houseHold, setHousehold] = useState(null);
  const [householdUsers, setHouseholdUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [changesMade, setChangesMade] = useState(false);

  const [editingHouseholdName, setEditingHouseholdName] = useState(false);
  const [householdName, setHouseholdName] = useState("");
  const [newHouseholdName, setNewHouseholdName] = useState("");
  const houseHoldNameInput = useRef(null);

  async function reloadData() {
    setLoading(true);
    await loadData();
    // setLoading(false); // if an error happens, the page should not show
  }

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
      setHouseholdName(response.data.householdName);
      setNewHouseholdName(response.data.householdName);
      
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

  useEffect(() => {
      reloadData();
  }, []); //idk why it throws a warning, i just wanna run it once on mount

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

     setChangesMade(true);
  }

  function updateTask(newItem) {
    setHouseholdChores(householdChores.map(item => item.key === newItem.key ? newItem : item ));

    setChangesMade(true);
  }
  
  function deleteTask(itemToDelete) {
    setHouseholdChores(householdChores.filter(item => item.key !== itemToDelete.key));

    setChangesMade(true);
  }

  useEffect(() => {
      if(editingHouseholdName) {
        houseHoldNameInput.current?.focus();
        setNewHouseholdName(householdName);
      }
  }, [editingHouseholdName]); // why are you warning me??? its the dependency i want

  async function saveHouseholdName() {
    setEditingHouseholdName(false);

    const trimmedNewName = newHouseholdName.trim();
    if(trimmedNewName.length <= 0) {
      // empty name, revert
      setNewHouseholdName(householdName);
      return;
    }

    setHouseholdName(trimmedNewName);

     try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await api.put(`${HOUSEHOLD_API}/${id}`, {householdName: trimmedNewName}, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      console.log(response.data);
    } catch(error) {
      console.log(error);
    }
  }

  async function persistChanges() {
    try {
      const accessToken = localStorage.getItem("accessToken");
      // const householdModel = new HouseHoldModel(houseHold.householdName, householdChores, houseHold.members);
      const response = await api.put(`${HOUSEHOLD_API}/${id}`, {tasks: householdChores}, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      console.log(response.data);
      setChangesMade(false);
    } catch(error) {
      console.log(error);
    }
  }

  async function onUserAdded(userId) {
    console.log(userId);
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await api.put(`${HOUSEHOLD_API}/${id}`, { members: [...houseHold.members, userId.toString()]}, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      console.log(response.data);
      await reloadData();
    } catch(error) {
      console.log(error);
    }
  }

  async function onUserRemoved(userId) {
    console.log(userId);
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await api.put(`${HOUSEHOLD_API}/${id}`, { members: houseHold.members.filter(id => id != userId)}, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      console.log(response.data);
      await reloadData();
    } catch(error) {
      console.log(error);
    }
  }

  const changesPanel = (
    <div>
      <p>{t('household.changeInfo')}</p>
      <div className="flex flex-row gap-2">
        <button onClick={() => persistChanges()}>{t('household.saveChanges')}</button>
        <button onClick={() => reloadData()}>{t('household.discardChanges')}</button>
      </div>
    </div>
  );

  const tableContent = householdChores.map(task => 
    (<ChoreItem taskItem={task} userList={householdUsers} onUpdate={item => updateTask(item)} onDelete={item => deleteTask(item)} key={task.key}/>)
  );

  function isHouseHoldOwner() {
    return user._id.toString() == houseHold.members[0].toString();
  }


  // YOU CAN MAKE YOUR CUSTOM LOADING SCREEN HERE (BE CAREFUL WITH MOVING AS USER(S)? MAY BE NULL ON INITIAL MOUNT)
  if(loading) {
    return (<p>{t('generic.loading')}</p>)
  }

  const userMap = houseHold.members.map((u_id, index) => {
    return { id: u_id.toString(), username: householdUsers[index]}
  });

  const householdNameInput = 
  (<>
    <input type="text" value={newHouseholdName} onInput={e => setNewHouseholdName(e.target.value)} onBlur={() => saveHouseholdName()} ref={houseHoldNameInput} />
  </>);

  const householdNameTitle = 
  (<div className="flex flex-row gap-2">
    <h1>{householdName}</h1>
    {/* button again has no translation as it may be replaced by icon? if not, sowwy :( */}
    {isHouseHoldOwner() && (<button onClick={() => setEditingHouseholdName(true)}>Edit</button>)}
  </div>);

  const householdHeader = editingHouseholdName ? householdNameInput : householdNameTitle;

  return (
    <>
      {householdHeader}

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

      {changesMade && changesPanel}

      <br></br>

      <ChoreInput onSubmit={addTask} userList={householdUsers} />

      {isHouseHoldOwner() && <AddPeopleInput 
        onUserAdded={onUserAdded} 
        onUserDeleted={onUserRemoved}
        userIdList={houseHold.members} 
        hasUnsavedChanges={changesMade} 
        users={userMap} 
        loggedInUserId={user._id.toString()} 
      />}

    </>

  )
}

export default HouseHold
