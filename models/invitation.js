const mongoose = require('mongoose');

var invitationSchema = new mongoose.Schema({
    id_user: String,
    username: String,
    list_invitation: []
})

var Invitation = mongoose.model('Invitation',invitationSchema,'invitation');
module.exports = Invitation;
