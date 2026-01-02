// TODO create model for User, please modify as needed for lesson

export default class UserModel {
    constructor(id, first_name, last_name, permissions) {
        this.id = id;
        this.first_name = first_name;
        this.last_name = last_name; 
        this.permissions = permissions;
    }

    get fullName() {
        return `${this.first_name} ${this.last_name}`;
    }
}