
const {JWT_SECRET} = require("../config");
const {User}  = require('../db/index')
function userMiddleware(req, res, next) {
    // Implement user auth logic
    // You need to check the headers and validate the user from the user DB. Check readme for the exact headers to be expected
const toekn = req.headers.authorization;

// bearer yiihjgguhij => ["bearer","yiiihgjh"]
const words = toekn.split(" ");
const jwtToken = words[1];
const decode = jwt.verify(jwtToken,JWT_SECRET);

if(decode.username){
    req.username = decode.username;
    next();
}else{
    res.status(403).json({
        message:"You are not authorized"
    })
}
}


module.exports = userMiddleware;