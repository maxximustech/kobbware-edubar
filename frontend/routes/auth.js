const exp = require('express');
const router = exp.Router();

const authController = require('../controllers/auth');

router.get('/login',authController.getLogin);
router.get('/signup',authController.getSignUp);

module.exports = router;