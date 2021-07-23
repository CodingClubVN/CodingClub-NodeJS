const jwt = require('jsonwebtoken');
const AuthUser = require('../models/auth-users');
module.exports.checkToken = async function (req, res, next) {
    const token = req.headers['authorization'].split(' ')[1];
    if (token && typeof token == "string" && token.length > 20) {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        const username = user.username;
        const User = await AuthUser.find();
        for (let a of User) {
            if (a.username == username) {
                next();
            }
        }
    } else {
        return res.status(400).send(
            {
                message: "You are not logged in"
            }
        )
    }
}
