const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new mongoose.Schema({

  username: {
    type: String,
    trim: true,
    required: 'Username is required',
    unique: 'Username already exists',
  },

  email: {
    type: String,
    trim: true,
    required: 'Email is required' ,
    unique: 'Email already exists',
    match: [ /.+\@.+\..+/ , 'Email must be valid']
  },

  created: {
    type: Date,
    default: Date.now
  },

  updated: Date,

  h_password: {
    type: String,
    required: 'Password is required',
  },

  salt: String,

});

userSchema
    .virtual('password')
    .set( (password) => {
        this._password = password
        this.salt = this.makeSalt()
        this.h_password = this.encryptPassword(password)
    })
    .get( () => {
      return this._password
    })

userSchema.methods = {
    authenticate: (plainPass) => {
        return this.encryptPassword(plainPass) === this.h_password
    },
    encryptPassword: (password) => {
        if (!password) return ''
        try {
        return crypto
            .createHmac('sha1', this.salt)
            .update(password)
            .digest('hex')
        } catch (err) {
        return ''
        }
    },
    makeSalt: () => {
        return Math.round((new Date().valueOf() * Math.random())) + ''
    }
    }

userSchema.path('h_password').validate( (v) => {
    if (this._password && this._password.length < 8) {
        this.invalidate('password', 'Password must be at least 8 characters.')
    }
    if (this.isNew && !this._password) {
        this.invalidate('password', 'Password is required')
    }
    }, null)

const User = mongoose.model("User", userSchema);
module.exports = User;
