const express = require("express");
const comapnyController = require("../controllers/company/dashoard.controller");
const dashboardController = require('../controllers/company/profile.controller')
const router = express();

router.post("/verifyemail", comapnyController.verifyEmail);
router.post("/verifyotp", comapnyController.verifyOtp);
router.post("/initalregister", comapnyController.registeringIntialData);
router.post("/detailedRegistration", comapnyController.completeRegistration);
router.post('/login', comapnyController.login)


router.get('/profile',dashboardController.fetchingProfile)
router.post('/editProfile',dashboardController.editProfile)

module.exports = router
