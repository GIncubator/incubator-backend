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


export { jwtSign, jwtVerify }
