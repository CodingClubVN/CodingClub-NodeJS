const AuthUser = require('../models/auth-users');
const bcrypt = require('bcryptjs');
module.exports.postNewPassword = async function(req, res, next){
    const username = req.body.username;
    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;
    const user = await AuthUser.findOne({username}).lean();
    if(!newPassword || newPassword.length<8 ||typeof newPassword !== "string"){
        return res.status(400).json({message: "Invalid password!"});
    }
    if(await bcrypt.compare(oldPassword,user.password)==false) {
        return res.status(400).send({
            message: 'Incorrect password!'
        });
    }
    next();
}
