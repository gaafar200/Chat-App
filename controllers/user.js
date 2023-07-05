const User = require("../models/user");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const maxAge = 60 * 60 * 24 * 15
const createToken = (id)=>{
    return jwt.sign({id},process.env.SECRET,
    {
        expiresIn : maxAge
    });
}
const signup = async (req,res)=>{
    let errors = {};
    let data = {};
    if(req.body.password != req.body.confirmedPassword){
        errors.confirmPassword = 'passwords don\'t match';
    }
    else{
        let user = new User({
            name : req.body.name,
            username: req.body.username,
            password : req.body.password
        });
        try{
            const newUser = await user.save();
            data = newUser;
            const token = createToken(newUser._id);
            res.cookie("jwt",token,
            {
                httpOnly : true,
                maxAge : maxAge * 1000
            });
        }
        catch(error){
            errors = handleError(error,errors);
        }
    }
    res.json({'errors' : errors,'data':data});
}
    

const handleError = (error,errors)=>{
    const DetailedError = error.errors
    const values = Object.values(DetailedError);
    const e = values[0];
    const properties = e.properties;
    const key = properties.path;
    const value = properties.message;
    errors[key] = value;
    return errors;
}

const checkUsernameUnique = async (req,res)=>{
    const count = await User.countDocuments({username: req.body.username});
    const isunique = count === 0;
    res.json({"isunique" : isunique});
}


const login = async (req,res)=>{
    let errors = {};
    let data = {};
    try{
        const result = await User.login(req.body.username,req.body.password);
        data = result;
        const token = createToken(result._id);
        res.cookie("jwt",token,
        {
            httpOnly : true,
            maxAge : maxAge * 1000
        });
    }
    catch(error){
        let temp = {};
        if(error.message.includes("username")){
            temp = {"username":error.message};
        }
        else if(error.message.includes("password")){
            temp = {"password":error.message};
        }
        errors = temp;
    }
    
    res.json({"errors": errors,"data":data});
}

module.exports = {signup, checkUsernameUnique, login}