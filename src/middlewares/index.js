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

const canAccess = (role) => (req, res, next) => {
  const {
    user: {
      email
    }
  } = req

  User.findOne({
    email
  }, (err, foundUser) => {
    if (err) {
      res.status(422).json({
        error: 'No user was found.'
      })
      return next(err)
    }
    // If user is found, check role
    if (foundUser.role === role) {
      return next()
    }
    sendUnAuthorizedError(res)
    return next('Unauthorized')
  })
}

export {
  isAuthenticated,
  canAccess
}
