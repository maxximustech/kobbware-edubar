const exp = require('express');
const router = exp.Router();

const userController = require('../controllers/user');

router.get('/user/delete/:user',userController.postDeleteUser);

module.exports = router;