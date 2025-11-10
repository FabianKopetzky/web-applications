import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom"

import { HouseHoldModel, HouseHoldTask } from "../../models/HouseHoldModel";
import ChoreInput from "../../components/ChoreInput";
import { useState } from "react";
import ChoreItem from "../../components/ChoreItem";
import api from "../../services/api";

function HouseHold() {

  const HOUSEHOLD_API = '/household';

  const { id } = useParams();
  const { t } = useTranslation();

  const [householdChores, setHouseholdChores] = useState([]);

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
    (<ChoreItem taskItem={task} onUpdate={item => updateTask(item)} onDelete={item => deleteTask(item)} key={task.key}/>)
  );

  async function sendToDb() {
    try {
      const response = await api.post(HOUSEHOLD_API, new HouseHoldModel("My household name", householdChores));
      console.log(response);
    } catch(err) {
      console.log(err);
    }
  }

  return (
    <>
      <h1>{ t('household.title') } { id }</h1>

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

      <ChoreInput onSubmit={addTask} />

       <button onClick={() => sendToDb()}>Debug send</button>
    </>

  )
}

export default HouseHold
