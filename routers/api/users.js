const express =require('express');
const router = express.Router();
const Users = require('../../models/auth-users');
const jwt = require('jsonwebtoken');
const checkToken = require('../../validate/checkToken');
//Get /:username
router.get('/:username', async (req, res) => {
    try {
        const user = await Users.find(
            {username: req.params.username}
        )
        if (!user) throw Error('This user does not exist');
        res.status(200).json({
            username: user[0].username,
            phone: user[0].phone,
            email: user[0].email,
            img_avatar : user[0].avatar.imgAvatar,
            firstname: user[0].firstname,
            lastname: user[0].lastname
        });
    }catch (err) {
        res.status(400).json({message: err});
    }
})
module.exports = router;
