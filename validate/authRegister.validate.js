const AuthUser = require('../models/auth-users');
module.exports.postRegister = async function(req,res, next) {
    const auth = await AuthUser.find();
    const reg_username = /^([A-Z][a-z]{1,10} {1,3}){0,5}[A-Z][a-z]{1,10}$/;
    const username = req.body.username;
    const password = req.body.password;
    for (var a of auth){
        if(a.username == username){
            res.json({status: "error",error: "username already exists"});
        }
    };
    if(!username || typeof username !== "string" || reg_username.test(username)==false){
        res.json({status: 'error', error: 'Invalid username'});
    };
    if(!password || typeof password !=="string" || password.length<5){
        res.json({status:"error", error: "Invalid password"});
    };
    next();
}
