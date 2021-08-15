const mongoose = require('mongoose');
var contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
    day_send : Date
})
var Contacts = mongoose.model('Contact',contactSchema,'contacts');

module.exports = Contacts;
