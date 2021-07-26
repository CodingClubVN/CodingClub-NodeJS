const mongoose = require('mongoose');
const Image = require('../models/data-type/image');
var postSchema = new mongoose.Schema({
    username: String,
    image: Image,
    status: String,
    day_post: Date,
})

var Posts = mongoose.model('Posts',postSchema,'posts');
module.exports = Posts;
