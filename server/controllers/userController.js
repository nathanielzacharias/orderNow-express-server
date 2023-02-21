const User = require( '../models/users')
const _ = require( 'lodash')
const errorHandler = require('./../helpers/dbErrorHandler')
const bcrypt = require('bcrypt')

const create = async (req, res, next) => {
  let user = new User(req.body);

  const passHash = await bcrypt.hash(req.body.password, 10);
  user = { ...req.body, password: passHash };

  try {
    await User.create(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "failed to register user" });
  }

  return res.json();
};

const list = (req, res) => {
    User.find((err, users) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        })
      }
      res.json(users)
    }).select('name email updated created')
  }

//get user doc if exists and assign to req.profile
const userByID = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user)
      return res.status('400').json({
        error: "No such user"
      })
    req.profile = user
    next()
  })
}

//remove sensitive info by assigning undefined
const read = (req, res) => {
  req.profile.hashed_password = undefined
  req.profile.salt = undefined
  return res.json(req.profile)
}

const update = (req, res, next) => {
  let user = req.profile
  user = _.extend(user, req.body)
  user.updated = Date.now()
  user.save((err) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    user.hashed_password = undefined
    user.salt = undefined
    res.json(user)
  })
}

const remove = (req, res, next) => {
  let user = req.profile
  user.remove((err, deletedUser) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    deletedUser.hashed_password = undefined
    deletedUser.salt = undefined
    res.json(deletedUser)
  })
}
module.exports = {
  create,
  userByID,
  read,
  list,
  remove,
  update
}