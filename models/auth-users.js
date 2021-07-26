const mongoose = require('mongoose');
const Image  = require('./data-type/image');
var authSchema = new mongoose.Schema({
    username: String,
    password: String,
    firstname: String,
    lastname: String,
    phone : String,
    email: String,
    avatar: Image,
})
var AuthUsers = mongoose.model('AuthUsers',authSchema,'authentic_user');
module.exports = AuthUsers;
