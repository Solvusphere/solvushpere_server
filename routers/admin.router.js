const express = require('express')
const router = express()
const adminController = require('../controllers/admin/dashboard.controller')

router.post('/login',adminController.login)

module.exports = router