import passport from 'passport'
import passportGoogleOauth from 'passport-google-oauth'
import User from '../models/User'

const GoogleStrategy = passportGoogleOauth.OAuth2Strategy

const googleOAuthInfo = {
  clientID: process.env.GOOGLE_OAUTH2_CLIENT_ID,
  clientSecret: process.env.GOOGLE_OAUTH2_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_OAUTH2_CALLBACK_URL,
}

const googleStrategy = new GoogleStrategy(
  googleOAuthInfo,
  (accessToken, refreshToken, profile, done) => {
    // try to find the user with email
    const name = profile.displayName
    const email = profile.emails[0].value
    const userId = profile.id

    User.findOne({ email }, (error, user) => {
      if (user) {
        return done(null, user.toJSON())
      }
      const nUser = new User()
      nUser.name = name
      nUser.email = email
      nUser.social.google.userId = userId
      nUser.save((err) => {
        if (!err) {
          return done(null, nUser.toJSON())
        }
        return done(null, user.toJSON())
      })
    })
  },
)

passport.use(googleStrategy)

export default passport
