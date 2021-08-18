const express = require('express');
const router = express.Router();
const Session = require('../../models/session');
const checkToken = require('../../validate/checkToken');
const jwt = require('jsonwebtoken');
router.get('/', checkToken.checkToken, async (req, res) =>{
    try {
        const token  = req.headers['authorization'].split(' ')[1];
        const user = jwt.verify(token, process.env.JWT_SECRET);
        const username_id = user.id;
        const session = await Session.findOne({username_id: username_id});
        await session.remove();
        res.status(200).json({message: "you are logged out", success: true});
    }catch (err) {
        res.status(417).json({message: err, success: false});
    }
})
module.exports = router;
