const express =require('express');
const router = express.Router();
const Users = require('../../models/auth-users');
const jwt = require('jsonwebtoken');
const upload = require('../../utils/multer');
const cloudinary = require('../../utils/cloudinary');
const checkToken = require('../../validate/checkToken');
const checkRegExpPut = require('../../validate/RegExp/RegExpPutUsers.validate');
//Get /:username
router.get('/:username', async (req, res) => {
    try {
        const user = await Users.findOne(
            {username: req.params.username}
        )
        if (!user) throw Error('This user does not exist');
        res.status(200).json({
            username: user.username,
            phone: user.phone,
            email: user.email,
            imgAvatar : user.avatar.imgAvatar,
            firstname: user.firstname,
            lastname: user.lastname
        });
    }catch (err) {
        res.status(400).json({message: err});
    }
})
//Put /:user
router.put('/:username', checkToken.checkToken,upload.single('avatar'),checkRegExpPut.checkRegExpPutUsers ,async (req , res) => {
    try {
        const token = req.headers['authorization'].split(' ')[1];
        const user_jwt = jwt.verify(token, process.env.JWT_SECRET);
        if (user_jwt.username != req.params.username ){
            res.status(400).json({message: 'Incorrect path', success: false});
        }
        const _id = user_jwt.id;
        const user = await Users.findOne({_id});
        let result;
        if (req.file) {
            result = await cloudinary.uploader.upload(req.file.path);
        }
        const data = {
            username: req.body.username || user.username,
            firstname: req.body.firstname || user.firstname,
            lastname: req.body.lastname || user.lastname,
            phone: req.body.phone || user.phone,
            email: req.body.email || user.email,
            avatar: {imgAvatar: result?.secure_url || user.avatar.imgAvatar, cloudId: result?.public_id || user.avatar.cloudId}
        };
        await Users.updateOne(
            {_id},
            {
                $set: (data)
            }
        )
       res.status(200).json({message: "User updated successfully!", success : true});
    }
    catch (err) {
        res.status(400).json({message: err, success: false});
    }
})
//Get ALl users
router.get('/', async (req, res) => {
    try {
        let array_users = [];
        const users = await Users.find();
        for(let item of users){
            array_users.push({username: item.username, avatar: item.avatar.imgAvatar});
        }
        if(!users) throw Error("error when load users");
        res.status(200).json(array_users);
    }catch (err) {
        res.status(400).json({message: err, success: false});
    }
})
module.exports = router;
