const mongoose = require('mongoose');

var authSchema = new mongoose.Schema({
    username: String,
    password: String,
    firstname: String,
    lastname: String,
    phone : String,
    email: String
})
var AuthUsers = mongoose.model('AuthUsers',authSchema,'authentic_user');
module.exports = AuthUsers;
