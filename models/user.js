const path = require("path");
const fs = require("fs");

const readFile = ()=>{
    return JSON.parse(fs.readFileSync(path.join(__dirname,'../','data.json')));
}

module.exports = class User{
    constructor(username, password){
        this.user = username;
        this.pass = password;
    }
    save(){
        if(this.pass.length < 5){
            throw new Error('Password length less than 5 characters');
        }
        let users = readFile();
        let check = users.find(u=>{
            return u.username.toLowerCase() === this.user.toLowerCase();
        });
        if(typeof(check) !== 'undefined'){
            throw new Error('Username already exist!');
        }
        let existingUsers = readFile();
        existingUsers.push({
            username: this.user,
            pass: this.pass
        });
        fs.writeFileSync(path.join(__dirname,'../','data.json'),JSON.stringify(existingUsers));
        return true;
    }
    static fetchAll(){
        return readFile();
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