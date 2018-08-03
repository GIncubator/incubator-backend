class HttpError extends Error {
  constructor(errorCode, msg, cause) {
    super('HTTP_ERROR')

    this.errorCode = errorCode
    this.message = msg
    this.name = this.constructor.name
    this.cause = cause
    Error.captureStackTrace(this, this.constructor)
  }
}

class AccessForbidden extends HttpError {
  constructor(msg, cause) {
    super(403, msg || 'ACCESS_FORBIDDEN')

    this.errorCode = 403
    this.message = msg || 'ACCESS_FORBIDDEN'
    this.name = 'AccessForbidden'
    this.cause = cause
    Error.captureStackTrace(this, this.constructor)
  }
}

class Unauthenticated extends HttpError {
  constructor(msg, cause) {
    super(401, msg || 'Unauthenticated')

    this.errorCode = 401
    this.message = msg || 'Unauthenticated'
    this.name = 'Unauthenticated'
    this.cause = cause
    Error.captureStackTrace(this, this.constructor)
  }
}

class EmptyRolesError extends Error {
  constructor(msg, cause) {
    super(417, msg || 'EMPTY_ROLES_ERROR')

    this.errorCode = 417
    this.message = msg || 'EMPTY_ROLES_ERROR'
    this.name = 'EmptyRolesError'
    this.cause = cause
    Error.captureStackTrace(this, this.constructor)
  }
}

class ParameterMismatchError extends HttpError {
  constructor(msg, cause) {
    super(417, msg || 'PARAMETER_MISMATCH_NOTFOUND')

    this.errorCode = 417
    this.message = msg || 'PARAMETER_MISMATCH_NOTFOUND'
    this.name = 'ParameterMismatchError'
    this.cause = cause
    Error.captureStackTrace(this, this.constructor)
  }
}

function isError(error, Type) {
  return (error instanceof Type)
}

function errorPayload(errorObj) {
  return {
    ...errorObj,
    message: errorObj.message,
    // stack: errorObj.stack
  }
}

module.exports = {
  AccessForbidden,
  Unauthenticated,
  EmptyRolesError,
  HttpError,
  ParameterMismatchError,
  isError,
  errorPayload,
}
