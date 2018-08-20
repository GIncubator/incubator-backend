import express from 'express'
// import sgMail from '@sendgrid/mail'
import User from '../models/User'
import onFailure from './../helpers/on-failure'
// import { canAccess } from 'middlewares/rbac'

const router = express.Router()

router.get('/:id?', async (req, res, next) => {
  const { id } = req.params

  const userInstance = new User()

  try {
    let dbData = []
    if (id) {
      dbData = await userInstance.getSingleUser(id)
    } else {
      const queryParams = req.query
      dbData = await userInstance.getAllUsers(queryParams)
      dbData = dbData.length > 0 ? dbData[0].toJSON() : []
    }

    res.status(200).json(dbData)
  } catch (err) {
    onFailure(res, err)
  }
})

router.post('/', async (req, res, next) => {
  const userInstance = new User()

  try {
    const result = await userInstance.createUser(req.body)
    console.log(result)

    res.status(201).json({
      message: 'Successful',
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: err.err.message,
    })
  }
})

// router.put('/:id', canAccess('update:user', async (req) => {
//   return {
//     user: req.session.user,
//     userId: req.params.id,
//     reqBody: req.body
//   }
// }), async (req, res, next) => {
//   const userInstance = new User()

//   try {
//     const result = await userInstance.updateUser(req.params.id, req.body)
//     if (result === 0) {
//       res.status(404).json({})
//       return
//     }
//     res.status(200).json({
//       message: 'User updated successfully'
//     })
//   } catch (err) {
//     onFailure(res, err)
//   }
// })

// router.delete('/:id', canAccess('delete:user', async (req) => {
//   return {
//     user: req.session.user,
//     userId: req.params.id,
//     reqBody: req.body
//   }
// }), async (req, res, next) => {
//   const userInstance = new User()

//   try {
//     const result = await userInstance.updateUser(req.params.id, {
//       deleted: 1
//     })
//     if (result === 0) {
//       res.status(404).json()
//       return
//     }
//     res.status(200).json({
//       message: 'User deleted successfully'
//     })
//   } catch (err) {
//     onFailure(res, err)
//   }
// })

// router.get('/reset-password/:id/:email', canAccess('update:user', async (req) => {
//   return {
//     user: req.session.user,
//     userId: req.params.id,
//     reqBody: req.body
//   }
// }), async (req, res, next) => {

//   const userInstance = new User()

//   try {
//     userInstance.resetPassword(req.params.email)
//     res.status(200).json({
//       message: 'Password resetted successfully'
//     })
//   } catch (err) {
//     onFailure(res, err)
//   }
// })

export default router
