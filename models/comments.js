const mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
    username: String,
    avatar: String,
    message: String,
    day_comment: String,
    post_id: String
})
var Comments = mongoose.model('Comments',commentSchema,'comments');
module.exports = Comments;
