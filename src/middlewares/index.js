import {
  jwtExtractor,
  jwtVerify,
  sendUnAuthenticationError,
  sendUnAuthorizedError,
} from '../utils'

const isAuthenticated = (req, res, next) => {
  const token = jwtExtractor(req)
  // if no token found in request
  if (!token) {
    return sendUnAuthenticationError(res)
  }
  jwtVerify(token, (err, decoded) => {
    // verification failed
    if (err) {
      return sendUnAuthenticationError(res)
    }
    // important
    req.user = decoded
    next()
  })
}

const canAccess = role => (req, res, next) => {
  if (!req.user) {
    return sendUnAuthorizedError(res)
  }
  // @todo: change it to role
  if (req.user.name !== role) {
    return sendUnAuthorizedError(res)
  }
  next()
}

export {
  isAuthenticated,
  canAccess,
}
