const path = require("path");
const fs = require("fs");
const db = require('../utils/db');

const readFile = ()=>{
    return JSON.parse(fs.readFileSync(path.join(__dirname,'../','data.json')));
}

module.exports = class User{
    constructor(username, password){
        this.user = username;
        this.pass = password;
    }
    async save(){
        if(this.user.length < 3){
            throw new Error('Username less than 3 characters!');
        }
        if(this.pass.length < 5){
            throw new Error('Password less than 5 characters!');
        }
        let query = await db.execute('SELECT * FROM users WHERE name = ?',[this.user]);
        let users = query[0];
        if(users.length > 0){
            console.log('err');
            throw new Error('User already exists');
        }
        await db.execute('INSERT INTO users (name,pass) VALUES (?,?)',[this.user,this.pass]);
        return true;
    }
    static async fetchAll(){
         let query = await db.execute('SELECT * FROM users');
         return query[0];
    }
    static fetchByUsername(username){
        let users = readFile();
        return users.find(u => {
            return u.username.toLowerCase() === username;
        });
    }
    verify(){
        let users = readFile();
        let user = users.find(u => {
            return u.username.toLowerCase() === this.user.toLowerCase();
        });
        if(typeof(user) === 'undefined'){
            throw new Error('Username does not exist!');
        }
        if(user.pass.toString() !== this.pass.toString()){
            throw new Error('Password is incorrect!');
        }
        return true;
    }
    static deleteOne(username){
        let users = readFile();
        // .findIndex is used to return the index number of the item that matches the condition
        let index = users.findIndex(u => {
            return u.username.toLowerCase() === username.toLowerCase();
        });
        users.splice(index,1);
        fs.writeFileSync(path.join(__dirname,'../','data.json'),JSON.stringify(users));
    }
}