const express = require('express');
const UserController = require('../controllers/user.controller');
const router = express()


router.post("/register", UserController.register);
module.exports=router