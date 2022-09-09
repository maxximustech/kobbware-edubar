const exp = require('express');
const router = exp.Router();

const userController = require('../controllers/user');

router.get('/user/:id/edit',userController.getEditUser);

module.exports = router;