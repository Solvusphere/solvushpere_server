const express = require('express')
const router = express()
const adminController = require('../controllers/admin/dashboard.controller')
const { route } = require('./company.router')

router.post('/verifyEmail', adminController.verifyEmail)
router.post('/verifyOtp',adminController.verifyOtp)
router.post('/registration', adminController.registration)
router.post('/login', adminController.login)
router.post('/loadProfile', adminController.loadProfile)
router.post('/company_list', adminController.companyList)
router.post('/user_list', adminController.userList)
router.post('/block_user/:id',adminController.blockUser)
router.post('/block_user/:id',adminController.blockCompany)


module.exports = router