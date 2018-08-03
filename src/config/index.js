const JWT_CONFIG = {
  EXPIRES_IN: 604800 * 4, // 1 month
  AUDIENCE: 'gusec_user',
  ISSUER: 'gusec_incubator_api',
  SUBJECT: 'gusec_user_token',
  APPLICATION_JWT_SIGNING_KEY: process.env.APPLICATION_JWT_SIGNING_KEY
}

const INCUBATOR = 'Incubator'
const SUPER_ADMIN = 'Super Admin'

const ROLES = {
  INCUBATOR,
  SUPER_ADMIN
}

export { JWT_CONFIG, ROLES }
