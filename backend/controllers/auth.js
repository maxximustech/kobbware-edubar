const User = require("../models/user");
const { userRoles, jwtSecret } = require("../utils/constant");
const createError = require('http-errors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.postLogin = async (req, res, next) => {
    try {
        let data = req.body;
        let user = await User.findOne({
            where: {
                name: data.username
            }
        });
        if ((user == null) || !bcrypt.compareSync(data.password, user.pass)) {
            next(createError(401, 'Username or password is incorrect'))
            return;
        }
        let jwt_token = jwt.sign({
            username: data.username,
            password: data.password
        }, jwtSecret, { expiresIn: '1800s' });
        res.status(200).json({
            status: 200,
            message: 'User logged in successfully',
            token: jwt_token
        });
    }catch(err){
        res.status(401);
        res.statusMessage = err.message;
        res.json({
            status: 401,
            message: err.message
        });
    }
}


exports.postSignUp = async (req, res, next) =>{
    try {
        let data = req.body;
        let roleIndex = userRoles.findIndex(role => {
            return data.user_role === role.name;
        });
        if (data.username.length < 3) {
            next(createError(401, 'Username is too short'));
            return;
        }
        let existingUser = await User.findOne({
            where: {
                name: data.username
            }
        });
        if(existingUser != null){
            next(createError(401, 'Username is already taken'));
            return;
        }
        if (data.password.length < 5) {
            next(createError(401, 'Password is too short'));
            return;
        }
        if (roleIndex < 0) {
            next(createError(401, 'User role is not valid'));
            return;
        }
        let hash = bcrypt.hashSync(data.password, 14);
        let user = await User.create({
            name: data.username,
            pass: hash,
            imageUrl: data.imageUrl,
            user_role: data.user_role
        });
        res.json({
            status: 201,
            message: 'User created successfully',
            data: user
        });
    }catch(err){
        next(createError(500, err.message));
    }
}

exports.getLogout = (req, res) => {
    req.session.destroy((err)=>{
        res.redirect('/login');
    });
}
