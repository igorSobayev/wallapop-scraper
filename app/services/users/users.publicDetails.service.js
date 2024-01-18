import UserModel from '../../repository/users/user.model.js'
import VError from 'verror'

export default async function publicDetails ({ username, userId }) {

    if (!username) {
        throw VError(`Missing username`)
    }

    const rawUser = await UserModel.findOne({ username }).lean()

    if (!rawUser) {
        throw VError(`User with username ${username} not exist`)
    }

    const user = {
        username: rawUser.username,
        creationDate: rawUser.creationDate,
    }

    return user
}