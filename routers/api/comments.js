const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Comments = require('../../models/comments');
const Users = require('../../models/auth-users');
const checkToken = require('../../validate/checkToken');

//Post
router.post('/', checkToken.checkToken, async (req, res) => {
    try {
        const today = new Date();
        const token = req.headers['authorization'].split(' ')[1];
        const user = jwt.verify(token, process.env.JWT_SECRET);
        const post_id = req.body.post_id;
        const _id = user.id
        const User = await Users.findOne({_id});
        const comment = await Comments.findOne({post_id});
        let array = comment.array_comments;
        const newData= {
            username: user.username,
            avatar: User.avatar.imgAvatar,
            message: req.body.message,
            day_comment: today,
            id: Math.random().toString(10).slice(-5)
        }
        array.push(newData);
        const data = {
            array_comments: array,
            post_id: post_id
        }
        await Comments.updateOne(
            {post_id},
            {
                $set: (data)
            }
        )
        res.status(200).json({message: "you commented on the post", success: true});
    }catch (err) {
        res.status(400).json({message: err, success: false});
    }
})
//Delete /:post_id
router.delete('/:post_id', checkToken.checkToken, async (req, res) => {
    try {
        const post_id = req.params.post_id;
        const comment = await Comments.findOne({post_id});
        let array = comment.array_comments;
        let newArray = array.filter(item => item.id !== req.body.id);
        await Comments.updateOne({post_id},{$set: {array_comments: newArray}});
        res.status(200).json({message: "You deleted this comment", success: true});
    }catch (err) {
        res.status(400).json({message: err, success: false});
    }
})
module.exports = router;
