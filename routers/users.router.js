const express = require("express");
const UserController = require("../controllers/user/users.controller");
const solutionController = require("../controllers/user/solution.controller");
const UserCompanyController = require("../controllers/user/company.controller");

const router = express();

// user controller routes

router.post("/register", UserController.verifyEmail);
router.post("/verifypass", UserController.registering);
router.post("/login", UserController.login);
router.get("/user-profile/:id", UserController.userProfile);
router.post("/token-update", UserController.regenerate_token);

// user-solutoins  controller routes

router.post("/problem", solutionController.processSolution);

// user-companies controller routes

router.get("/companies/:id", UserCompanyController.fetchCompanydata);
router.get("/follow/:id", UserCompanyController.FollowToTheCompany);
module.exports = router;
