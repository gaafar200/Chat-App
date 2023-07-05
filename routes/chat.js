const express = require("express");
const router = express.Router();
const User = require("../models/user");
const chatController = require("../controllers/chat");
console.log(chatController);
router.get("/chat/authenticate",chatController.getUserData);
router.get("/chat/all",chatController.getChatUsers);
module.exports = router;