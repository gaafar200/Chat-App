const express = require("express");
const mongoose = require("mongoose");
const socketIO = require("socket.io");
const cookieParser = require('cookie-parser');
const path = require("path")
const http = require("http");
const userRoutes = require("./routes/user");
const chatRoutes = require("./routes/chat")
const {auth} = require("./middleware/auth");
const socketUtls = require("./utls/socket");
const chatUtls = require('./utls/chat');
const connectedUsers = {};
let userId;
require("dotenv").config();

//create The Server and The Socket
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname,"public")));
app.use(cookieParser());
app.use('/chat',auth);
app.use(userRoutes);
app.use(chatRoutes);
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
const io = socketIO(server);
let count = 0;
io.on("connection",(socket)=>{
    socket.on('user_id',(user_id)=>{
        userId = user_id;
        socketUtls.addUserToTheChat(userId,connectedUsers,socket.id);
    });
    socket.on('clientMessage',async (message,ack)=>{
        await chatUtls.storeMessageInTheDataBase(message,socket);
        chatUtls.handleReceivedMessage(message,io,connectedUsers,socket);
        ack('success');
    });

    socket.on("disconnect",()=>{
        socketUtls.removeUserFromTheChat(userId,connectedUsers,socket.id);
    });
    
});

//Connect To database
try{
    mongoose.connect(process.env.CONNECTION_STRTING);
    console.log("Connected to database");
}
catch(error){
    console.log(`Database Error: ${error}`);
    exit(-1);
}

//start Server
server.listen(PORT,()=>{
    console.log(`Server is listening on port ${PORT}`);
});