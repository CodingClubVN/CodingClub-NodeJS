const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const AuthUser = require('../../models/auth-users');
const ValidateRegister = require('../../validate/authRegister.validate');
router.post('/',ValidateRegister.postRegister,async (req,res)=>{
   try{
       const username = req.body.username;
       const plainTextPassword = req.body.password;
       const firstname = req.body.firstname;
       const lastname = req.body.lastname;
       const phone = req.body.phone;
       const email = req.body.email;
       const avatar = 'https://res.cloudinary.com/awi-ln/image/upload/v1626535357/avatar_t6zlhg.png';
       const password = await bcrypt.hash(plainTextPassword,10);
       const newAuthUser = new AuthUser({
           username: username,
           password: password,
           firstname: firstname,
           lastname: lastname,
           phone: phone,
           email: email,
           avatar: avatar
       });
       const auth = await newAuthUser.save();
       if(!auth) throw Error('has a error when save the data');
       res.status(200).json({success: true});
   }catch (err) {
       res.status(400).json({msg : err});
   }
})
module.exports = router;
