import VError from 'verror'
import bcrypt from 'bcryptjs'

import Mailer from '../../../components/mailer/index.js'

import UserModel from '../../../repository/users/user.model.js'

import Utils from '../../../utils/index.js'
import shared from './../../../config/shared.js'

export default async function signup ({ userData }) {
    if (!userData) {
        throw VError('UserData is missing')
    }

    if (!userData.email) {
        throw VError('email is missing')
    }

    if (!userData.username) {
        throw VError('username is missing')
    }

    if (!userData.password) {
        throw VError('password is missing')
    }

    const { username, email, password } = userData

    const alreadyExistUser = await UserModel.findOne({ $or: [
        { username },
        { email },
    ] })

    if (alreadyExistUser) {
        throw VError(`User with email ${email} or username ${username} already exist`)
    }

    const registerCode = Utils.randomString(6)

    const user = new UserModel({
       username,
       email,
       password: bcrypt.hashSync(password, 8),
       role: shared.ROLES.USER,
       registerCode,
    })

    await user.save()

    try {
        const info = {
            user,
            code: registerCode
        }
        await Mailer.sendEmail({ templateName: 'REGISTER_CODE', info })
    } catch (error) {
      console.log(error)
    }
}
