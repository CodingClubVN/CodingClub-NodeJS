const jwt = require('jsonwebtoken');
const Session = require('../models/session');
module.exports.checkToken = async function (req, res, next) {
    const token = req.headers['authorization'].split(' ')[1];
    if (token && typeof token == "string" && token.length > 20) {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        const id = user.id;
        const session = await Session.find();
        let count = await Session.find().countDocuments();
        if(count == 0){
            return res.status(401).send(
                {
                    message: "You are not logged in"
                }
            )
        }else {
            for (let a of session) {
                if (a.username_id == id && a.token == token) {
                    next();
                }
            }
        }
    } else {
        return res.status(401).send(
            {
                message: "You are not logged in"
            }
        )
    }
}
