const express = require("express");
const UserController = require("../controllers/user/users.controller");
const router = express();

<<<<<<< HEAD
router.post("/register/verifyemail", UserController.verifyEmail);
router.post("/register/verifypass", UserController.registering);
=======
router.post("/register", UserController.verifyEmail);
// router.post("/register/verifyotp", UserController.verifyOtp);
router.post("/verifypass", UserController.registering);
>>>>>>> e2207b3d53254d0372efaf49af4a4549606d7a53
router.post("/login", UserController.login);


module.exports = router;
