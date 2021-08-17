const Likes = require('../models/likes');
const jwt = require('jsonwebtoken');
module.exports.checkLikes = async function (req, res, next) {
    const token = req.headers['authorization'].split(' ')[1];
    const User = jwt.verify(token, process.env.JWT_SECRET);
    const post_id = req.body.post_id;
    const like = await Likes.findOne({post_id});
    if (like){
        for (let id of like.array_id){
            if(id == User.id){
                return res.status(417).json({message: "you liked this post", success: false});
            }
        }
    }
    next();
}
