const path = require('path')
const dotenv = require('dotenv')
dotenv.config()

const showLogin = (req, res) => {
    res.sendFile(path.join(__dirname, '../public/views/login.html'))
}

const showRegister = (req, res) => {
    res.sendFile(path.join(__dirname, '../public/views/register.html'));
}

const login = (req, res) => {
    res.status(400).send('El login debe realizarse a través del cliente con Firebase Auth.')
}

const register = (req, res) => {
    res.status(400).send('El registro debe realizarse a través del cliente con Firebase Auth.')
}

const logout = (req, res) => {
    res.redirect('/login')
}

module.exports = {
    showLogin,
    showRegister,
    login,
    register,
    logout
}