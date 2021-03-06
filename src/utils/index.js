import jwt from 'jsonwebtoken'
import { JWT_CONFIG } from '../config'

const jwtSign = userData => jwt.sign(userData, JWT_CONFIG.APPLICATION_JWT_SIGNING_KEY, {
  expiresIn: JWT_CONFIG.EXPIRES_IN,
  audience: JWT_CONFIG.AUDIENCE,
  issuer: JWT_CONFIG.ISSUER,
  subject: JWT_CONFIG.SUBJECT,
})

const jwtVerify = (token, cb) => {
  jwt.verify(token, JWT_CONFIG.APPLICATION_JWT_SIGNING_KEY, (err, decoded) => {
    cb(err, decoded)
  })
}

const jwtExtractor = (req) => {
  let token = null
  if (req && req.headers.authorization) {
    [, token] = req.headers.authorization.split('JWT ')
  } else {
    token = req.body.token || req.query.token
  }
  return token
}

const sendUnAuthenticationError = res => res.status(200).json({
  error: 'Unauthenticated access to resource',
})

const sendUnAuthorizedError = res => res.status(200).json({
  error: 'Unauthorized access',
})

const simplify = (user) => {
  user = user.toJSON()
  return user
}
export {
  jwtSign,
  jwtVerify,
  jwtExtractor,
  sendUnAuthenticationError,
  sendUnAuthorizedError,
  simplify
}
