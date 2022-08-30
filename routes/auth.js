const exp = require('express');
const router = exp.Router();

const authController = require('../controllers/auth');

router.get('/login',authController.getLogin);
router.post('/login',authController.postLogin);

router.get('/signup',authController.getSignUp);
router.post('/signup',authController.postSignUp);

router.get('/logout', authController.getLogout);

module.exports = router;