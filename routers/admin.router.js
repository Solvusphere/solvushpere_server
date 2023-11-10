const express = require('express')
const router = express()
const adminController = require('../controllers/admin/dashboard.controller')
const { route } = require('./company.router')
const AdminCompanyController = require('../controllers/admin/company.controller')

router.post('/verifyEmail', adminController.verifyEmail)
router.post('/verifyOtp',adminController.verifyOtp)
router.post('/registration', adminController.registration)
router.post('/login', adminController.login)
// router.post('/loadProfile', AdminCompanyController.loadProfile)
router.post('/company_list', AdminCompanyController.companyList)
// router.post('/user_list', AdminCompanyController.userList)
// router.post('/block_user/:id',AdminCompanyController.blockUser)
router.post('/block_user/:id',AdminCompanyController.blockCompany)


module.exports = router