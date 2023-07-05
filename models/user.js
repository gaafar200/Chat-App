const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const userShceme = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"name can not be empty"],
        minlength: [3,"name must have more than three characters"]
    },
    username:{
        type:String,
        require:[true,"username can not be empty"],
        unique: true,
        minlength: [3,"username can not be less than 3 characters"],
        validate: [
            {
                validator: function (value) {
                    return validator.isAlphanumeric(value);
                },
                message: "Username must contain only letters and numbers",
            },
            {
                validator: async function (value) {
                    const userCount = await mongoose.model("User").countDocuments({ username: value });
                    return userCount === 0;
                },
                message: "Username already exists",
            },
        ],
    },
    password : {
        type : String,
        required : [true,"password can not be empty"],
        minlength : [6,"Minuim Length of password is six characters"]
    },
    lastSeen: {
        type:Date,
        default: Date.now
    },
    photo: {
        type: String,
        default: null
    },
});
userShceme.pre("save",async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password,salt);
    next();
});

userShceme.statics.login = async function(username,password){
    const data = await this.findOne({username});
    if(data){
        const auth = await bcrypt.compare(password,data.password);
        if(auth){
            return data;
        }
        throw new Error("wrong password");
    }
    throw new Error("username doesn't exists");
    
}

module.exports = mongoose.model("User",userShceme);