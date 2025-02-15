const express = require('express')
const dotenv = require("dotenv")
const { dbConnection } = require('./config/db')

const app = express();
const PORT = process.env.PORT ; // Usa el puerto del .env o 3000 por defecto

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

dbConnection()

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});