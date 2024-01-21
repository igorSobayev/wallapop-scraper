import VError from 'verror'

import UserModel from '../../repository/users/user.model.js'
import TrackModel from '../../repository/tracks/track.model.js'

export default async function loadTracks({ userId }) {
    if (!userId) {
        throw VError('userId is missing on upload track elements')
    }

    const user = await UserModel.findOne({ _id: userId })

    if (!user && user.deleted) {
        throw VError('User is missing or deleted')
    }

    const tracks = await TrackModel.find({ user: userId, deleted: false })

    return tracks
}
