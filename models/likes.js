const mongoose = require('mongoose');

var likeSchema = new mongoose.Schema({
    array_id: [],
    post_id: String
})
var Likes = mongoose.model('Likes', likeSchema, 'likes');
module.exports = Likes;
