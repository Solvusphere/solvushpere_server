const express = require("express");
const comapnyController = require("../controllers/company/dashoard.controller");
const dashboardController = require('../controllers/company/profile.controller')
const router = express();

router.post("/verify-email", comapnyController.verify_Email);
router.post("/inital-register", comapnyController.registering_Intial_Data);
router.post("/detailed-registration", comapnyController.complete_Registration);
router.post('/login', comapnyController.login)
router.get('/profile',dashboardController.fetching_Profile)
router.post('/edit-profile',dashboardController.edit_Profile)

module.exports = router
