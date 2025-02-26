const admin = require('../config/firebase')

const parseCookies = (cookieHeader) => {
  const list = {}
  if (!cookieHeader) return list
  cookieHeader.split(';').forEach(cookie => {
    let parts = cookie.split('=')
    list[parts.shift().trim()] = decodeURI(parts.join('='))
  })
  return list
}

const verifyFirebaseToken = async (req, res, next) => {
  if (process.env.NODE_ENV === 'test') {
    return next()
  }
  
  let token
  const authHeader = req.headers.authorization
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split('Bearer ')[1]
  } else {
    const cookies = parseCookies(req.headers.cookie)
    if (cookies.idToken) {
      token = cookies.idToken
    } else {
      const errorHtml = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Sesión Expirada</title>
          <link rel="stylesheet" href="/views/styles.css">
        </head>
        <body>
          <div class="container">
            <h1>La sesión ha caducado</h1>
            <p>Inicia sesión nuevamente.</p>
            <a href="/login" class="btn-style">Iniciar sesión</a>
          </div>
        </body>
        </html>
      `
      return res.status(401).send(errorHtml)
    }
  }
  
  try {
    const decodedToken = await admin.auth().verifyIdToken(token)
    req.user = decodedToken
    next()
  } catch (error) {
    console.error("Token verification error:", error)
    if (error.code === 'auth/id-token-expired') {
      const errorHtml = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Sesión Expirada</title>
          <link rel="stylesheet" href="/views/styles.css">
        </head>
        <body>
          <div class="container">
            <h1>La sesión ha caducado</h1>
            <p>Inicia sesión nuevamente.</p>
            <a href="/login" class="btn-style">Iniciar sesión</a>
          </div>
        </body>
        </html>
      `
      return res.status(401).send(errorHtml)
    } else {
      const errorHtml = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Error de Autenticación</title>
          <link rel="stylesheet" href="/views/styles.css">
        </head>
        <body>
          <div class="container">
            <h1>Error de autenticación</h1>
            <p>No se pudo verificar el token. Por favor, inicia sesión nuevamente.</p>
            <a href="/login" class="btn-style">Iniciar sesión</a>
          </div>
        </body>
        </html>
      `
      return res.status(401).send(errorHtml)
    }
  }
}

module.exports = verifyFirebaseToken
