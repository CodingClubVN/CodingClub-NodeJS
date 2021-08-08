const express = require('express');
const router = express.Router();
const cloudinary = require('../../utils/cloudinary');
const upload = require('../../utils/multer');
const Posts = require('../../models/posts');
const Likes = require('../../models/likes');
const Comments = require('../../models/comments');
const jwt = require('jsonwebtoken')
const checkToken = require('../../validate/checkToken');
const authenticTokenPost = require('../../validate/authenticTokenPosts.validate');
//Post
router.post('/',checkToken.checkToken,upload.array("image"),async (req, res) =>{
    try {
        const today = new Date();
        const token = req.headers['authorization'].split(' ')[1];
        const user = jwt.verify(token,process.env.JWT_SECRET);
        let path = [];
        let cloudinaryId = [];
        const length_posts = await Posts.find({username: user.username}).countDocuments();
        for(const file of req.files){
            const result = await cloudinary.uploader.upload(file.path);
            path.push(result.secure_url);
            cloudinaryId.push(result.public_id);
        }
        const post_id = Math.random().toString(15).slice(-10);
        const string = String(req.body.status);
        let theme = checkTheme(string.toLowerCase());
        const newPost = new Posts({
            username: user.username,
            image: {Array_Img: path, Array_CloudinaryId: cloudinaryId},
            status: req.body.status,
            day_post: today,
            post_id: post_id,
            theme: theme
        })
        const post = await newPost.save();
        if(!post) throw Error('has a error when save the data');
        //Create Like
        const newLikes = new Likes({
            array_username: [],
            post_id: post_id
        });
        await newLikes.save();
        //Create Comment
        const newComment = new Comments({
            array_comments: [],
            post_id: post_id
        })
        await newComment.save();
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
router.get('/:user', async (req, res)=>{
    try{
        const post = await Posts.find(
            {username: req.params.user}
        )
        if (!post) throw Error('This post does not exist');
        res.status(200).json(post);
    }catch (err) {
        res.status(400).json({message: err});
    }
})
//Delete
router.delete('/:id',checkToken.checkToken,authenticTokenPost.checkAuthenticTokenPost, async (req, res)=>{
    try{
        const post = await Posts.findById(req.params.id);
        const post_id = post.post_id;
        for (var id of post.image.Array_CloudinaryId){
            await cloudinary.uploader.destroy(id);
        }
        await post.remove();
        const like = await Likes.findOne({post_id});
        const comment = await Comments.findOne({post_id});
        await like.remove();
        await comment.remove();
        if (!post) throw Error('has a error when doing the delete data');
        res.status(200).json({success: true});
    }catch (err) {
        res.status(400).json({message: err,success: false});
    }
})

function checkTheme(str){
    if(str.search('html') !=-1) {
        return 'HTML5';
    }
    if (str.search('css') !=-1) {
        return 'CSS3'
    }
    if (str.search('javascript') !=-1) {
        return 'JavaScript';
    }
    if (str.search('nodejs') !=-1){
        return 'NodeJS';
    }
    if (str.search('angular') !=-1){
        return 'Angular';
    }
    if (str.search('reactjs') !=-1) {
        return 'ReactJS';
    }
    if (str.search('vuejs') !=-1) {
        return 'VueJS';
    }
    if (str.search('typescript') !=-1) {
        return 'TypeScript';
    }
    if (str.search('python') !=-1) {
        return 'Python';
    }
    if (str.search('java') !=-1) {
        return 'Java';
    }
    if (str.search('c#') !=-1) {
        return 'C#';
    }
    if (str.search(' c ') !=-1) {
        return 'C';
    }
    if (str.search('c++') !=-1) {
        return 'C++';
    }
    return 'Entertainment'
}
module.exports = router;
