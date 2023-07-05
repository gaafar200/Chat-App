/* Some cool movement */ 
const myChat = document.querySelector(".my-chat-space");
const tailMessages = {'sender':'img/message-tail-sender.svg','receiver':'img/message-tail-receiver.svg'};
const messageStatus = {'sent':'img/single-check.svg','delivered':'double-check.svg','seen':'double-check-seen.svg'}
const message = document.getElementById('msg');
const sendImg = document.querySelector('.send-msg');
const personalPhoto = document.querySelector('.personal-photo')
const chat = document.querySelector('.chat-window');
let currentChat;
let userId;

message.addEventListener('input',(e)=>{
    const debouncer = setTimeout(()=>{
        if(message.value.length > 0){
            sendImg.src = "img/send.png";
        }
        else{
            sendImg.src = "img/audio-icon.svg";
        }
    },400);
})



/** get user data from the server */
async function getUserData(){
    const url = "http://localhost:3000/chat/authenticate";
    try{
        const userdata = await fetch(url);
        if(userdata.redirected){
            window.location.href=userdata.url;
        }
        const result =  await userdata.json();
        return result;
    }
    catch(error){
        console.log(error);
    }
}



/** Add The users To the Chat (Left Side Section Begin) */

async function getUsersInChat(){
    const url = "http://localhost:3000/chat/all";
    const usersInChat = await fetch(url);
    const result = await usersInChat.json();
    return result;
}

let users = getUsersInChat();
users.then((usersInChat)=>{
    if(isEmpty(usersInChat.errors)){
        users = usersInChat.data;
        setUsersInChat(users);
    }
    else{
        console.log(usersInChat.errors);
        window.location.href = "/login.html";
    }
});
function setUsersInChat(users){
    const chats = document.querySelector(".chats");
    users.forEach((user)=>{
        const photo = getUserPhoto(user.photo);
        const div = document.createElement('div');
        div.classList.add('chat');
        div.id = user._id;
        const chatBoxHTML = `
              <div class="chat-left">
                <img src="${photo}" />
              </div>
              <div class="chat-right">
                <div class="chat-right-top">
                  <span class="contact-name">${user.name}</span>
                  <span class="chat-date">Yestarday</span>
                </div>
                <div class="chat-right-bottom">
                  <div class="chat-right-bottom-left">
                    <span class="chat-message">What's going on??? 🖖🖖</span>
                  </div>
                  <div class="chat-right-bottom-right">
                  <span class="unread-messages-number"> 3 </span>
                    <span class="chat-options"
                      ><img src="./img/down-arrow.svg"
                    /></span>
                  </div>
                </div>
            `;
        div.innerHTML = chatBoxHTML;
        chats.appendChild(div);
        const userChatBox = document.getElementById(user._id);
        userChatBox.addEventListener("click",(e)=>{openUserChat(user)});
    });
}

const openUserChat = (user)=>{
    const username = document.getElementById("user-name"); 
    const userPhoto = document.getElementById("user-photo");
    const userLastSeen = document.getElementById('user-lastSeen');
    const userId = document.getElementById("userId");
    const chat = document.getElementById(user._id);
    const photo = getUserPhoto(user.photo);
    const lastSeen = getLastSeenNicly(user.lastSeen);
    username.innerText = user.name;
    userPhoto.src = photo;
    userLastSeen.innerText = lastSeen;
    userId.value = user._id;
    setChatOldMessages();
    setActiveChat(user._id);
    currentChat = user._id;
    if(!myChat.classList.contains("active")){
        myChat.classList.add("active");
    }
}

const setChatOldMessages = (senderId,receiverId)=>{
    chat.innerHTML = "";
    //todo
}

