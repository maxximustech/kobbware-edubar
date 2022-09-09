const createError = require("http-errors");

exports.getEditUser = (req, res)=> {
    res.render('user/edit', {
        title: 'Edit User - ' + user.name,
        editUser: user,
        user: req.session.user,
        isLoggedIn: true,
        roles: userRoles.filter(role => {
            return accessibleRoles.includes(role.name);
        }),
    })
}