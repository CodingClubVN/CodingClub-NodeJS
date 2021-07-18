const express = require('express');
const router = express.Router();
const cloudinary = require('../../utils/cloudinary');
const upload = require('../../utils/multer');
const Posts = require('../../models/post');
const jwt = require('jsonwebtoken')
const checkToken = require('../../validate/checkToken');
//Post
router.post('/',upload.array("image"),async (req, res) =>{
    try {
        const token = req.body.token;
        const user = jwt.verify(token,process.env.JWT_SECRET);
        let path = [];
        let cloudinaryId = [];
        for(const file of req.files){
            const result = await cloudinary.uploader.upload(file.path);
            path.push(result.secure_url);
            cloudinaryId.push(result.public_id);
        }
        const newPost = new Posts({
            username: user.username,
            image: {Array_Img: path, Array_CloudinaryId: cloudinaryId},
            status: req.body.status
        })
        const post = await newPost.save();
        if(!post) throw Error('has a error when save the data');
        res.status(200).json({message: 'status has been posted', success: true});
    }catch (err) {
        res.status(400).json({massage: err,success: false});
    }
})
//Get
router.get('/', async (req, res) =>{
    try{
        const posts = await Posts.find();
        if(!posts) throw Error("Not Posts");
        res.status(200).json(posts);
    }catch (err) {
        res.status(400).json({message: err})
    }
})
//Get /:user
router.get('/:user',checkToken.checkToken, async (req, res)=>{
    try{
        const post = await Posts.findOne(
            {username: req.params.user}
        )
        if (!post) throw Error('This post does not exist');
        res.status(200).json(post);
    }catch (err) {
        res.status(400).json({message: err});
    }
})
//Delete
router.delete('/:user',checkToken.checkToken, async (req, res)=>{
    try{
        const post = await Posts.findOne(
            {username: req.params.user}
        )
        for (var id of post.image.Array_CloudinaryId){
            await cloudinary.uploader.destroy(id);
        }
        await post.remove();
        if (!post) throw Error('has a error when doing the delete data');
        res.status(200).json({success: true});
    }catch (err) {
        res.status(400).json({message: err,success: false});
    }
})
module.exports = router;
