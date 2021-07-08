require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();


app.use(express.json());
app.get('/',(req,res) => {
    res.send('Blog CodingCLub');
});
//Router
const RegisterRouter = require('./routers/api/register');


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
app.use('/api/auth/register', RegisterRouter);
//Cors
app.use(cors());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
})
