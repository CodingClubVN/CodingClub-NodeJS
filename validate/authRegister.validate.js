const AuthUser = require('../models/auth-users');
module.exports.postRegister = async function(req,res, next) {
    const auth = await AuthUser.find();
    const reg_username = /^[A-z0-9]{0,30}$/;
    const reg_phone = /^0[389][0-9]{8}$/;
    const reg_firstname =/^([A-Z][a-z]{0,20} ){0,6}([A-Z][a-z]{0,20} {0,2})$/;
    const reg_lastname = /^([A-Z][a-z]{0,20} ){0,6}([A-Z][a-z]{0,20} {0,2})$/;
    const reg_email = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    const username = req.body.username;
    const password = req.body.password;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const phone = req.body.phone;
    const email = req.body.email;
    for (var a of auth){
        if(a.username == username){
            return res.status(400).send({
                message: 'username exists!'
            });
        }
        if(a.phone == phone){
            return res.status(400).send({
                message: 'phone exists!'
            });
        }
        if(a.email == email){
            return res.status(400).send({
                message: 'email exists!'
            });
        }
    };
    if(!username || typeof username !== "string" || reg_username.test(username)==false){
        return res.status(400).send({
            message: 'Invalid username!'
        });
    };
    if(!password || typeof password !=="string" || password.length<8){
        return res.status(400).send({
            message: 'Invalid password and password must be more than eight characters!'
        });
    };
    if(!phone || typeof phone !=="string" || reg_phone.test(phone) == false){
        return res.status(400).send({
            message: 'Invalid phone!'
        });
    }
    if(!firstname || typeof firstname !=="string" || reg_firstname.test(firstname) == false){
        return res.status(400).send({
            message: 'Invalid firstname!'
        });
    };
    if(!lastname || typeof lastname !=="string" || reg_lastname.test(lastname) == false){
        return res.status(400).send({
            message: 'Invalid lastname!'
        });
    };
    if(!email || typeof email !=="string" || reg_email.test(email) == false){
        return res.status(400).send({
            message: 'Invalid email!'
        });
    };
    next();
}
