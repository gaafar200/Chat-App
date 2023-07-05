const { Router } = require("express");
const router = Router();
const User = require("../models/user");
const userController = require("../controllers/user");

router.post("/signup",userController.signup);
router.post("/user/checkusername",userController.checkUsernameUnique);
router.post("/login",userController.login);
module.exports = router;