import JwtStrategy from 'passport-jwt'
import LocalStrategy from 'passport-local'

import User from '../models/user'
import { JWT_CONFIG } from '../config'
import { jwtExtractor, simplify } from '../utils'

const {
  ExtractJwt,
  Strategy
} = JwtStrategy

const localOptions = {
  usernameField: 'email'
}

const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
  User.findOne({ email }, (err, user) => {
    if (err) {
      return done(err)
    }
    if (!user) {
      return done(null, false, {
        error: 'Your login details could not be verified. Please try again.'
      })
    }

    if (user && !user.password) {
      user.password = password
      user.markModified(password)
      user.save(() => done(null, simplify(user)))
    } else {
      user.comparePassword(password,  (err, isMatch) => {
        if (err) {
          return done(err)
        }
        if (!isMatch) {
          return done(null, false, {
            error: "Your login details could not be verified. Please try again."
          })
        }
  
        return done(null, simplify(user))
      })
    }
  })
})

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromExtractors([jwtExtractor]),
  secretOrKey: JWT_CONFIG.APPLICATION_JWT_SIGNING_KEY
}

const jwtLogin = new Strategy(jwtOptions, (payload, done) => {  
  User.findOne({email: payload.email} , (err, user) => {
    if (err) { return done(err, false) }
    if (user) {
      done(null, simplify(user))
    } else {
      done(null, false)
    }
  })
})

export {
  jwtLogin,
  localLogin
}
