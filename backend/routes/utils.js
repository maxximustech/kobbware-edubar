const exp = require('express');
const router = exp.Router();


router.get('/roles',(req, res, next)=>{
    res.json({
        status: 200,
        message: 'Roles fetched successfully',
        roles: require('../utils/constant').userRoles
    });
});

module.exports = router;