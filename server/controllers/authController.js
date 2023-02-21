const User = require( '../models/users')
const jwt = require( 'jsonwebtoken')
const expressJwt  = require( 'express-jwt')
const config = require( './../../config/config')
const bcrypt = require('bcrypt')


const signin = (req, res) => {
  User.findOne({
    "email": req.body.email
  }, async (err, user) => {

    if (err || !user)
      return res.status('401').json({
        error: "User not found"
      })

    const isPasswordOk = await bcrypt.compare(req.body.password, user.password)

        if (!isPasswordOk) {
            return res.status(401).json({error: "Email and password don't match." })
        }

    const token = jwt.sign({
      _id: user._id
    }, config.jwtSecret)

    res.cookie("t", token, {
      expire: new Date() + 300
    })

    return res.json({
      token,
      user: {_id: user._id, name: user.name, email: user.email}
    })

  })
}

const signout = (req, res) => {
  res.clearCookie("t")
  return res.status('200').json({
    message: "signed out"
  })
}

const requireSignin = expressJwt({
  secret: config.jwtSecret,
  algorithms: ["HS256"],
  userProperty: 'auth'
})

const hasAuthorization = (req, res, next) => {
  const authorized = req.profile && req.auth && req.profile._id == req.auth._id
  if (!(authorized)) {
    return res.status('403').json({
      error: "User is not authorized"
    })
  }
  next()
}

module.exports = {
  signin,
  signout,
  requireSignin,
  hasAuthorization
}