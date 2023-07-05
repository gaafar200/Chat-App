const mongoose = require('mongoose');

const messageToScheme = new mongoose.Schema({
    message_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
        required: true
    },
    sent_to:{
        type:mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    status:{
        type:String,
        enum:['sent','delivered','seen'],
        default: 'sent',
    }
});

module.exports = mongoose.model('MessageTo',messageToScheme);