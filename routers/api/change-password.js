require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const AuthUser = require('../../models/auth-users');
const jwt = require('jsonwebtoken');
const validateChangePassword = require('../../validate/authChangePassword.validate');
router.put('/',validateChangePassword.postNewPassword ,async (req,res)=>{
    try{
        const token = req.headers['authorization'].split(' ')[1];
        const newPassword = req.body.newPassword;
        const user = jwt.verify(token,process.env.JWT_SECRET);
        const _id = user.id ;
        const password = await bcrypt.hash(newPassword,10);
        await AuthUser.updateOne(
            {_id},
            {
                $set: {password}
            }
        )
        return res.status(200).json({message: "Password updated successfully!", success : true});
    }catch (err) {
        res.status(400).json({success: false, message: err});
    }
})
module.exports = router;
