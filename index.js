const express = require('express')
const dotenv = require('dotenv')
const { dbConnection } = require('./config/db')
const productRoutes = require('./routes/productRoutes')
const methodOverride = require('method-override')

const app = express()
dotenv.config()
dbConnection()

app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(express.json())
app.use(methodOverride('_method'))

app.use('/', productRoutes)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})