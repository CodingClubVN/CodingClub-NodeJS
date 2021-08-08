require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
app.get('/',(req,res) => {
    res.send('Blog CodingCLub');
});
//Router
const RegisterRouter = require('./routers/api/register');
const LoginRouter = require('./routers/api/login');
const ChangePasswordRouter = require('./routers/api/change-password');
const PostRouter = require('./routers/api/posts');
const UsersRouter = require('./routers/api/users');
const LikesRouter = require('./routers/api/likes');
const CommentsRouter = require('./routers/api/comments');
const LogoutRouter = require('./routers/api/logout');
app.use('/api/post/comments', CommentsRouter);
app.use('/api/post/likes', LikesRouter);
app.use('/api/auth/logout', LogoutRouter);
app.use('/api/posts', PostRouter);
app.use('/api/auth/register', RegisterRouter);
app.use('/api/auth/login', LoginRouter);
app.use('/api/auth/change-password',ChangePasswordRouter);
app.use('/api/users', UsersRouter);



//Mongodb
mongoose.connect(process.env.MONGO_URL_LOCAL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(()=> console.log('Mongodb connected'))
    .catch(err => console.log(err));


const PORT = process.env.PORT || 5000

app.listen(PORT,()=>{
    console.log(`App listen at http://localhost:${PORT}`)
});



