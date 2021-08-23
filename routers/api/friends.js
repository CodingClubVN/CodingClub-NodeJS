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
router.post('/accept/:username_friend',checkToken.checkToken,async (req, res) => {
    try {
        const token = req.headers['authorization'].split(' ')[1];
        const user = jwt.verify(token, process.env.JWT_SECRET);
        const friends = await Friends.findOne({username: user.username});
        const friend = await Users.findOne({username: req.params.username_friend});
        const notifies = await Notifies.findOne({username: user.username});
        const array_notifies = notifies.list_notifies;
        const newArray = array_notifies.filter(item => item !== friend._id.toString());
        await Notifies.updateOne(
            {username: user.username},
            {
                $set: {list_notifies: newArray}
            }
        )
        let array = friends.list_friends;
        array.push(friend._id.toString());
        await Friends.updateOne(
            {username: user.username},
            {
                $set: {list_friends: array}
            }
        )
        res.status(200).json({message: "You have accepted "+ req.params.username +" is friend request",success: true});
    }catch (err) {
        res.status(400).json({message: err,success: false});
    }
})
router.get('/:username', async (req, res) => {
    try {
        const friends = await Friends.findOne({username: req.params.username});
        if (!friends) throw Error("Error!");
        let array_friend = [];
        for (let item of friends.list_friends){
            let user = await Users.findById(item);
            let newData = {
                username: user.username,
                avatar: user.avatar.imgAvatar
            }
            array_friend.push(newData);
        }
        res.status(200).json(array_friend);
    }catch (err) {
        res.status(400).json({message: err,success: false});
    }
})
router.delete('/refuse/:username_notify',checkToken.checkToken,async (req, res) => {
    try {
        const token  = req.headers['authorization'].split(' ')[1];
        const user = jwt.verify(token, process.env.JWT_SECRET);
        const notifies = await Notifies.findOne({username: user.username});
        if (!notifies) throw Error("Error!");
        const user_notify = await Users.findOne({username: req.params.username_notify});
        let array = notifies.list_notifies.filter(item => item !== user_notify._id.toString());
        await Notifies.updateOne(
            {username: user.username},
            {
                $set: {list_notifies: array}
            }
        )
        res.status(200).json({message: "you declined your invitation of "+ user_notify.username,success: true});
    }catch (err) {
        res.status(400).json({message: err, success: false});
    }
})
router.delete('/cancel/:username_friend',checkToken.checkToken ,async (req, res) => {
    try {
        const token = req.headers['authorization'].split(' ')[1];
        const user = jwt.verify(token, process.env.JWT_SECRET);
        const notifies = await Notifies.findOne({username: req.params.username_friend});
        if (!notifies) throw Error("Error!");
        let array = notifies.list_notifies.filter(item => item !== user.id);
        await Notifies.updateOne(
            {username: req.params.username_friend},
            {
                $set: {list_notifies: array}
            }
        )
        res.status(200).json({message: "you canceled the friend request!", success: true});
    }catch (err) {
        res.status(400).json({message: err, success: false});
    }
})
router.delete('/unfriend/:username_friend',checkToken.checkToken,async (req, res) => {
    try {
        const token = req.headers['authorization'].split(' ')[1];
        const user = jwt.verify(token, process.env.JWT_SECRET);
        const friends = await Friends.findOne({id_user: user.id});
        if (!friends) throw Error("Error!");
        const user_friend = await Users.findOne({username: req.params.username_friend});
        const array = friends.list_friends.filter(item => item !== user_friend._id.toString());
        await Friends.updateOne(
            {id_user: user.id},
            {
                $set: {list_friends: array}
            }
        )
        res.status(200).json({message: "you unfriended " + user_friend.username,success: true});
    }catch (err) {
        res.status(400).json({message: err, success: false});
    }
})
module.exports = router;



































