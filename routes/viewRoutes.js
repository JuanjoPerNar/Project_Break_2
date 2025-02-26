const express = require('express')
const path = require('path')
const router = express.Router()
const verifyFirebaseToken = require('../middlewares (BONUS)/verifyFirebaseToken')
const verifyAdmin = require('../middlewares (BONUS)/verifyAdmin')

router.get('/dashboard', verifyFirebaseToken, verifyAdmin, (req, res) => {
    res.sendFile(path.resolve(__dirname, '../public/views/dashboard.html'))
})

module.exports = router