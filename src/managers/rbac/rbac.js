const { isGlob, globToRegex, any } = require('utils/misc')

class RBAC {
  constructor(roles) {
    this._isRoleInitialized = false
    if (typeof roles !== 'function' && typeof roles.then !== 'function') {
      console.log('roles sync init')
      this.roles = this._parseRoleMap(roles)
      this._isRoleInitialized = true
      console.log('roles sync completed')
    } else {
      console.log('roles sync init')
      this._init = this.asyncInit(roles)
    }
  }

  async asyncInit(roles) {
    // If opts is a function execute for async loading
    if (typeof roles === 'function') {
      roles = await roles()
    }

    if (typeof roles.then === 'function') {
      roles = await roles
    }

    this.roles = this._parseRoleMap(roles)
    this._isRoleInitialized = true
    console.log('roles sync completed')
  }

  async getRole() {
    if (!this._isRoleInitialized) {
      console.log('roles not inited, wait')
      await this._init
      console.log('roles init complete, continue')
    }

    const rolesItr = this.roles.keys()
    return rolesItr.next().value
  }

  static _parseRoleMap(roles) {
    console.log('parsing rolemap')

    // If not a function then should be object
    if (typeof roles !== 'object') {
      throw new TypeError('Expected input to be object')
    }

    const map = new Map()

    // Standardize roles
    Object.keys(roles).forEach((role) => {
      const roleObj = {
        can: {},
        canGlob: [],
      }
      // Check can definition
      if (!Array.isArray(roles[role].can)) {
        throw new TypeError(`Expected roles[${role}].can to be an array`)
      }

      if (roles[role].inherits) {
        if (!Array.isArray(roles[role].inherits)) {
          throw new TypeError(
            `Expected roles[${role}].inherits to be an array`,
          )
        }

        roleObj.inherits = []
        roles[role].inherits.forEach((child) => {
          if (typeof child !== 'string') {
            throw new TypeError(
              `Expected roles[${role}].inherits element`
            )
          }

          if (!roles[child]) {
            throw new TypeError(`Undefined inheritance role: ${child}`)
          }
          roleObj.inherits.push(child)
        })
      }
      // Iterate allowed operations
      roles[role].can.forEach((operation) => {
        // If operation is string
        if (typeof operation === 'string') {
          // Add as an operation
          if (!isGlob(operation)) {
            roleObj.can[operation] = 1
          } else {
            roleObj.canGlob.push({
              name: globToRegex(operation),
              original: operation,
            })
          }
          return
        }
        // Check if operation has a .conditions function
        if (
          typeof operation.conditions === 'function' &&
          typeof operation.name === 'string'
        ) {
          if (!isGlob(operation.name)) {
            roleObj.can[operation.name] = operation.conditions
          } else {
            roleObj.canGlob.push({
              name: globToRegex(operation.name),
              original: operation.name,
              conditions: operation.conditions,
            })
          }
          return
        }
        throw new TypeError('Unexpected operation type', operation)
      })

      map.set(role, roleObj)
    })

    return map
  }

  async can(role, operation, params) {
    // If roles are not inited then wait until init finishes
    if (!this._isRoleInitialized) {
      console.log('roles not inited, wait')
      await this._init
      console.log('roles init complete, continue')
    }

    if (Array.isArray(role)) {
      console.log('array of roles, try all')
      return any(role.map(r => this.can(r, operation, params)))
    }

    if (typeof role !== 'string') {
      console.log('Expected first parameter to be string : role')
      return false
    }

    if (typeof operation !== 'string') {
      console.log('Expected second parameter to be string : operation')
      return false
    }

    const $role = this.roles.get(role)

    if (!$role) {
      console.log('Undefined role')
      return false
    }

    // IF this operation is not defined at current level try higher
    if (!$role.can[operation] &&
      !$role.canGlob.find(glob => glob.name.test(operation))
    ) {
      console.log('Not allowed at this level, try higher')
      // If no parents reject
      if (!$role.inherits || $role.inherits.length < 1) {
        console.log('No inherit, reject false')
        return false
      }
      // Return if any parent resolves true or all reject
      return any(
        $role.inherits.map((parent) => {
          console.log(`Try from ${parent}`)
          return this.can(parent, operation, params)
        }),
      )
    }

    // We have the operation resolve
    if ($role.can[operation] === 1) {
      console.log('We have a match, resolve')
      return true
    }

    // Operation is conditional, run async function
    if (typeof $role.can[operation] === 'function') {
      console.log('Operation is conditional, run conditional function')
      try {
        return await $role.can[operation](params)
      } catch (e) {
        console.log(e, 'conditional function threw')
        return false
      }
    }

    // Try globs
    const globMatch = $role.canGlob.find(glob => glob.name.test(operation))
    if (globMatch && !globMatch.conditions) {
      console.log(`We have a globmatch (${globMatch.original}), resolve`)
      return true
    }

    if (globMatch && globMatch.conditions) {
      console.log(`We have a conditional globmatch (${globMatch.original}), run fn`)
      try {
        return globMatch.conditions(params)
      } catch (e) {
        console.log(e, 'conditional function threw')
        return false
      }
    }

    // No operation reject as false
    console.log('Shouldnt have reached here, something wrong, reject')
    throw new Error('something went wrong')
  }
}

RBAC.create = function create(opts) {
  return new RBAC(opts)
}

module.exports = RBAC
