const User = require("../models/user");

module.exports.getLogin = (req, res)=>{
    res.render('login',{
        title: 'Welcome to Edubar',
        message: '<h1>Hello World</h1>',
        users: User.fetchAll(),
    });
}
exports.postLogin = (req, res) => {
    let data = req.body;
    let user = new User(data.username, data.password);
    user.verify().then(response => {
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
        title: 'Sign Up'
    });
}

exports.postSignUp = (req, res) =>{
    let data = req.body;
    const user = new User(data.username, data.password);
    user.save()
        .then(response=>{
            res.json({
                status: 200,
                message: 'User created successfully!'
            });
        })
        .catch(err=>{
            res.status(401);
            res.statusMessage = err.message;
            res.json({
                status: 401,
                message: err.message
            });
        });
}
