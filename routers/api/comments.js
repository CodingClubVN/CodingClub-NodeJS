const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Comments = require('../../models/comments');
const Users = require('../../models/auth-users');
const checkToken = require('../../validate/checkToken');

//Post
router.post('', checkToken.checkToken, async (req, res) => {
    try {
        const today = new Date();
        const token = req.headers['authorization'].split(' ')[1];
        const user = jwt.verify(token, process.env.JWT_SECRET);
        const post_id = req.body.post_id;
        const _id = user.id
        const User = await Users.findOne({_id});
        const newComment = new Comments({
            username: user.username,
            avatar: User.avatar.imgAvatar,
            message: req.body.message,
            day_comment: today,
            post_id: post_id
        })
        await newComment.save();
        res.status(200).json({message: "you commented on the post", success: true});
    }catch (err) {
        res.status(400).json({message: err, success: false});
    }
})
module.exports = router;
