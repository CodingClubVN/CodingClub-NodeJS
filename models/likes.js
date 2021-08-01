const mongoose = require('mongoose');

var likeSchema = new mongoose.Schema({
    array_username: [],
    post_id: String
})
var Likes = mongoose.model('Likes', likeSchema, 'likes');
module.exports = Likes;
