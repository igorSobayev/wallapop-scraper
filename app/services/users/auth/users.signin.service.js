import VError from 'verror'
import bcrypt from 'bcryptjs'

import UserModel from '../../../repository/users/user.model.js'

import GenerateTokenAction from './actions/users.generateToken.action.js'
import BuildLoggedUserAction from './actions/users.buildLoggedUser.action.js'

export default async function signin ({ email, password, ignorePassword = false }) {
    if (!email) {
        throw VError('email is missing')
    }

    if (!password) {
        throw VError('password is missing')
    }

    const user = await UserModel.findOne({ email })
  
    if (!user) {
        throw VError(`User with email ${email} not found`)
    }

    const passwordIsValid = bcrypt.compareSync(
      password,
      user.password
    )

    if (!passwordIsValid && !ignorePassword) {
        throw VError({ name: 'InvalidPasswordError' }, `Invalid password on login with ${email}`)
    }

    const token = GenerateTokenAction({ userId: user._id })

    return BuildLoggedUserAction({ user, token })
}
