const express = require("express");
const UserController = require("../controllers/user/users.controller");
const solutionController = require("../controllers/user/solution.controller");
const UserCompanyController = require("../controllers/user/company.controller");

const router = express();

// user controller routes


// user-solutoins  controller routes

router.post("/problem", solutionController.processSolution);

router.post("/register", UserController.verify_Email);
router.post("/create-password", UserController.registering);
router.post("/login", UserController.login);
router.post("/problem", solutionController.process_Solution);
router.get("/user-profile", UserController.user_Profile);
router.post('/token-update', UserController.regenerate_Token);
router.get("/edit-profile", UserController.edit_Profile);
router.post("/edit-profile",UserController.update_Profile)


// user-companies controller routes

router.get("/companies/:id", UserCompanyController.fetchCompanydata);
router.get("/follow/:id", UserCompanyController.FollowToTheCompany);
module.exports = router;
