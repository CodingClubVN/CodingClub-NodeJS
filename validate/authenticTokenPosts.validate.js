const jwt = require('jsonwebtoken');
const Posts = require('../models/posts');

module.exports.checkAuthenticTokenPost = async function (req, res, next){
    const token = req.headers['authorization'].split(' ')[1];
    const user = jwt.verify(token, process.env.JWT_SECRET);
    const id = req.params.id;
    const post = await Posts.findById(id);
    if (post.id_username !== user.id){
        return res.status(401).json({message: "you do not have this authority", success: false});
    }
    next();
}
