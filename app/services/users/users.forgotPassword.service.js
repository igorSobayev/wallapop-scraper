import VError from 'verror'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

import Mailer from '../../components/mailer/index.js'

import UserModel from '../../repository/users/user.model.js'

export default async function forgotPassword ({ email }) {
    if (!email) {
        throw VError('Email is missing')
    }

    const user = await UserModel.findOne({ email })

    if (!user) {
        throw VError(`User with email ${email} not exist`)
    }

    const resetCode = randomString(6)

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

function randomString(length) {
    if (length % 2 !== 0) {
      length++
    }
  
    return crypto.randomBytes(length / 2).toString("hex")
  }