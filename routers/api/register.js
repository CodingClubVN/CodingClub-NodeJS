const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const AuthUser = require('../../models/auth-users');
const Friends = require('../../models/friends');
const Notifies = require('../../models/notifies');
const ValidateRegister = require('../../validate/RegExp/RegExpPostUsers.validate');
router.post('/',ValidateRegister.checkRegExpPostUsers,async (req,res)=>{
   try{
       const username = req.body.username;
       const plainTextPassword = req.body.password;
       const firstname = req.body.firstname;
       const lastname = req.body.lastname;
       const phone = req.body.phone;
       const email = req.body.email;
       const password = await bcrypt.hash(plainTextPassword,10);
       const newAuthUser = new AuthUser({
           username: username,
           password: password,
           firstname: firstname,
           lastname: lastname,
           phone: phone,
           email: email,
           avatar: {imgAvatar: 'https://res.cloudinary.com/codingclubblog/image/upload/v1627315725/avatar_yhyzcp.jpg',cloudId: 'avatar_yhyzcp'}
       });
       const auth = await newAuthUser.save();
       if(!auth) throw Error('has a error when save the data');
       //create friends
       const friends = new Friends({
           id_user: auth._id,
           username: username,
           list_friends: []
       })
       await friends.save();
       //create notifies
       const notifies = new Notifies({
           id_user: auth._id,
           username: username,
           list_notifies: []
       })
       await notifies.save();
       res.status(200).json({success: true});
   }catch (err) {
       res.status(400).json({msg : err});
   }
})
module.exports = router;
