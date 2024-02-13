import VError from 'verror'

import UserModel from '../../../repository/users/user.model.js'

import GenerateTokenAction from './actions/users.generateToken.action.js'
import BuildLoggedUserAction from './actions/users.buildLoggedUser.action.js'

export default async function signupCode ({ username, code }) {
    if (!username) {
        throw VError('username is missing')
    }

    if (!code) {
        throw VError(`code for user ${username} is missing`)
    }

    const user = await UserModel.findOne({ username })

    if (!user) {
        throw VError(`User with username ${username} is missing`)
    }

    if (user.active) {
        throw VError({ name: 'AlreadyActiveError' }, `User with username ${username} is already active`)
    }

    if (user.registerCode !== code) {
        throw VError({ name: 'InvalidCodeError' }, `User with username ${username} are using invalid code ${code}`)
    }

    user.active = true
    user.verificationDate = new Date()

    await user.save()

    const token = GenerateTokenAction({ userId: user._id })

    return BuildLoggedUserAction({ user, token })
}
