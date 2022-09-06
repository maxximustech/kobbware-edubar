exports.authenticate = (req, res)=>{
    if(typeof req.session.user === 'undefined'){
        return false;
    }
    return true;
}
