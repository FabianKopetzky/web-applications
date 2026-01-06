import { useState, useEffect, useRef } from "react";
import { HouseHoldTask } from "../models/HouseHoldModel";
import { useTranslation } from "react-i18next";

export default function ChoreItem({taskItem, userList, onUpdate, onDelete}) {

  const { t } = useTranslation();

  const [editingTaskName, setEditingTaskName] = useState(false);
  const [editingTaskDescription, setEditingTaskDescription] = useState(false);
  const [editingInterval, setEditingInterval] = useState(false);
  const [editingLastDone, setEditingLastDone] = useState(false);
  const [editingAssignedUser, setEditingAssignedUser] = useState(false);

  const [newTaskName, setNewTaskName] = useState(taskItem.taskName);
  const [newTaskDescription, setNewTaskDescription] = useState(taskItem.description);
  const [newInterval, setNewInterval] = useState(taskItem.interval);
  const [newLastDone, setNewLastDone] = useState(taskItem.lastDoneDate);
  const [newAssignedUser, setNewAssignedUser] = useState(taskItem.assignedUser);

  const taskNameRef = useRef(null);
  const taskDescriptionRef = useRef(null);
  const intervalRef = useRef(null);
  const lastDoneRef = useRef(null);
  const assignedUserRef = useRef(null);

  useEffect(() => {
    if (editingTaskName) taskNameRef.current?.focus();
  }, [editingTaskName]);

  useEffect(() => {
    if (editingTaskDescription) taskDescriptionRef.current?.focus();
  }, [editingTaskDescription]);

  useEffect(() => {
    if (editingInterval) intervalRef.current?.focus();
  }, [editingInterval]);

  useEffect(() => {
    if (editingLastDone) lastDoneRef.current?.focus();
  }, [editingLastDone]);

  useEffect(() => {
    if (editingAssignedUser) assignedUserRef.current?.focus();
  }, [editingAssignedUser]);

  function updateField() {
    // Required
    const validatedTaskName = newTaskName.trim().length === 0 ? taskItem.taskName : newTaskName.trim();

    // Optional
    const validatedTaskDescription = newTaskDescription.trim();

    // At least 1
    const validatedInterval = newInterval <= 0 ? 1 : newInterval;

    // Required, valid, not in future
    const today = new Date().toISOString().split("T")[0];
    const lastDoneDateObj = new Date(newLastDone);
    const validatedLastDone = (!newLastDone || isNaN(lastDoneDateObj.getTime()) || lastDoneDateObj > new Date()) 
      ? today 
      : newLastDone;

    // Required, should contain ID from mongodb (should come from the dropdown that is built using that)
    const validatedAssignedUser = newAssignedUser.length === 0 ? taskItem.assignedUser : newAssignedUser;

    onUpdate(new HouseHoldTask(
      validatedTaskName,
      validatedTaskDescription,
      validatedInterval,
      validatedLastDone,
      validatedAssignedUser,
      taskItem.key
    ));

    setNewTaskName(validatedTaskName);
    setNewTaskDescription(validatedTaskDescription);
    setNewInterval(validatedInterval);
    setNewLastDone(validatedLastDone);
    setNewAssignedUser(validatedAssignedUser);

    setEditingTaskName(false);
    setEditingTaskDescription(false);
    setEditingInterval(false);
    setEditingLastDone(false);
    setEditingAssignedUser(false);
  }

  function getDueDate() {
    if (!taskItem.lastDoneDate || !taskItem.interval) return "-";

    let date = new Date(taskItem.lastDoneDate);
    date.setDate(date.getDate() + Number(taskItem.interval));
    return date.toISOString().split("T")[0]; 
  }

  function markAsDone() {
    const today = new Date().toISOString().split("T")[0];

    onUpdate(new HouseHoldTask(
      taskItem.taskName,
      taskItem.description,
      taskItem.interval,
      today,
      taskItem.assignedUser,
      taskItem.key
    ));

    setNewLastDone(today);
  }

  const userOptions = userList.map(user => (<option value={user}>{user}</option>));

  return (
    <tr key={taskItem.key}>
      <td>
        <span className={editingTaskName ? 'hidden' : ''}>{ taskItem.taskName }</span>
        <input ref={taskNameRef} className={editingTaskName ? '' : 'hidden'} value={newTaskName} onChange={e => setNewTaskName(e.target.value)} onBlur={() => updateField()}></input>
        <button onClick={() => setEditingTaskName(true)}>{ t('household.edit') }</button>
      </td>
      <td>
        <span className={editingTaskDescription ? 'hidden' : ''}>{ taskItem.description }</span>
        <input ref={taskDescriptionRef} className={editingTaskDescription ? '' : 'hidden'} value={newTaskDescription} onChange={e => setNewTaskDescription(e.target.value)} onBlur={() => updateField()}></input>
        <button onClick={() => setEditingTaskDescription(true)}>{ t('household.edit') }</button>
      </td>
      <td>
        <span className={editingInterval ? 'hidden' : ''}>{ taskItem.interval }</span>
        <input ref={intervalRef} className={editingInterval ? '' : 'hidden'} min={1} value={newInterval} onChange={e => setNewInterval(e.target.value)} type="number" onBlur={() => updateField()}></input>
        <button onClick={() => setEditingInterval(true)}>{ t('household.edit') }</button>
      </td>
      <td>
        <span className={editingLastDone ? 'hidden' : ''}>{ taskItem.lastDoneDate }</span>
        <input ref={lastDoneRef} className={editingLastDone ? '' : 'hidden'} value={newLastDone} onChange={e => setNewLastDone(e.target.value)} type="date" onBlur={() => updateField()}></input>
        <button onClick={() => setEditingLastDone(true)}>{ t('household.edit') }</button>
      </td>
      <td>
        <span className={editingAssignedUser ? 'hidden' : ''}>{ taskItem.assignedUser }</span>
        <select ref={assignedUserRef} className={editingAssignedUser ? '' : 'hidden'} onChange={e => setNewAssignedUser(e.target.value)} value={newAssignedUser} onBlur={() => updateField()}>
          {/* FETCH ACTUAL USERS FROM DB */}
          {userOptions}
        </select>
        <button onClick={() => setEditingAssignedUser(true)}>{ t('household.edit') }</button>
      </td>
      <td>
        <button onClick={() => markAsDone()}>{ t('household.markDone') }</button>
        <button onClick={() => onDelete(taskItem)}>{ t('household.remove') }</button>
      </td>
      <td>
        <span>{getDueDate()}</span>
      </td>
      {/* <td>
        <span>{taskItem.key}</span>
      </td> */}
    </tr>
  );
}