const mongoose = require('mongoose');

var friendSchema = new mongoose.Schema({
    id_username : String,
    username: String,
    list_friends : []
})
var Friends = mongoose.model('Friends',friendSchema,'friends');
module.exports = Friends;
