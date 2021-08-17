const express = require('express');
const router = express.Router();
const AuthUser = require('../../models/auth-users');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const validateLogin = require('../../validate/RegExp/authLogin.validate');
const Session = require('../../models/session');
router.post('/',validateLogin.postLogin, async (req,res)=>{
    try{
        const today =new Date();
        const username = req.body.username;
        const password = req.body.password;
        const user = await AuthUser.findOne({username}).lean();
        if(!user) {
            return res.status(401).json({message:"Username does not exist", success: false});
        }
        if(await bcrypt.compare(password,user.password)){
            const sessions = await Session.find();
            for (let item  of sessions){
                if(username == item.username){
                   return res.status(200).json({token: item.token,success: true});
                }
            }
            const token = jwt.sign(
                {
                    id: user._id,
                    username: user.username,
                },
                process.env.JWT_SECRET
            )
            const newSession = new Session({
                username_id: user._id,
                token: token,
                created: today
            })
            await newSession.save();
            res.status(200).json({token: token, success:true});
        }
        if(await bcrypt.compare(password,user.password)==false) {
            return res.status(400).send({
                message: 'Incorrect password!'
            });
        }
    }catch (err) {
            res.status(400).json({msg:err, success:false});
    }
})
module.exports = router;
