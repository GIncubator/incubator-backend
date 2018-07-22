import express from 'express'
import passportGoogle from '../auth/google'
import { jwtSign } from '../utils'

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
    const token = jwtSign(req.user)
    delete req.user
    res.json({ token })
  },
)

export default router
