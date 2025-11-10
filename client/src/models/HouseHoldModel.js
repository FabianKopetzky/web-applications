// TODO create model for HouseHold

class HouseHoldModel {
    constructor(householdName, tasks) {
        this.householdName = householdName; // string
        this.tasks = tasks; // array of HouseHoldTask[]
    }
}

class HouseHoldTask {
    constructor(taskName, description, interval, lastDoneDate, assignedUser, key) {
        this.taskName = taskName; // string
        this.description = description; // string
        this.interval = interval; // int, in days
        this.lastDoneDate = lastDoneDate; // date string
        this.assignedUser = assignedUser; // id of the user
        this.key = key // random key to identify item
    }
}

export { HouseHoldModel, HouseHoldTask }