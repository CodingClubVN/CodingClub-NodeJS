const express = require('express');
const router = express.Router();
const cloudinary = require('../../utils/cloudinary');
const upload = require('../../utils/multer');
const Posts = require('../../models/posts');
const Likes = require('../../models/likes');
const Comments = require('../../models/comments');
const Users = require('../../models/auth-users');
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
        for(const file of req.files){
            const result = await cloudinary.uploader.upload(file.path);
            path.push(result.secure_url);
            cloudinaryId.push(result.public_id);
        }
        const post_id = Math.random().toString(15).slice(-10);
        const string = String(req.body.status);
        let theme = checkTheme(string.toLowerCase());
        const newPost = new Posts({
            id_username: user.id,
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
        res.status(400).json({message: err,success: false});
    }
})
//Get
router.get('/', async (req, res) =>{
    try{
        let res_posts = [];
        const posts = await Posts.find();
        if(!posts) throw Error("Not Posts");
        for (let item of posts){
            let user = await Users.findById(item.id_username);
            let data = {
                username: user.username,
                avatar: user.avatar.imgAvatar,
                image: item.image,
                status: item.status,
                day_post: item.day_post,
                theme: item.theme
            }
            res_posts.push(data);
        }
        res.status(200).json(res_posts);
    }catch (err) {
        res.status(400).json({message: err})
    }
})
//Get /:user
router.get('/:username', async (req, res)=>{
    try{
        let posts_username = [];
        let id_username = '';
        const users = await Users.find();
        for (let user of users) {
            if (user.username == req.params.username){
                id_username = user._id;
            }
        }
        const posts = await Posts.find(
            {id_username: id_username}
        )
        if (!posts) throw Error('This post does not exist');
        for (let item of posts){
            let user = await Users.findById(item.id_username);
            let data = {
                username: user.username,
                avatar: user.avatar.imgAvatar,
                image: item.image,
                status: item.status,
                day_post: item.day_post,
                theme: item.theme
            }
            posts_username.push(data);
        }
        res.status(200).json(posts_username);
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
//Get /:theme
router.get('/theme/:theme', async (req, res) => {
    try {
        const theme = req.params.theme;
        const posts = await Posts.find();
        let array_posts = [];
        for (let item of posts){
            for (let i of item.theme){
                if(i == theme){
                    let user = await Users.findById(item.id_username);
                    let data = {
                        username: user.username,
                        avatar: user.avatar.imgAvatar,
                        image: item.image,
                        status: item.status,
                        day_post: item.day_post,
                        theme: item.theme
                    }
                    array_posts.push(data);
                }
            }
        }
        if (!posts) throw Error("error when load data");
        res.status(200).json(array_posts);
    }catch (err) {
        res.status(400).json({message: err, success: false});
    }
})
router.get('/likes/trending', async (req, res) => {
    try {
        const likes = await Likes.find();
        const posts = await Posts.find();
        let array_trending = [];
        let sort_likes = [];
        sort_likes = likes;
        sort_likes.sort(function(a,b){return(b.array_username.length - a.array_username.length)});
        let a = sort_likes.slice(0, 4);
        for (let i of a){
            for (let item of posts){
                if(item.post_id == i.post_id){
                    let user = await Users.findById(item.id_username);
                    let like = await Likes.findOne({post_id: item.post_id});
                    let comment = await Comments.findOne({post_id: item.post_id});
                    let data = {
                        username: user.username,
                        avatar: user.avatar.imgAvatar,
                        image: item.image.Array_Img,
                        status: item.status,
                        countLike: like.array_username.length,
                        countComment: comment.array_comments.length,
                    }
                    array_trending.push(data);
                }
            }
        }

        res.status(200).json(array_trending);
    }catch (err) {
        res.status(400).json({message: err, success: false});
    }
})
module.exports = router;


function checkTheme(str){
    let array_theme = [];
    const a = ['html','css','javascript','nodejs','angular', 'reactjs','vuejs','typescript','python','java','c#',' c ', 'c++']
    for (let i= 0; i<a.length; i++){
        if(str.indexOf(a[i]) !== -1){
            array_theme.push(a[i].split(' ').join(''));
        }
    }
    return array_theme;
}
