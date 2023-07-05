const mongoose = require('mongoose');
const messageSchema = new mongoose.Schema({
    text:{
        type: String,
        required:[true,"message can't be empty"],
    },
    sender_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    time:{
        type:Date,
        require: true,
        default:Date.now
    }
});
module.exports = mongoose.model("Message",messageSchema);