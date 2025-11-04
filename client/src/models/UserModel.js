// TODO create model for User, please modify as needed for lesson

export default class UserModel {
    constructor(username, households) {
        this.username = username; // string
        this.households = households; // array of ids of assigned households
    }
}