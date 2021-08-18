const mongoose = require('mongoose');
var sessionSchema = new mongoose.Schema({
    username_id: String,
    token: String,
    created: Date
})
var Session = mongoose.model('Session',sessionSchema, 'session');
module.exports = Session;
