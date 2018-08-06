import express from 'express'
import { isAuthenticated, canAccess } from '../../../middlewares'

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

router.get('/startupinfo', isAuthenticated, canAccess('Incubator'), (req, res) => {
  res.json({
    data: req.user,
    message: 'Very protected important data for sandeep',
  })
})

export default router
