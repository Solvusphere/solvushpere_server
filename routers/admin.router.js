const express = require('express')
const router = express()
const adminController = require('../controllers/admin/dashboard.controller')
const AdminCompanyController = require('../controllers/admin/company.controller')
const AdminUserController = require('../controllers/admin/user.controller')

router.post('/login', adminController.login)
router.post('/company-list', AdminCompanyController.company_List)
router.post('/block-user/:id',AdminCompanyController.block_Company) 
router.post('/user-list', AdminUserController.user_List)
router.post('/block-user/:id',AdminUserController.block_User)


module.exports = router