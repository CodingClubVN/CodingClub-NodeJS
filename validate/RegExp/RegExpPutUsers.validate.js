const Users = require('../../models/auth-users');
module.exports.checkRegExpPutUsers = async function(req, res, next) {
    const reg_username = /^[A-z0-9]{0,30}$/;
    const reg_phone = /^0[389][0-9]{8}$/;
    const reg_firstname =/^([A-Z][a-z]{0,20} ){0,6}([A-Z][a-z]{0,20} {0,2})$/;
    const reg_lastname = /^([A-Z][a-z]{0,20} ){0,6}([A-Z][a-z]{0,20} {0,2})$/;
    const reg_email = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const phone = req.body.phone;
    const email = req.body.email;
    const users = await Users.find();
    const username = req.body.username;
    if (username) {
        if (reg_username.test(username) == false){
            return res.status(400).send({
                message: 'Invalid username!'
            });
        };
        for (let a of users) {
            if(a.username == username){
                return res.status(400).send({
                    message: 'username exists!'
                });
            }
        }
    };
    if (phone) {
        if(reg_phone.test(phone) == false){
            return res.status(400).send({
                message: 'Invalid phone!'
            });
        };
        for (let a of users) {
            if(a.phone == phone){
                return res.status(400).send({
                    message: 'phone exists!'
                });
            }
        }
    }
   if (firstname) {
       if(reg_firstname.test(firstname) == false){
           return res.status(400).send({
               message: 'Invalid firstname!'
           });
       };
   }
   if (lastname) {
       if( reg_lastname.test(lastname) == false){
           return res.status(400).send({
               message: 'Invalid lastname!'
           });
       };
   }
    if (email){
        if( reg_email.test(email) == false){
            return res.status(400).send({
                message: 'Invalid email!'
            });
        };
        for (let a of users) {
            if(a.email == email){
                return res.status(400).send({
                    message: 'email exists!'
                });
            }
        }
    }
    next();
}
