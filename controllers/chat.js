const User = require("../models/user");
const getUserData = async (req,res)=>{
    try{
        const data = await User.findOne({_id : res.locals.token.id})
        .select('_id name username photo lastSeen');
        res.json(data);        
    }
    catch(error){
        res.redirect("/login.html");
    }
}

const getChatUsers = async (req,res)=>{
    let error = {};
    let data = {};
    try{
        const result = await User.find({ _id: { $ne: res.locals.token.id } }).select("_id name photo lastSeen")
        .limit(15);
        data = result;
    }
    catch(e){
        console.log(e);
        error = e;
    }
    res.json({"errors":error,"data":data});
}

module.exports = {getUserData,getChatUsers};