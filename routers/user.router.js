const express = require('express');
const UserController = require('../controllers/user.controller');
const router = express()

router.post("/register", UserController.verifyEmail);
router.post('/verifyotp',UserController.verifyOtp)
router.post("/login",UserController.login)

module.exports=router