import passport from 'passport'
import passportGoogleOauth from 'passport-google-oauth'
import User from '../models/User'
import { simplify } from '../utils'

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
        user.social.google.userId = userId
        user.save(() => done(null, simplify(user)))
      } else {
        const nUser = new User()
        nUser.name = name
        nUser.email = email
        nUser.social.google.userId = userId
        nUser.save(() => {
          done(null, simplify(nUser))
        })
      }
    })
  },
)

passport.use(googleStrategy)

export default passport
