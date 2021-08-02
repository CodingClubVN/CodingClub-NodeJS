const mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
    array_comments: [],
    post_id: String
})
var Comments = mongoose.model('Comments',commentSchema,'comments');
module.exports = Comments;
