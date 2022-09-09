const exp = require('express');
const router = exp.Router();

const userController = require('../controllers/user');

router.get('/user/:id/delete',userController.postDeleteUser);
router.get('/user/:id/edit',userController.getEditUser);
router.post('/user/:id/edit',userController.postEditUser);
router.get('/users',userController.getUsers);

module.exports = router;