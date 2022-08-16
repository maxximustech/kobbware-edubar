const exp = require('express');
const router = exp.Router();

const authController = require('../controllers/auth');

router.get('/login',authController.getLogin);
router.post('/login',authController.postLogin);

module.exports = router;