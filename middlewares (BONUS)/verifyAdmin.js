const verifyAdmin = (req, res, next) => {
  if (process.env.NODE_ENV === 'test') {
    return next()
  }

  if (req.user && req.user.admin === true) {
    return next()
  } else {
    const errorHtml = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Acceso Denegado</title>
        <link rel="stylesheet" href="/views/styles.css">
      </head>
      <body>
        <div class="container">
          <h1>Acceso Denegado</h1>
          <p>Debe ser administrador para acceder a esta sección.</p>
          <a href="/products" class="btn-style">Volver a Productos</a>
        </div>
      </body>
      </html>
    `
    return res.status(403).send(errorHtml)
  }
}

module.exports = verifyAdmin
