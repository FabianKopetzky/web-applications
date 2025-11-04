// TODO create model for HouseHold

class HouseHoldModel {
    constructor(householdName, tasks) {
        this.householdName = householdName; // string
        this.tasks = tasks; // array of HouseHoldTask[]
    }
}

class HouseHoldTask {
    constructor(taskName, interval, lastDoneDate, assignedUser) {
        this.taskName = taskName; // string
        this.interval = interval; // int, in days
        this.lastDoneDate = lastDoneDate; // date string
        this.assignedUser = assignedUser; // id of the user
    }
}

export { HouseHoldModel, HouseHoldTask }