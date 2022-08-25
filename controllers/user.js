const User = require("../models/user");
const {response} = require("express");


exports.postDeleteUser = (req, res) => {
    User.deleteOne(req.params.id).then(response => {
        res.redirect('/');
    }).catch(err => {
        res.status(500).render('500',{
            title: 'Internal Server Error',
            message: err.message
        })
    });
}

exports.getEditUser = (req, res) => {
    User.fetchById(req.params.id).then(user => {
        res.render('user/edit', {
            title: 'Edit User - '+user.name,
            'user': user
        })
    }).catch(err => {
            res.status(404).render('404',{
                title: 'Page Not Found',
                message: err.message
            })
        }
    );
}

exports.postEditUser = (req, res) => {
    User.update(req.body.user).then(response => {
        res.status(200).json({
            status: 200,
            message: 'User details updated successfully'
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