import express from 'express'
const router = express.Router()
import * as FirebaseAdmin from 'firebase-admin'
const serviceAccount = require('../../config/firebase-service-account.json')
const userConfigs = require('./../../../user-config.json')

FirebaseAdmin.initializeApp({
  credential: FirebaseAdmin.credential.cert(serviceAccount),
  databaseURL: "https://gusec-incubator-project.firebaseio.com"
});

router.get('/', (req, res) => {
  res.json({
    firebase: 'working'
  });
});

const adminEmails = userConfigs.admins || []

const GUSEC_ROLE_USER = {
  GUSEC_ROLE: 'GUSEC_USER'
}
const GUSEC_ROLE_ADMIN = {
  GUSEC_ROLE: 'GUSEC_ADMIN'
}

const getRoleClaim = (email) => adminEmails.includes(email) ? GUSEC_ROLE_ADMIN : GUSEC_ROLE_USER;

router.post('/register', async (req, res) => {
  let email = req.body.email;

  const [firstName, ...lastName] = req.body.name.split(' ')
  const photoURL = `https://ui-avatars.com/api/?rounded=true&background=3f51b5&color=fff&font-size=.40&name=${firstName}+${lastName? lastName.join('') : ''}`
  console.log(photoURL)

  let user = {
    email,
    photoURL,
    password: req.body.password,
    displayName: req.body.name,
  }
  try {
    let userRecord = await FirebaseAdmin.auth().createUser(user);
    await FirebaseAdmin.auth().setCustomUserClaims(userRecord.uid, getRoleClaim(email));
    let token = await FirebaseAdmin.auth().createCustomToken(userRecord.uid)
    return res.json({
      userRecord,
      token
    });
  } catch (err) {
    res.json({
      error: err
    })
  }
});

router.post('/login', async (req, res) => {
  let idToken = req.body.idToken;
  try {
    let decodedToken = await FirebaseAdmin.auth().verifyIdToken(idToken);
    let userRecord = await FirebaseAdmin.auth().getUser(decodedToken.uid);
    let token = await FirebaseAdmin.auth().createCustomToken(userRecord.uid)
    res.json({
      userRecord,
      token
    });
  } catch (err) {
    res.json({
      error: err
    })
  }
});

router.get('/user/:email', async (req, res) => {
  let email = req.params.email;
  try {
    let user = await FirebaseAdmin.auth().getUserByEmail(email);
    res.json({
      user
    });
  } catch (err) {
    res.json({
      error: err
    })
  }
});

export default router;
