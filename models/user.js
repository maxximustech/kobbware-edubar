const path = require("path");
const fs = require("fs");
const db = require('../utils/db');

const validate = data => {
    if(typeof data.user === 'undefined' || typeof data.pass === 'undefined'){
        throw new Error('User information not valid!');
    }
    if(data.user.length < 3){
        throw new Error('Username less than 3 characters!');
    }
    if(data.pass.length < 5){
        throw new Error('Password less than 5 characters!');
    }
    return true;
}

const readFile = ()=>{
    return JSON.parse(fs.readFileSync(path.join(__dirname,'../','data.json')));
}

module.exports = class User{
    constructor(username, password){
        this.user = username;
        this.pass = password;
    }
    async save(){
        validate({
            user: this.user,
            pass: this.pass
        });
        let query = await db.execute('SELECT * FROM users WHERE name = ?',[this.user]);
        let users = query[0];
        if(users.length > 0){
            throw new Error('User already exists');
        }
        await db.execute('INSERT INTO users (name,pass) VALUES (?,?)',[this.user,this.pass]);
        return true;
    }
    static async fetchAll(){
         let query = await db.execute('SELECT * FROM users');
         return query[0];
    }
    static async fetchById(id){
        let query = await db.execute("SELECT * FROM users WHERE id = ?",[id]);
        let users = query[0];
        if(users.length <= 0){
            throw new Error('User with the ID does not exist');
        }
        return users[0];
    }
    async verify(){
        validate({
            user: this.user,
            pass: this.pass
        });
        let query = await db.execute('SELECT * FROM users WHERE name = ?', [this.user]);
        let users = query[0];
        if(users.length <= 0){
            throw new Error('Username does not exist!');
        }
        let user = users[0];
        if(user.pass !== this.pass.toString()){
            throw new Error('Password is incorrect!');
        }
        return true;
    }
    static async deleteOne(id){
        let query = await db.execute("DELETE FROM users WHERE id = ?", [id]);
        return true;
    }
    static async update(user){
        validate({
            user: user.name,
            pass: user.pass
        });
        let query = await db.execute("SELECT * FROM users WHERE id = ?", [user.id]);
        let users = query[0];
        if(users.length <= 0){
            throw new Error('User does not exist');
        }
        query = await db.execute('SELECT * FROM users WHERE name = ? AND id != ?',[user.name, user.id]);
        users = query[0];
        if(users.length > 0){
            throw new Error('Username already exists!');
        }
        let update = await db.execute('UPDATE users SET name = ?, pass = ? WHERE id = ?',[user.name, user.pass, user.id]);
        return true;
    }
}