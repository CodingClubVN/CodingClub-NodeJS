const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Comments = require('../../models/comments');
const Users = require('../../models/auth-users');
const checkToken = require('../../validate/checkToken');
const authenticToken = require('../../validate/authenticTokenComments.validate');

//Post
router.post('/', checkToken.checkToken, async (req, res) => {
    try {
        const today = new Date();
        const token = req.headers['authorization'].split(' ')[1];
        const user = jwt.verify(token, process.env.JWT_SECRET);
        const post_id = req.body.post_id;
        const _id = user.id
        const comment = await Comments.findOne({post_id});
        let array = comment.array_comments;
        const newData= {
            id_user: _id,
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
router.delete('/:post_id', checkToken.checkToken,authenticToken.checkAuthenticToken, async (req, res) => {
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
//Get /:post_id
router.get('/:post_id', async (req, res) => {
    try {
        let array_comments = [];
        const post_id = req.params.post_id;
        const comment = await Comments.findOne({post_id});
        if (!comment) throw Error("error when get comments")
        for (let item of comment.array_comments){
            let user = await Users.findById(item.id_user);
            let data = {
                username: user.username,
                avatar: user.avatar.imgAvatar,
                message: item.message,
                day_comment: item.day_comment,
                id: item.id
            }
            array_comments.push(data);
        }
        res.status(200).json({
            post_id: comment.post_id,
            array_comments: array_comments
        });
    }catch (err) {
        res.status(400).json({message: err, success: false});
    }
})
//Update comment /:post_id
router.put('/:post_id', checkToken.checkToken,authenticToken.checkAuthenticToken, async (req, res) => {
    try {
        const today = new Date();
        const post_id = req.params.post_id;
        const comment = await Comments.findOne({post_id});
        let array = comment.array_comments;
        let item = array.filter(item => item.id == req.body.id);
        const newItem = {
            id_user: item[0].id_user,
            message: req.body.newMessage,
            id: item[0].id,
            day_comment: today
        }
        let newArray = array.filter(item => item.id !== req.body.id);
        newArray.push(newItem);
        await Comments.updateOne({post_id},{$set: {array_comments: newArray}});
        res.status(200).json({message: "you updated this comment", success: true});
    }catch (err) {
        res.status(400).json({message: err, success: false});
    }
})
module.exports = router;
