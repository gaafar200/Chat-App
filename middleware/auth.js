const jwt = require("jsonwebtoken");
require("dotenv").config();
const auth = (req,res,next)=>{
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token,process.env.SECRET,(err,decodedToken)=>{
            if(err){
                res.redirect("/login.html");
            }
            else{
                res.locals.token = decodedToken
                next();
            }
        });
    }
    else{
        res.redirect("/login.html");
    }
}

module.exports = {auth}