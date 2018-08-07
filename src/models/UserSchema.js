import mongoose from 'mongoose'
import bcrypt from 'bcrypt-nodejs'
import { ROLES } from '../config'

const UserSchema = new mongoose.Schema({
  displayName: {
    type: String,
    required: true,
  },
  givenName: {
    type: String,
  },
  familyName: {
    type: String,
  },
  gender: {
    type: String,
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: true,
  },
  password: {
    type: String,
  },
  picture: {
    type: String,
  },
  role: {
    type: String,
    enum: [ROLES.INCUBATOR, ROLES.SUPER_ADMIN],
    default: ROLES.INCUBATOR,
  },
  social: {
    google: {
      uid: String,
    },
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
})

UserSchema.pre('save', function preSave(next) {
  const user = this
  const SALT_FACTOR = 5

  if (!user.isModified('password')) return next()

  bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
    if (err) return next(err)

    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) return next(err)
      user.password = hash
      next()
    })
  })
})

UserSchema.methods.comparePassword = function comparePassword(givenPassword, cb) {
  bcrypt.compare(givenPassword, this.password, (err, isMatch) => {
    if (err) {
      return cb(err)
    }
    cb(null, isMatch)
  })
}

let User

if (mongoose.models.User) {
  User = mongoose.model('User')
} else {
  User = mongoose.model('User', UserSchema)
}

export default User
