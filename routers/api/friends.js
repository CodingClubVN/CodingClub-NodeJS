const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Friends = require('../../models/friends');
const Users = require('../../models/auth-users');
const Notifies = require('../../models/notifies');
const checkToken = require('../../validate/checkToken');

//Post
router.post('/invite',checkToken.checkToken,async (req, res) => {
    try {
        const today = new Date();
        const token = req.headers['authorization'].split(' ')[1];
        const user = jwt.verify(token,process.env.JWT_SECRET);
        const friend = await Users.findOne({username: req.body.username_friend});
        const notify = await Notifies.findOne({id_user: friend._id});
        let array = notify.list_notifies;
        array.push(user.id);
        await Notifies.updateOne(
            {username: req.body.username_friend},
            {
                $set: {list_notifies: array}
            }
        )
        res.status(200).json({message: "You have sent a friend request", success: true});
    }catch (err) {
        res.status(400).json({message: err, success: false});
    }
})
//Get notifies /:username
router.get('/invite/:username',async (req, res) => {
    try {
        const notifies = await Notifies.findOne({username: req.params.username});
        if (!notifies) throw Error("Error!");
        let list_invite = [];
        for(let item of notifies.list_notifies){
            let user = await Users.findById(item);
            let data = {
                username:  user.username,
                avatar: user.avatar.imgAvatar
            }
            list_invite.push(data);
        }
        res.status(200).json(list_invite);
    }catch (err) {
        res.status(400).json({message: err, success: false});
    }
})
//Post accept
module.exports = router;



































