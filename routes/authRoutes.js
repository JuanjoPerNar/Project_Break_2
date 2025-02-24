const express = require('express')
const router = express.Router()
const { showLogin, showRegister, login, register, logout } = require('../controllers/authController')

router.get('/login', showLogin)
router.get('/register', showRegister)
router.post('/login', login)
router.post('/register', register)
router.get('/logout', logout)

module.exports = router