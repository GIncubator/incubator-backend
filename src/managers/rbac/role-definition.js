// import { ParameterMismatchError } from 'helpers/api/errors'
import User from 'models/user'
import permissionsMap from '../../helpers/api/permissions'

module.exports = async function roles(userObj) {
  const rolesObj = {}
  const userInstance = new User()

  if (!userObj) {
    console.log(`User not found`)
    throw new ParameterMismatchError(`User not found`)
  }

  const userRoles = userObj.roles
  if (Array.isArray(userRoles) && userRoles.length > 0) {
    const permissionsPromise = userObj.permission.map(async (permission) => {
      const operation = permissionsMap[permission.name]
      let formattedOperation

      switch (operation) {
        // User Policy
        case 'get:user':
          break

        case 'add:user':
          break

        case 'update:user':
          break

        case 'delete:user':
          break

        default:
          formattedOperation = operation
          break
      }

      return formattedOperation
    })

    const permissions = await Promise.all(permissionsPromise)
    console.log(permissions)
    rolesObj[userRoles[0].name] = {
      can: permissions,
    }
  }

  return rolesObj
}
