import express from 'express'
import { isAuthenticated, canAccess } from '../../../middlewares'
import startup from './startup'

const router = express.Router()

router.get('/', (req, res) => {
  res.json({
    message: 'Very important data',
  })
})

router.get('/protected', isAuthenticated, (req, res) => {
  res.json({
    data: req.user,
    message: 'Very protected important data',
  })
})

router.post('/startupinfo', isAuthenticated, canAccess('Incubator'), startup.post)
router.get('/startupinfo', isAuthenticated, canAccess('Incubator'), startup.get)

export default router
