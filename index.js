const express = require('express')
const dotenv = require('dotenv')
const session = require('express-session')
const path = require('path')
const methodOverride = require('method-override')
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./docs/swagger.js')
const { dbConnection } = require('./config/db')
const productRoutes = require('./routes/productRoutes')
const authRoutes = require('./routes/authRoutes')
const viewRoutes = require('./routes/viewRoutes')

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
  saveUninitialized: false,
  cookie: {
  secure: process.env.NODE_ENV === 'production',
  maxAge: 1000 * 60 * 60 * 24
  }
}))

app.use('/', authRoutes)
app.use('/', viewRoutes)
app.use('/', productRoutes)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.get('/', (req, res) => {
  res.redirect('/products')
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})