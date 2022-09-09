const utilsConstant = require('../utils/constant');
const createError = require('http-errors');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

module.exports.getLogin = (req, res)=>{
    res.render('login',{
        title: 'Welcome to Edubar',
        message: '<h1>Hello World</h1>'
    });
}

exports.getSignUp = async (req, res, next)=>{
    try{
        const roles = await fetch(utilsConstant.apiUrl+'roles');
        const role_data = await roles.json();
        res.render('signup',{
            title: 'Sign Up',
            roles: role_data.roles
        });
    }catch(err){
        next(createError(500, err.message));
    }
}
