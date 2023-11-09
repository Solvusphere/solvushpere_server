const express = require("express");
const UserController = require("../controllers/user/users.controller");
const router = express();

router.post("/register", UserController.verifyEmail);
// router.post("/register/verifyotp", UserController.verifyOtp);
router.post("/verifypass", UserController.registering);
router.post("/login", UserController.login);


module.exports = router;
