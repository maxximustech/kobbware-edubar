const User = require("../models/user");
const {response} = require("express");
const {userRoles} = require("../utils/constant");
const helper = require('../utils/helper');
const createError = require("http-errors");


exports.postDeleteUser = (req, res, next) => {
    if(typeof req.session.user === 'undefined'){
        res.redirect('/login');
        return;
    }
    const userRole = userRoles.find(role => {
        return req.session.user.user_role === role.name;
    });
    User.findByPk(req.params.id).then(user => {
        if(user == null){
            next(createError(404, 'The user with the ID does not exist'));
            return;
        }
        if((!userRole.canAccessOwner && user.user_role === 'Owner')
            || (!userRole.canAccessAdmin && user.user_role === 'Admin')
            || (!userRole.canAccessTeacher && user.user_role === 'Teacher')
            || (!userRole.canAccessStudent && user.user_role === 'Student')
            || (req.session.user.user_role === 'Student' && req.session.user.id !== user.id)){
            next(createError(401, 'You do not have the permission to delete this user'));
            return;
        }
        User.destroy({
            where: {
                id: req.params.id
            }
        }).then(response => {
            res.redirect('/');
        })
    }).catch(err => {
        next(createError(500, err.message));
    });
}

exports.getEditUser = (req, res, next) => {
    if(!helper.authenticate(req, res)){
        res.redirect('/login');
        return
    }
    User.findByPk(req.params.id).then(user => {
        if(user == null){
            next(createError(404, 'The user with the ID does not exist'));
            return;
        }
        const userRole = userRoles.find(role => {
            return req.session.user.user_role === role.name;
        })
        if((!userRole.canAccessOwner && user.user_role === 'Owner')
        || (!userRole.canAccessAdmin && user.user_role === 'Admin')
            || (!userRole.canAccessTeacher && user.user_role === 'Teacher')
            || (!userRole.canAccessStudent && user.user_role === 'Student')
        || (req.session.user.user_role === 'Student' && req.session.user.id !== user.id)){
            //let err = new Error('You are not authorized to access this page');
            //err.statusCode = 401;
            //throw err;
            next(createError(401, 'You are not authorized to access this page'));
            return;
        }
        let accessibleRoles = [];
        for (const key in userRole){
            if(userRole[key] === true){
                accessibleRoles.push(key.replace('canAccess',''));
            }
        }
        res.render('user/edit', {
            title: 'Edit User - '+user.name,
            editUser: user,
            user: req.session.user,
            isLoggedIn: true,
            roles: userRoles.filter(role=>{
                return accessibleRoles.includes(role.name);
            }),
        })
    }).catch(err => {
            next(createError(500, err.message));
        }
    );
}

exports.postEditUser = (req, res, next) => {
    if(typeof req.session.user === 'undefined'){
        res.redirect('/login');
        return;
    }
    const userRole = userRoles.find(role => {
        return req.session.user.user_role === role.name;
    });
    User.findByPk(req.body.user.id).then(user => {
        if(user == null){
            next(createError(404,'User not found'));
            return;
        }
        if((!userRole.canAccessOwner && user.user_role === 'Owner')
            || (!userRole.canAccessAdmin && user.user_role === 'Admin')
            || (!userRole.canAccessTeacher && user.user_role === 'Teacher')
            || (!userRole.canAccessStudent && user.user_role === 'Student')
            || (req.session.user.user_role === 'Student' && req.session.user.id !== user.id)){
            res.status(422);
            res.statusMessage = 'Not authorized';
            res.json({
                status: 422,
                message: 'You are not authorized to access this user'
            });
            return;
        }
        User.update({
            name: req.body.user.name,
            pass: req.body.user.pass,
            imageUrl: req.body.user.imageUrl
        },{
            where: {
                id: req.body.user.id
            }
        }).then(response => {
            res.status(200).json({
                status: 200,
                message: 'User details updated successfully'
            });
        })
    }).catch(err => {
        res.status(401);
        res.statusMessage = err.message;
        res.json({
            status: 401,
            message: err.message
        });
    });
}
exports.getUsers = (req, res) => {
    /*if(typeof req.session.user === 'undefined'){
        res.status(422);
        res.statusMessage = 'You need to login';
        res.json({
            status: 42,
            message: 'You need to login'
        });
        return;
    }*/
    User.findAll().then(users=>{
        res.json({
            status: 200,
            massage: 'Users fetched successfully',
            users: users
        });
    }).catch(err=>{
        res.status(404);
        res.statusMessage = err.message;
        res.json({
            status: 404,
            message: err.message
        });
    });
}