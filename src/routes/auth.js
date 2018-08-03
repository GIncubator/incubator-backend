import express from 'express'
import passport from 'passport'

import User from '../models/User'
import passportGoogle from '../auth/google'
import { jwtLogin, localLogin } from '../auth/local'

import { jwtSign, simplify } from '../utils'

passport.use(jwtLogin)
passport.use(localLogin)

const router = express.Router()

router.get(
  '/google/start',
  passportGoogle.authenticate('google', {
    session: false,
    scope: ['openid', 'profile', 'email'],
  }),
)

router.get(
  '/google/callback',
  passportGoogle.authenticate('google', { session: false, scope: ['openid', 'profile', 'email'] }),
  (req, res) => {
    res.status(200).json({
      token: jwtSign(req.user),
      user: req.user
    });
  },
)

router.post('/register', (req, res, next) => {
  const email = req.body.email
  const name = req.body.name
  const password = req.body.password

  if (!email) {
    return res.status(422).send({ error: 'You must enter an email address.'})
  }

  if (!name) {
    return res.status(422).send({ error: 'You must enter your full name.'})
  }

  if (!password) {
    return res.status(422).send({ error: 'You must enter a password.' })
  }

  User.findOne({ email: email }, (err, existingUser) => {
      if (err) { return next(err) }

      if (existingUser) {
        return res.status(422).send({ error: 'That email address is already in use.' })
      }

      let user = new User({ email, password, name })

      user.save((err, user) => {
        if (err) { return next(err) }
        // @todo: send welcome email
        res.status(201).json({
          token: jwtSign(simplify(user)),
          user: simplify(user)
        })
      })
  })
})

router.post('/login', passport.authenticate('local', {session: false}), (req, res) => {
  res.status(200).json({
    token: 'JWT ' + jwtSign(req.user),
    user: req.user
  });
})

export default router
