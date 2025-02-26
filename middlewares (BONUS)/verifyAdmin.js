const verifyAdmin = (req, res, next) => {
  if (req.user && req.user.admin === true) {
    return next()
  } else {
    return res.redirect('/products')
  }
}

module.exports = verifyAdmin
