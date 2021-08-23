const Notifies = require('../models/notifies');
const Friends = require('../models/friends');
const jwt = require('jsonwebtoken')
module.exports.checkFriends = async function (req,res, next) {
    const token = req.headers['authorization'].split(' ')[1];
    const user = jwt.verify(token,process.env.JWT_SECRET);
    const notifies = await Notifies.findOne({username: req.body.username_friend});
    const friends = await Friends.findOne({username: req.body.username_friend});
    let a = notifies.list_notifies.filter(item => item === user.id);
    let b = friends.list_friends.filter(item => item === user.id);
    if (a.length !== 0){
        return res.status(417).json({
            message: "You have already sent this person a friend request",
            success: false,
        })
    }else if (b.length !== 0){
        return res.status(417).json({
            message: "you already friend this person",
            success: false,
        })
    }else {
        next();
    }

}
