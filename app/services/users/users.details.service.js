import UserModel from '../../repository/users/user.model.js'

export default async function details ({ id }) {
    const user = await UserModel.findById(id).select(['-password']).lean()

    return user
}