const express = require("express");
const comapnyController = require("../controllers/company/dashoard.controller");

const router = express();

router.post("/verifyemail", comapnyController.verifyEmail);
router.post("/verifyotp", comapnyController.verifyOtp);
router.post("/initalregister", comapnyController.registeringIntialData);

router.post('/login', comapnyController.login)

module.exports = router
