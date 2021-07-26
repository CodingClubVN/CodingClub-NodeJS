const AuthUser = require('../models/auth-users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
module.exports.postNewPassword = async function(req, res, next){
    const token = req.headers['authorization'].split(' ')[1];
    const user = jwt.verify(token, process.env.JWT_SECRET);
    const username = user.username;
    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;
    const User = await AuthUser.findOne({username}).lean();
    if(!newPassword || newPassword.length<8 ||typeof newPassword !== "string"){
        return res.status(400).json({message: "Invalid password!"});
    }
    if(await bcrypt.compare(oldPassword,User.password)==false) {
        return res.status(400).send({
            message: 'Incorrect password!'
        });
    }
    next();
}
