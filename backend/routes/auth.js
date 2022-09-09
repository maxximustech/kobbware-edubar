const exp = require('express');
const router = exp.Router();

const authController = require('../controllers/auth');

router.post('/login',authController.postLogin);
router.post('/signup',authController.postSignUp);
router.get('/logout', authController.getLogout);

module.exports = router;