import VError from 'verror'

import Mailer from '../../components/mailer/index.js'

import UserModel from '../../repository/users/user.model.js'

import Utils from '../../utils/index.js'

export default async function forgotPassword ({ email }) {
    if (!email) {
        throw VError('Email is missing')
    }

    const user = await UserModel.findOne({ email })

    if (!user) {
        throw VError(`User with email ${email} not exist`)
    }

    const resetCode = Utils.randomString(6)

    user.forgotPasswordCode = resetCode

    await user.save()

    try {
        const info = {
            to: email,
            code: resetCode
        }
        await Mailer.sendEmail({ templateName: 'RESET_PASSWORD', info })
    } catch (error) {
      console.log(error)
    }
}
