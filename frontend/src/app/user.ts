export class User {
    constructor(
    public username: string,
    public email: string,
    public password: string,
    public password_confirm: string,
    public activationCode:string,
    public dateAdded: string,
    public displayName:string,
    public image:string,
    public isActivated:boolean,
    public role:string,
    public salt:string,
    public userId:string
    ){}
}
