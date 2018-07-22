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

const sendUnAuthenticationError = res => res.status(401).json({
  error: 'true',
  message: 'Unauthenticated access to resource',
})

const sendUnAuthorizedError = res => res.status(403).json({
  error: 'true',
  message: 'Unauthorized access',
})

export {
  jwtSign,
  jwtVerify,
  jwtExtractor,
  sendUnAuthenticationError,
  sendUnAuthorizedError,
}
