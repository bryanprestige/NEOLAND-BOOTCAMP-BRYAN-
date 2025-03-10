// @ts-check

export class User {
    _id
    email
    name
    nickname
    rol
    password
    bio
    followedBy
    teamAcademy
    /**
     * 
     * @param {string} _id 
     * @param {string} email 
     * @param {string} nickname 
     * @param {string} name
     * @param {string} rol 
     * @param {string} password 
     * @param {string} bio 
     * @param {Array<string>} followedBy
     * @param {string} teamAcademy
     */
    constructor(_id,email, nickname, name, rol, password,bio,followedBy,teamAcademy) {
        this._id = _id
        this.email = email
        this.nickname = nickname
        this.name = name
        this.rol = rol
        this.password = password
        this.bio = bio
        this.followedBy = followedBy
        this.teamAcademy = teamAcademy
    }
}