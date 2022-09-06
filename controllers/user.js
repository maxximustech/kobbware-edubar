const User = require("../models/user");
const {response} = require("express");
const {userRoles} = require("../utils/constant");
const helper = require('../utils/helper');


exports.postDeleteUser = (req, res) => {
    if(typeof req.session.user === 'undefined'){
        res.redirect('/login');
        return;
    }
    const userRole = userRoles.find(role => {
        return req.session.user.user_role === role.name;
    });
    User.findByPk(req.params.id).then(user => {
        if(user == null){
            res.status(404).render('404',{
                title: 'Error',
                isLoggedIn: true,
                message: 'The User could not be deleted'
            });
            return;
        }
        if((!userRole.canAccessOwner && user.user_role === 'Owner')
            || (!userRole.canAccessAdmin && user.user_role === 'Admin')
            || (!userRole.canAccessTeacher && user.user_role === 'Teacher')
            || (!userRole.canAccessStudent && user.user_role === 'Student')
            || (req.session.user.user_role === 'Student' && req.session.user.id !== user.id)){
            res.status(404).render('404',{
                title: 'Error',
                isLoggedIn: true,
                message: 'You do not have the permission to delete this uer'
            });
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
        res.status(500).render('500',{
            title: 'Internal Server Error',
            isLoggedIn: true,
            message: err.message
        });
    });
}

exports.getEditUser = (req, res) => {
    if(!helper.authenticate(req, res)){
        res.redirect('/login');
        return
    }
    User.findByPk(req.params.id).then(user => {
        if(user == null){
            res.status(404).render('404',{
                title: 'Page Not Found',
                message: 'The user with the ID does not exist',
                isLoggedIn: true
            })
        }
        const userRole = userRoles.find(role => {
            return req.session.user.user_role === role.name;
        })
        if((!userRole.canAccessOwner && user.user_role === 'Owner')
        || (!userRole.canAccessAdmin && user.user_role === 'Admin')
            || (!userRole.canAccessTeacher && user.user_role === 'Teacher')
            || (!userRole.canAccessStudent && user.user_role === 'Student')
        || (req.session.user.user_role === 'Student' && req.session.user.id !== user.id)){
            res.status(404).render('404',{
                title: 'Page Not Found',
                message: 'You are not authorized to access this page',
                isLoggedIn: true
            })
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
            res.status(404).render('404',{
                title: 'Page Not Found',
                message: err.message,
                isLoggedIn: true
            })
        }
    );
}

exports.postEditUser = (req, res) => {
    if(typeof req.session.user === 'undefined'){
        res.redirect('/login');
        return;
    }
    const userRole = userRoles.find(role => {
        return req.session.user.user_role === role.name;
    });
    User.findByPk(req.body.user.id).then(user => {
        if(user == null){
            res.status(404);
            res.statusMessage = 'User not found';
            res.json({
                status: 404,
                message: 'User not found'
            });
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