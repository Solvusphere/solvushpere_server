const express = require("express");
const UserController = require("../controllers/user/users.controller");
const solutionController = require("../controllers/user/solution.controller");

const router = express();

router.post("/register", UserController.verify_Email);
router.post("/create-password", UserController.registering);
router.post("/login", UserController.login);
router.post("/problem", solutionController.process_Solution);
router.get("/user-profile", UserController.user_Profile);
router.post('/token-update', UserController.regenerate_Token);
router.get("/edit-profile", UserController.edit_Profile);
router.post("/edit-profile",UserController.update_Profile)

module.exports = router;
