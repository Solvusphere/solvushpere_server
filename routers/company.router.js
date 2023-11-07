const express = require('express')
const router = express()
const CompanyController = require('../controllers/company/dashoard.controller')

router.post('/login', CompanyController.login)

module.exports = router