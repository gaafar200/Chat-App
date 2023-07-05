const User = require("../models/user");
const Message = require("../models/message");
const MessageTo = require("../models/messageTo");
const handleReceivedMessage = (message,io,connectedUsers,senderSocket)=>{
    if(message.receiver in connectedUsers){
        const sockets = connectedUsers[message.receiver];
        sockets.forEach((socket) => {
            let actualSocket = io.sockets.sockets.get(socket);
            if(actualSocket != undefined){
                actualSocket.emit('serverMessage',message,function(ack){
                    if(ack == 'success'){
                        const msgStatus = [{
                            message_id:message.id,
                            newStatus: "delivered"
                        }];
                        const serverMsgStat = [
                            {
                                message_id:message.id,
                                newStatus: "delivered",
                                sent_to: message.receiver
                            }
                        ]
                        changeMessagesStatus(serverMsgStat);
                        senderSocket.emit('msgStatus',msgStatus);
                    }
                });
            }
        });
    }
}

const storeMessageInTheDataBase = async (message,socket)=>{
    const msg = new Message({
        text: message.text,
        sender_id: message.sender,
    });
    try{
        await msg.save();
        message.id = msg._id;
        socket.emit("msgDisplay",message);
        const msgId = msg._id;
        const msgTo = new MessageTo({
            message_id: msgId,
            sent_to: message.receiver
        });
        await msgTo.save();
    }
    catch(error){
        console.log("Error Storing Message: " + error);
    }
}

const changeMessagesStatus = ((messagesStats)=>{    
    messagesStats.forEach((msgStat)=>{
        changeStatForMessage(msgStat.message_id,msgStat.newStatus,msgStat.sent_to);
    });
});

const changeStatForMessage = async (message_id,newStatus,sent_to)=>{
    try{
        await MessageTo.updateOne({message_id:message_id,sent_to:sent_to},{$set:{status:newStatus}});
    }
    catch(error){
        console.log(error);
    }
}

module.exports = {handleReceivedMessage,storeMessageInTheDataBase};