const express = require('express');
const router = express.Router();
AuthUser = require('../../models/auth-users');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const validateLogin = require('../../validate/authLogin.validate');
router.post('/',validateLogin.postLogin, async (req,res)=>{
    try{
        const username = req.body.username;
        const password = req.body.password;
        const user = await AuthUser.findOne({username}).lean();
        if(await bcrypt.compare(password,user.password)){
            const token = jwt.sign(
                {
                    id: user._id,
                    username: user.username,
                },
                process.env.JWT_SECRET
            )
            res.status(200).json({token: token, success:true});
        }
        if(await bcrypt.compare(password,user.password)==false) {
            res.json({success: false, msg: "password is incorrect"});
        }
    }catch (err) {
            res.status(400).json({msg:err, success:false});
    }
})
module.exports = router;
