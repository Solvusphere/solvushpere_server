const express = require("express");
const UserController = require("../controllers/user/users.controller");
const router = express();

router.post("/register/verifyemail", UserController.verifyEmail);
router.post("/register/verifypass", UserController.registering);
router.post("/login", UserController.login);


module.exports = router;
