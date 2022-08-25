const User = require("../models/user");
const {response} = require("express");


exports.postDeleteUser = (req, res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    }).then(response => {
        res.redirect('/');
    }).catch(err => {
        res.status(500).render('500',{
            title: 'Internal Server Error',
            message: err.message
        })
    });
}

exports.getEditUser = (req, res) => {
    User.findByPk(req.params.id).then(user => {
        if(user == null){
            res.status(404).render('404',{
                title: 'Page Not Found',
                message: 'The user with the ID does not exist'
            })
        }
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
    }).catch(err => {
        res.status(401);
        res.statusMessage = err.message;
        res.json({
            status: 401,
            message: err.message
        });
    });
}