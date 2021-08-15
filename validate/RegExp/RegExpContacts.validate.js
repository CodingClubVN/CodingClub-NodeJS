module.exports.checkRegExpPostContacts = async function(req, res, next) {
    const reg_name = /^([A-Z][a-z]{1,8} ){0,4}[A-Z][a-z]{0,8}$/;
    const reg_email = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    const name = req.body.name;
    const email = req.body.email;
    const message = req.body.message;

    if(!name || typeof name !== "string" || reg_name.test(name) == false){
        return res.status(400).json({message: "Invalid name", success: false});
    }
    if (!email || typeof email !== "string" || reg_email.test(email) == false){
        return  res.status(400).json({message: "Invalid email", success: false});
    }
    if (!message || typeof message !== "string") {
        return res.status(400).json({message: "Invalid message", success: false});
    }
    next();
}
