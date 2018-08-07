// import restHelper from 'libs/rest-helper';
// import modalObjectValidator from 'libs/validate-modal-obj';
// import { v4 as uuidv4 } from 'uuid';
// import sendEmail from 'libs/send-email'
import to from 'await-to-js'
import UserSchema from './UserSchema'

/* eslint class-methods-use-this: 0 */
class User {
  constructor() {}

  async getSingleUser(id) {
  }

  async getAllUsers(queryParams) {
    let dbData

    const googleUid = queryParams.googleUid
    const passwordUid = queryParams.passwordUid

    let uidQuery = {}
    if (googleUid) {
      uidQuery = {
        social: {
          google: {
            uid: googleUid
          }
        }
      }
    } else if(passwordUid) {
      uidQuery = {
        social: {
          password: {
            uid: passwordUid
          }
        }
      }
    }

    const query = UserSchema.find(uidQuery).exec()
    return query
  }

  async createUser(newUserObj) {
    const user = new UserSchema(newUserObj)
    const [err, data] = await to(user.save())

    if (err) {
      throw new Error(err)
    }
    return {
      data
    }
  }
}

export default User
