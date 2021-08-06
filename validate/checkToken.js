const jwt = require('jsonwebtoken');
const Session = require('../models/session');
module.exports.checkToken = async function (req, res, next) {
    const token = req.headers['authorization'].split(' ')[1];
    if (token && typeof token == "string" && token.length > 20) {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        const username = user.username;
        const session = await Session.find();
        let count = await Session.find().countDocuments();
        if(count == 0){
            return res.status(401).send(
                {
                    message: "You are not logged in"
                }
            )
        }
        for (let a of session) {
            if (a.username == username && a.token == token) {
                next();
            }else {
                return res.status(401).send(
                    {
                        message: "You are not logged in"
                    }
                )
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
