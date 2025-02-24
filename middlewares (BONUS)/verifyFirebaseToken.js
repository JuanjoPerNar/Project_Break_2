const admin = require('../config/firebase')

const verifyFirebaseToken = async (req, res, next) => {
  if (process.env.NODE_ENV === 'test') {
    return next()
  }

  let token
  const authHeader = req.headers.authorization
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split('Bearer ')[1]
  } else {
    const parseCookies = (cookieHeader) => {
      const list = {}
      if (!cookieHeader) return list
      cookieHeader.split(';').forEach(cookie => {
        let parts = cookie.split('=')
        list[parts.shift().trim()] = decodeURI(parts.join('='))
      })
      return list
    }
    
    const cookies = parseCookies(req.headers.cookie)
    if (cookies.idToken) {
      token = cookies.idToken
    } else {
      return res.status(401).json({ message: 'No token provided' })
    }
  }
  
  try {
    const decodedToken = await admin.auth().verifyIdToken(token)
    req.user = decodedToken
    next()
  } catch (error) {
    console.error("Token verification error:", error)
    return res.status(401).json({ message: 'Invalid token', error })
  }
}

module.exports = verifyFirebaseToken
