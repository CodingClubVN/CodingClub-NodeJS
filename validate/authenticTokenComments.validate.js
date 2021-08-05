const jwt = require('jsonwebtoken');
const Comments = require('../models/comments');

module.exports.checkAuthenticToken = async function (req, res, next) {
    const token = req.headers['authorization'].split(' ')[1];
    const user = jwt.verify(token, process.env.JWT_SECRET);
    const post_id = req.params.post_id;
    const comment = await Comments.findOne({post_id});
    const array = comment.array_comments;
    let item = array.filter(item => item.id == req.body.id);
    if (item[0].username !== user.username){
        return res.status(401).json({message: "you do not have this authority", success: false});
    }
    next();
}
