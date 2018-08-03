import mongoose from 'mongoose'
import bcrypt from 'bcrypt-nodejs';

import { ROLES } from '../config';

const UserSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: [ROLES.INCUBATOR, ROLES.SUPER_ADMIN],
    default: ROLES.INCUBATOR
  },
  social: {
    google: {
      userId: String
    }
  },
  updated_at: { type: Date, default: Date.now },
})

UserSchema.pre('save', (next) => {  
  const user = this,
        SALT_FACTOR = 5;
  if (!user.isModified('password')) return next()

  bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
    if (err) return next(err)

    bcrypt.hash(user.password, salt, null, (err, hash)  => {
      if (err) return next(err);
      user.password = hash;
      next();
    })
  })
})

UserSchema.methods.comparePassword = (givenPassword, cb) => {  
  bcrypt.compare(givenPassword, this.password, (err, isMatch) => {
    if (err) { return cb(err); }
    cb(null, isMatch);
  });
}

export default mongoose.model('User', UserSchema)
