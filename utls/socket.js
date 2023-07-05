const addUserToTheChat =(userId,ConnectedUsers,socketId)=>{
    if(userId in ConnectedUsers){
        ConnectedUsers[userId].push(socketId);
    }
    else{
        sockets = [];
        sockets.push(socketId)
        ConnectedUsers[userId] = sockets;
    }
}

const removeUserFromTheChat = (userId,ConnectedUsers,socketId)=>{
    const sockets = ConnectedUsers[userId];
    if(userId != undefined && sockets != undefined){
        for(let i = sockets.length - 1;i >= 0;i--){
            if(sockets[i] == socketId){
                sockets.splice(i,1);
                break;
            }
        }
        checkUserStillConnected(userId,ConnectedUsers);
    }
    
}

const checkUserStillConnected = (userId,ConnectedUsers)=>{
    const sockets = ConnectedUsers[userId];
    if(sockets.length === 0){
        delete ConnectedUsers[userId];
    }
}

module.exports = {addUserToTheChat,removeUserFromTheChat};