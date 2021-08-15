const express = require('express');
const router = express.Router();
const Contacts = require('../../models/contacts');
const checkRegExpContacts = require('../../validate/RegExp/RegExpContacts.validate');
//Post
router.post('/',checkRegExpContacts.checkRegExpPostContacts ,async (req, res) => {
    try {
        const today = new  Date()
        const newContacts = new Contacts(
            {
                name: req.body.name,
                email: req.body.email,
                message: req.body.message,
                day_send: today
            }
        )
        await newContacts.save();
        res.status(200).json({message: 'you have sent message successfully',success: true});
    }catch (err) {
        res.status(400).json({message: err, success: false});
    }
})

router.get('/', async (req, res) => {
    try {
        const contacts = await Contacts.find();
        if(!contacts) throw Error('Error!');
        res.status(200).json(contacts);
    }catch (err) {
        res.status(400).json({message: err, success: false});
    }
})

module.exports = router;
