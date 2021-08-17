const mongoose = require('mongoose');
const Image = require('../models/data-type/image');
var postSchema = new mongoose.Schema({
    id_username: String,
    image: Image,
    status: String,
    post_id: String,
    day_post: Date,
    theme: [],
})

var Posts = mongoose.model('Posts',postSchema,'posts');
module.exports = Posts;
