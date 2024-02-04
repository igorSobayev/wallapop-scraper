import VError from 'verror'

import UserModel from '../../repository/users/user.model.js'
import TrackModel from '../../repository/tracks/track.model.js'

export default async function archiveTrack ({ userId, trackId }) {
    if (!userId) {
        throw VError('userId is missing on archive track')
    }

    if (!trackId) {
        throw VError('trackId is missing on archive track')
    }

    const user = await UserModel.findById(userId)

    // TODO: allow admin to do this
    if (!user || user.deleted) {
        throw VError(`User with ID ${userId} is missing or is deleted`)
    }

    const track = await TrackModel.findById(trackId)

    if (!track) {
        throw VError(`Track with ID ${trackId} is missing`)
    }

    if (track.user.toString() !== user._id.toString()) {
        throw VError(`Track with ID ${trackId} not belongs to the user ${userId}`)
    }

    track.archived = true
    track.archivedBy = user._id
    track.deletedDate = new Date()

    await track.save()

    user.tracksCounter -= 1
    
    await user.save()
}
