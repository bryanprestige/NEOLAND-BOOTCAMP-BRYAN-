// @ts-check

export class User {
    id
    email
    name
    nickname
    rol
    password
    /**
     * 
     * @param {string} email 
     * @param {string} nickname 
     * @param {string} name
     * @param {string} rol 
     * @param {string} password 
     */
    constructor(email, nickname, name, rol, password) {
        const timestamp = new Date()
        this.id = String(timestamp.getTime())
        this.email = email
        this.nickname = nickname
        this.name = name
        this.rol = rol
        this.password = password
    }
}