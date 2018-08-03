import passport from 'passport'
import User from '../models/user'
import { JWT_CONFIG } from '../config'
import JwtStrategy from 'passport-jwt'
import LocalStrategy from 'passport-local'

const {
  ExtractJwt,
  Strategy
} = JwtStrategy

const localOptions = {
  usernameField: 'email'
}

const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
  User.findOne({
    email: email
  }, (err, user) => {
    if (err) {
      return done(err)
    }
    if (!user) {
      return done(null, false, {
        error: 'Your login details could not be verified. Please try again.'
      })
    }

    user.comparePassword(password,  (err, isMatch) => {
      if (err) {
        return done(err)
      }
      if (!isMatch) {
        return done(null, false, {
          error: "Your login details could not be verified. Please try again."
        })
      }

      return done(null, user)
    })
  })
})

const jwtOptions = {  
  // Telling Passport to check authorization headers for JWT
  jwtFromRequest: ExtractJwt.fromBodyField('token'),
  // Telling Passport where to find the secret
  secretOrKey: JWT_CONFIG.APPLICATION_JWT_SIGNING_KEY
}

const jwtLogin = new Strategy(jwtOptions, (payload, done) => {  
  User.findOne({email: payload.email} , (err, user) => {
    if (err) { return done(err, false) }

    if (user) {
      done(null, user)
    } else {
      done(null, false)
    }
  })
})

passport.use(jwtLogin)
passport.use(localLogin)

export default passport