function getLastSeenNicly(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const oneMinute = 60 * 1000;
    const oneHour = 60 * oneMinute;
    const oneDay = 24 * oneHour;
    const oneWeek = 7 * oneDay;
    if (diff < oneMinute) {
        return "last seen right now"; 
    } else if (diff < oneHour) {
        const time =  Math.floor(diff / oneMinute) + " minutes";
        return `last seen ${time} minutes ago`; 
    } else if (diff < oneDay) {
        const time = Math.floor(diff / oneHour) + " hours";
        return `last seen ${time} hours ago`;
    } else if (diff < oneWeek) {
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const day = days[date.getDay()];
        return `last seen on ${day}`;
    } else if (date.getFullYear() === now.getFullYear()) {
        const options = { month: "long", day: "numeric" };
        const time =  date.toLocaleDateString(undefined, options); 
        return `last seen on ${time}`;
    } else {
        const time =  date.toLocaleDateString();
        return `last seen on ${time}`;
    }
}


function getLastMessageTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const oneMinute = 60 * 1000;
    const oneHour = 60 * oneMinute;
    const oneDay = 24 * oneHour;
    const oneWeek = 7 * oneDay;
    if (diff < oneMinute) {
        return "right now"; 
    } else if (diff < oneHour) {
        const time =  Math.floor(diff / oneMinute) + " minutes";
        return `${time} minutes ago`; 
    } else if (diff < oneDay) {
        const time = Math.floor(diff / oneHour) + " hours";
        return `${time} hours ago`;
    } else if (diff < oneWeek) {
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const day = days[date.getDay()];
        return `${day}`;
    } else if (date.getFullYear() === now.getFullYear()) {
        const options = { month: "long", day: "numeric" };
        const time =  date.toLocaleDateString(undefined, options); 
        return `${time}`;
    } else {
        const time =  date.toLocaleDateString();
        return `${time}`;
    }
}
const getUserPhoto = (photo)=>{
    return photo === null ? "img/profile.png" : photo;
}

const setActiveChat = (newChat)=>{
    if(currentChat != undefined){
        let oldChat = document.getElementById(currentChat);
        oldChat.classList.remove('active-chat');
    }
    let chat = document.getElementById(newChat);
    chat.classList.add('active-chat');
}

/** Left Side Section Ends */


/** connect to the Socket */

const data =  getUserData();
data.then((userdata)=>{
    userId = userdata._id;
    const photo = getUserPhoto(userdata.photo)
    personalPhoto.src = photo;
    socket.emit('user_id',userId);
});
const socket = io("http://localhost:3000");

/** Chat Functions */

message.addEventListener("keypress",(e)=>{
    if(e.key == 'Enter' && message.value != ""){
        sendMessage(e.target);
    }
});
const send = sendImg.addEventListener("click",(e)=>{
    if(message.value != ""){
        sendMessage(e.target);
    }
});


const sendTheMessge = (message)=>{
    socket.emit('clientMessage',message,function(ack){
        if(ack != 'success'){
            //todo
            //handle error here
        }
    });
    setUnReadLastMessage(message.receiver,message.text);
    setUnReadMessageTime(message.receiver,message.time);
    setMessageOnTop(message.receiver);
}

socket.on('serverMessage',(message,ack)=>{
    if(message.sender == currentChat){
        displayMessageInChat(message);
    }
    else{
        SetUnReadMessageDetails(message);
    }
    ack("success");
});

const setMessageOnTop = (chatId)=>{
    const chatsBar = document.querySelector('.chats');
    const chatToMove = document.getElementById(chatId);
    console.log(chatToMove);
    chatsBar.insertBefore(chatToMove,chatsBar.firstChild);
    chatToMove.style.transform = 'translateY(-100%)';
    setTimeout(()=>{
        chatToMove.style.transform = 'translateY(0)';
    },0);
}

const SetUnReadMessageDetails = (message)=>{
    changeUnReadMessageCount(message.sender);
    setUnReadLastMessage(message.sender,message.text);
    setUnReadMessageTime(message.sender,message.time);
    setMessageOnTop(message.sender);
}
const getMessageBox = (chatId)=>{
    return document.getElementById(chatId);
}

const setUnReadMessageTime = (chatId,time)=>{
    const LastTalk = getLastMessageTime(time);
    const messageBar = getMessageBox(chatId);
    const LastMessaged = messageBar.querySelector('.chat-date') ;
    LastMessaged.innerText = LastTalk;
}

