import VError from 'verror'
import bcrypt from 'bcryptjs'

import UserModel from '../../repository/users/user.model.js'

export default async function resetPassword ({ newPassword, email, resetCode }) {
    if (!newPassword) {
        throw VError('New password is missing')
    }

    if (!email) {
        throw VError('User email is missing')
    }

    if (!resetCode) {
        throw VError('User reset code is missing')
    }

    const user = await UserModel.findOne({ email })

    if (!user) {
        throw VError(`User with email ${email} not found`)
    }

    if (!user.forgotPasswordCode) {
        throw VError(`User with email ${email} dont have an active reset code`)
    } 

    if (user.forgotPasswordCode !== resetCode) {
        throw VError(`The user reset code is wrong (${email})`)
    } 

    const hashedNewPassword = bcrypt.hashSync(newPassword, 8)

    user.password = hashedNewPassword
    user.forgotPasswordCode = undefined

    await user.save()
}