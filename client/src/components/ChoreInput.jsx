import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function ChoreInput({onSubmit}) {

    const { t } = useTranslation();
    
    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [interval, setInterval] = useState(1);
    const [lastDoneDate, setLastDoneDate] = useState('');
    const [assignedUser, setAssignedUser] = useState('User1');

    const [errors, setErrors] = useState([]);

    function submitChore() {
      let formErrors = [];
      // Required
      if(taskName.trim().length === 0) formErrors.push(t('household.error.taskName'));

      // At least 1
      if(interval <= 0) formErrors.push(t('household.error.interval'));

      // Required, valid, not in future
      const today = new Date().toISOString().split("T")[0];
      const lastDoneDateObj = new Date(lastDoneDate);
      const validatedLastDone = (!lastDoneDate || isNaN(lastDoneDateObj.getTime()) || lastDoneDateObj > new Date()) 
        ? today 
        : lastDoneDate;

      // Required, should contain ID from mongodb (should come from the dropdown that is built using that)
      if(assignedUser.length === 0) formErrors.push(t('household.error.assignedUser'));

      setErrors(formErrors);

      if(formErrors.length > 0) return;

      onSubmit(taskName, taskDescription, interval, validatedLastDone, assignedUser);

      setTaskName("");
      setTaskDescription("");
      setInterval(1);
      setLastDoneDate("");
      setAssignedUser('User1');
    }

    const errorList = (<ul>
      {errors.map(err => (<li>{err}</li>))}
    </ul>);

    return (
        <div> 
        <h2>{ t('household.addChore') }</h2>
        <div>
          <label>{ t('household.task') }</label>
          <input onChange={e => setTaskName(e.target.value)} placeholder={t('household.placeholder.task')} value={taskName}></input>
        </div>
        <div>
          <label>{ t('household.description') } { t('generic.optional') }</label>
          <input onChange={e => setTaskDescription(e.target.value)} placeholder={t('household.placeholder.description')} value={taskDescription}></input>
        </div>
        <div>
          <label>{ t('household.interval') }</label>
          <input onChange={e => setInterval(e.target.value)} type="number" min={1} value={interval}></input>
        </div>
        <div>
          <label>{ t('household.lastDone') }</label>
          <input onChange={e => setLastDoneDate(e.target.value)} type="date" value={lastDoneDate}></input>
        </div>
        <div>
          <label>{ t('household.assignedTo') }</label>
          <select onChange={e => setAssignedUser(e.target.value)} value={assignedUser}>
            <option value="User1">User 1</option>
            <option value="User2">User 2</option>
          </select>
        </div>

        <button onClick={() => submitChore()}>Add chore</button>

        {errors.length > 0 && errorList}
      </div>
    );
}