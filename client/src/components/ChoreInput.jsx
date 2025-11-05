import { useState } from "react";

export default function ChoreInput({onSubmit}) {
    
    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [interval, setInterval] = useState(1);
    const [lastDoneDate, setLastDoneDate] = useState('');
    const [assignedUser, setAssignedUser] = useState('User1');

    function submitChore() {
        if(taskName.length <= 0) return;
        if(taskDescription.length <= 0) return;

        onSubmit(taskName, taskDescription, interval, lastDoneDate, assignedUser);
    }

    return (
        <div>
        <h2>Add new chore</h2>
        <div>
          <label>Task name</label>
          <input onChange={e => setTaskName(e.target.value)} placeholder="Task name" value={taskName}></input>
        </div>
        <div>
          <label>Task description</label>
          <input onChange={e => setTaskDescription(e.target.value)} placeholder="Task desc" value={taskDescription}></input>
        </div>
        <div>
          <label>Interval</label>
          <input onChange={e => setInterval(e.target.value)} type="number" value={interval}></input>
        </div>
        <div>
          <label>Last Done</label>
          <input onChange={e => setLastDoneDate(e.target.value)} type="date" value={lastDoneDate}></input>
        </div>
        <div>
          <label>Assigned user</label>
          <select onChange={e => setAssignedUser(e.target.value)} value={assignedUser}>
            <option value="User1">User 1</option>
            <option value="User2">User 2</option>
          </select>
        </div>

        <button onClick={() => submitChore()}>Add chore</button>
      </div>
    );
}