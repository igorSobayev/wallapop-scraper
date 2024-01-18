import VError from 'verror'
import bcrypt from 'bcryptjs'

import UserModel from '../../repository/users/user.model.js'

export default async function changePassword ({ actualPassword, newPassword, userId }) {
    
    if (!actualPassword) {
        throw VError('Actual password is missing')
    }

    if (!newPassword) {
        throw VError('New password is missing')
    }

    if (!userId) {
        throw VError('User ID is missing')
    }

    const user = await UserModel.findById(userId)

    if (!user) {
        throw VError(`User with ID ${userId} not found`)
    }

    const passwordIsValid = bcrypt.compareSync(
        actualPassword,
        user.password
    )

    if (!passwordIsValid) {
        throw VError(`Passwords must be equal!`)
    }

    const hashedNewPassword = bcrypt.hashSync(newPassword, 8)

    user.password = hashedNewPassword

    await user.save()
}