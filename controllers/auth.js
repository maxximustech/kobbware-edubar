const User = require("../models/user");
const { userRoles } = require("../utils/constant");

module.exports.getLogin = (req, res)=>{
    if(typeof req.session.username !== 'undefined' && typeof req.session.password !== 'undefined'){
        res.redirect('/');
        return;
    }
    res.render('login',{
        title: 'Welcome to Edubar',
        message: '<h1>Hello World</h1>'
    });
}
exports.postLogin = (req, res) => {
    let data = req.body;
    User.findAll({
        where: {
            name: data.username,
            pass: data.password
        }
    }).then(users => {
        if(users.length <= 0){
            res.status(403);
            res.statusMessage = 'Username or password not correct';
            res.json({
                status: 403,
                message: 'Username or password not correct'
            });
            return;
        }
        let user_session = req.session;
        user_session.username = req.body.username
        user_session.password = req.body.password
        console.log(user_session);
        res.status(200).json({
            status: 200,
            message: 'User logged in successfully'
        });
    }).catch(err => {
        res.status(401);
        res.statusMessage = err.message;
        res.json({
            status: 401,
            message: err.message
        });
    });
}

exports.getSignUp = (req, res)=>{
    res.render('signup',{
        title: 'Sign Up',
        roles: userRoles
    });
}

exports.postSignUp = (req, res) =>{
    let data = req.body;
    let roleIndex = userRoles.findIndex(role => {
        return data.user_role === role.name;
    });
    if(data.username.length < 3){
        res.status(422).json({
            status: 422,
            message: 'Username is too short'
        });
        return;
    }
    if(data.password.length < 5){
        res.status(422).json({
            status: 422,
            message: 'Password is too short'
        });
        return;
    }
    if(roleIndex < 0){
        res.status(422).json({
            status: 422,
            message: 'User role is not valid'
        });
        return;
    }
    User.create({name: data.username, pass: data.password, imageUrl: data.imageUrl, user_role: data.user_role}).then(user=>{
        res.json({
            status: 200,
            message: 'User created successfully',
            data: user
        });
    }).catch(err => {
        res.status(500).json({
            status: 500,
            message: err.message
        });
    });
}

exports.getLogout = (req, res) => {
    req.session.destroy((err)=>{
        res.redirect('/login');
    });
}
