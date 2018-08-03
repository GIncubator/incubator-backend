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

router.post('/register', (req, res, next) => {
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;

  if (!email) {
    return res.status(422).send({ error: 'You must enter an email address.'});
  }

  if (!name) {
    return res.status(422).send({ error: 'You must enter your full name.'});
  }

  if (!password) {
    return res.status(422).send({ error: 'You must enter a password.' });
  }

  User.findOne({ email: email }, (err, existingUser) => {
      if (err) { return next(err); }

      if (existingUser) {
        return res.status(422).send({ error: 'That email address is already in use.' });
      }

      let user = new User({ email, password, name });

      user.save((err, user) => {
        if (err) { return next(err); }

        // @todo: send welcome email

        let userInfo = jwtSign(user);

        res.status(201).json({
          token: 'JWT ' + generateToken(userInfo),
          user: userInfo
        });
      });
  });
})



export default router
