const express = require('express')
const dotenv = require("dotenv")
const { dbConnection } = require('./config/db')

const app = express()
dotenv.config()

const PORT = process.env.PORT 

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

dbConnection()

app.get('/', (req, res) => {
    res.send(`<h1>Bienvenido a la tienda`)
})

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});