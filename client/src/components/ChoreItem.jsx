import { useState } from "react";
import { HouseHoldTask } from "../models/HouseHoldModel";

export default function ChoreItem({taskItem, onUpdate, onDelete}) {

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

  function updateField() {

    onUpdate(new HouseHoldTask(newTaskName, newTaskDescription, newInterval, newLastDone, newAssignedUser, taskItem.key));

    setEditingTaskName(false);
    setEditingTaskDescription(false);
    setEditingInterval(false);
    setEditingLastDone(false);
    setEditingAssignedUser(false);
  }

  return (
    <tr key={taskItem.key}>
      <td>
        <span className={editingTaskName ? 'hidden' : ''}>{ taskItem.taskName }</span>
        <input className={editingTaskName ? '' : 'hidden'} value={newTaskName} onChange={e => setNewTaskName(e.target.value)} onBlur={() => updateField()}></input>
        <button onClick={() => setEditingTaskName(true)}>Edit</button>
      </td>
      <td>
        <span className={editingTaskDescription ? 'hidden' : ''}>{ taskItem.description }</span>
        <input className={editingTaskDescription ? '' : 'hidden'} value={newTaskDescription} onChange={e => setNewTaskDescription(e.target.value)} onBlur={() => updateField()}></input>
        <button onClick={() => setEditingTaskDescription(true)}>Edit</button>
      </td>
      <td>
        <span className={editingInterval ? 'hidden' : ''}>{ taskItem.interval }</span>
        <input className={editingInterval ? '' : 'hidden'} value={newInterval} onChange={e => setNewInterval(e.target.value)} type="number" onBlur={() => updateField()}></input>
        <button onClick={() => setEditingInterval(true)}>Edit</button>
      </td>
      <td>
        <span className={editingLastDone ? 'hidden' : ''}>{ taskItem.lastDoneDate }</span>
        <input className={editingLastDone ? '' : 'hidden'} value={newLastDone} onChange={e => setNewLastDone(e.target.value)} type="date" onBlur={() => updateField()}></input>
        <button onClick={() => setEditingLastDone(true)}>Edit</button>
      </td>
      <td>
        <span className={editingAssignedUser ? 'hidden' : ''}>{ taskItem.assignedUser }</span>
        <select className={editingAssignedUser ? '' : 'hidden'} onChange={e => setNewAssignedUser(e.target.value)} value={newAssignedUser} onBlur={() => updateField()}>
          {/* FETCH ACTUAL USERS FROM DB, MAYBE HAVE PRODIVER FOR USERS */}
          <option value="User1">User 1</option>
          <option value="User2">User 2</option>
        </select>
        <button onClick={() => setEditingAssignedUser(true)}>Edit</button>
      </td>
      <td>
        <button>Mark as done</button>
        <button onClick={() => onDelete(taskItem)}>Remove</button>
      </td>
      <td>
        <span>Status</span>
      </td>
      <td>
        <span>{taskItem.key}</span>
      </td>
    </tr>
  );
}