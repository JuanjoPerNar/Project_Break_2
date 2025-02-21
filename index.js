const express = require('express')
const dotenv = require('dotenv')
const session = require('express-session')
const path = require('path')
const { dbConnection } = require('./config/db')
const routes = require('./routes/productRoutes')
const methodOverride = require('method-override')

const app = express()
dotenv.config()
dbConnection()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(methodOverride('_method'))

app.use(express.static(path.join(__dirname, 'public')))

app.use(session({
  secret: process.env.SESSION_SECRET || 'secretKey',
  resave: false,
  saveUninitialized: false
}))

app.use('/', routes)

app.get('/', (req, res) => {
  res.redirect('/products')
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})