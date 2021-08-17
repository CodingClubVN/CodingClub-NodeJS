const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Likes = require('../../models/likes');
const Users = require('../../models/auth-users');
const checkToken = require('../../validate/checkToken');
const checkLikes = require('../../validate/checkLikes.validate');
//Post
router.post('/',checkToken.checkToken,checkLikes.checkLikes, async (req, res) =>{
    try {
        const token = req.headers['authorization'].split(' ')[1];
        const user = jwt.verify(token, process.env.JWT_SECRET);
        const post_id = req.body.post_id;
        const like = await Likes.findOne({post_id});
        let array = like.array_id;
        array.push(user.id);
        const data = {
            post_id: post_id,
            array_id: array
        }
        await Likes.updateOne(
            {post_id},
            {
                $set: (data)
            }
        )
        res.status(200).json({message: "you liked this post", success: true});
    }catch (err) {
        res.status(400).json({message: err, success: false});
    }
})
//Delete
router.delete('/:post_id', checkToken.checkToken, async (req, res) => {
    try {
        const token = req.headers['authorization'].split(' ')[1];
        const user = jwt.verify(token, process.env.JWT_SECRET);
        const post_id = req.params.post_id;
        const like = await Likes.findOne({post_id});
        let array  = like.array_id;
        let newArray = array.filter(item => item !== user.id);
        await Likes.updateOne({post_id}, {
            $set: {array_id: newArray}
        })
        res.status(200).json({message: "you unliked this post", success: true});
    }catch (err) {
       res.status(400).json({message: err, success: false});
    }
})
//Get /:post_id
router.get('/:post_id', async (req, res) => {
    try {
        let array_username = [];
        const post_id = req.params.post_id
        const like = await Likes.findOne({post_id});
        if(!like) throw Error("Error not likes");
        for (let item of like.array_id){
            let user = await Users.findById(item);
            array_username.push(user.username);
        }
        res.status(200).json({
            post_id: like.post_id,
            array_username: array_username
        });
    }catch (err) {
        res.status(400).json({message: err, success: false});
    }
})
module.exports = router;
