const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
AuthUser = require('../../models/auth-users');

router.post('/', async (req,res)=>{
   try{
       const username = req.body.username;
       const plainTextPassword = req.body.password;
       const password = await bcrypt.hash(plainTextPassword,10);
       //console.log(password);
       const newAuthUser = new AuthUser({
           username: username,
           password: password
       });
       const auth = await newAuthUser.save();
       if(!auth) throw Error('has a error when save the data');
       res.status(200).json(auth);
   }catch (err) {
       res.status(400).json({msg : err});
   }
})
module.exports = router ;
