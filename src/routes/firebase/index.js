import express from 'express'
const router = express.Router()
import * as admin from 'firebase-admin'
import gravatar from 'gravatar';
const serviceAccount = require('../../config/gusec-incubator-sandbox-firebase-adminsdk-93mix-e1d6b85cb0.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://gusec-incubator-sandbox.firebaseio.com"
});

router.get('/', (req, res) => {
  res.json({
    firebase: 'working'
  });
});


const adminEmails = [
  "i.am.sandeep.acharya@gmail.com",
  "06.subrata@gmail.com"
];

const GUSEC_ROLE_USER = {
  GUSEC_ROLE: 'GUSEC_USER'
}
const GUSEC_ROLE_ADMIN = {
  GUSEC_ROLE: 'GUSEC_ADMIN'
}

const getRoleClaim = (email) => adminEmails.includes(email) ? GUSEC_ROLE_ADMIN : GUSEC_ROLE_USER;


router.post('/register', async (req, res) => {
  let email = req.body.email;

  let photoURL = gravatar.url(email, {
    protocol: 'https',
    s: '200'
  });

  let user = {
    email,
    photoURL,
    password: req.body.password,
    displayName: req.body.name,
  }
  try {
    let userRecord = await admin.auth().createUser(user);
    await admin.auth().setCustomUserClaims(userRecord.uid,  getRoleClaim(email));
    let token = await admin.auth().createCustomToken(userRecord.uid)
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
    let decodedToken = await admin.auth().verifyIdToken(idToken);
    let userRecord = await admin.auth().getUser(decodedToken.uid);
    let token = await admin.auth().createCustomToken(userRecord.uid)
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
    let user = await admin.auth().getUserByEmail(email);
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
