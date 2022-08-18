const User = require("../models/user");

exports.postDeleteUser = (req, res) => {
    let username = req.params.user;
    User.deleteOne(username);
    res.redirect('/');
}