module.exports.postNewPassword = async function(req, res, next){
    const newPassword = req.body.newPassword;
    if(!newPassword || newPassword.length<8 ||typeof newPassword !== "string"){
        return res.status(400).json({message: "Invalid password!"});
    }
    next();
}