const setUnReadLastMessage = (chatId,messageText)=>{
    const messageBar = getMessageBox(chatId);
    const lastMessageText = messageBar.querySelector('.chat-message');
    lastMessageText.innerText = messageText;
}


const changeUnReadMessageCount = (chatId,incrementCount)=>{
    const messageBar = getMessageBox(chatId);
    console.log(messageBar);
    console.log(chatId);
    const countOfUnReadMessages = messageBar.querySelector('.unread-messages-number');
    console.log(countOfUnReadMessages);
    if(incrementCount == undefined){
        const newCount = parseInt(countOfUnReadMessages.innerText) +  1;
        countOfUnReadMessages.innerText = newCount;
    }
    else{
        countOfUnReadMessages.innerText = incrementCount;
    }
}

const sendMessage = (target)=>{
    //handle Problem for the future
    const receiverId = document.querySelector("#userId").value;
    const senderId = userId;
    const messageText = message.value;
    if(messageText.length > 0){
        const actualMessage = createMessage(messageText,senderId,receiverId);
        sendTheMessge(actualMessage);
    }
}

socket.on("msgDisplay",(message)=>{
    displayMessageInChat(message);
});

socket.on("msgStatus",(messageStatus)=>{
    messageStatus.forEach((msgStatus)=>{
        changeMessageStatus(msgStatus.message_id,msgStatus.newStatus);
    })
});


const changeMessageStatus = (message_id,newStatus)=>{
    const message = document.getElementById(message_id);
    const status = message.querySelector(".message-status img");
    status.src = "img/" + messageStatus[newStatus];
}
function displayMessageInChat(msg){
    const HtmlClasses = [{'sender':'sender-message-tail','receiver':'receiver-message-tail'},
    {'sender':'sender-message','receiver':'receiver-message'}]
    let messageElements = [];
    message.value = "";
    message.focus();
    const typeOfMessage = msg.sender == userId ? 'sender' : 'receiver';
    let properties = {
        type: 'span',
        classes: [HtmlClasses[0][typeOfMessage]],
        value: `<img src="${tailMessages[typeOfMessage]}">`
    };
    messageElements[0] = createElement(properties);
    properties.classes = [HtmlClasses[1][typeOfMessage]];
    properties.value = msg.text;
    messageElements[1] = createElement(properties);
    const time = convertTimestampToTime(msg.time);
    properties.classes = ['message-time'];
    properties.value = time;
    messageElements[2] = createElement(properties);
    if(typeOfMessage == 'sender'){
        properties.classes = ['message-status'];
        properties.value = `<img src=${messageStatus.sent}>`
        messageElements[3] = createElement(properties);
    }
    properties = {
        type: 'div',
        id: msg.id,
        classes: [typeOfMessage],
        children: messageElements
    }
    let finalMessage = createElement(properties);
    let chatSpace = document.querySelector('.chat-window');
    chatSpace.appendChild(finalMessage);
    chatSpace.scrollTop = chatSpace.scrollHeight;
}

/** Helper functions */

const createElement = (properties)=>{
    const element = document.createElement(properties.type);
    const classes = properties.classes
    classes.forEach((c)=>{
        element.classList.add(c);
    });
    if(properties.value != undefined){
        element.innerHTML = properties.value;
    }
    if(properties.children != undefined){
        const children = properties.children;
        children.forEach((child)=>{
            element.appendChild(child);
        });
    }
    if(properties.id != undefined){
        element.id = properties.id;
    }
    return element;
}



const createMessage = (message,senderId,receiverId)=>{
    const result = {
        text : message,
        sender: senderId,
        receiver: receiverId,
        time: Date.now()
    }
    return result;
}

function convertTimestampToTime(timestamp) {
  const date = new Date(timestamp);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const time = `${hours}:${minutes}`;
  return time;
}





const isEmpty = (obj) => {
  return Object.entries(obj).length === 0;
};