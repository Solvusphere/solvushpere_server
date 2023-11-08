const express = require('express')
const router = express()
const adminController = require('../controllers/admin/dashboard.controller')
const { route } = require('./company.router')

router.post('/verifyEmail', adminController.verifyEmail)
router.post('/verifyOtp',adminController.verifyOtp)
router.post('/registration', adminController.registration)
router.post('/login', adminController.login)

module.exports = router