const express = require("express");
const UserController = require("../controllers/user/users.controller");
const solutionController = require("../controllers/user/solution.controller");

const router = express();

router.post("/register", UserController.verifyEmail);
router.post("/verifypass", UserController.registering);
router.post("/login", UserController.login);
router.post("/problem", solutionController.processSolution);
router.get("/user-profile/:id",UserController.userProfile)
router.post('/token-update',UserController.regenerate_token)

module.exports = router;
