const mongoose = require('mongoose');
var sessionSchema = new mongoose.Schema({
    username: String,
    token: String,
    created: Date
})
var Session = mongoose.model('Session',sessionSchema, 'session');
module.exports = Session;
