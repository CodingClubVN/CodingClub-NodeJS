const mongoose = require('mongoose');

var notifiesSchema = new mongoose.Schema({
    id_username: String,
    username: String,
    list_notifies: []
})

var Notifies = mongoose.model('Notifies',notifiesSchema,'notifies');
module.exports = Notifies;
