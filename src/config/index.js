const JWT_CONFIG = {
  EXPIRES_IN: 604800, // 1 week
  AUDIENCE: 'gusec_user',
  ISSUER: 'gusec_incubator_api',
  SUBJECT: 'gusec_user_token',
  APPLICATION_JWT_SIGNING_KEY: process.env.APPLICATION_JWT_SIGNING_KEY,
}

export { JWT_CONFIG }
