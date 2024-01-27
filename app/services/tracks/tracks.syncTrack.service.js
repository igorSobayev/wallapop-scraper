import VError from 'verror'

import UserModel from '../../repository/users/user.model.js'
import TrackModel from '../../repository/tracks/track.model.js'
import TrackHistoryModel from '../../repository/tracksHistory/trackHistory.model.js'

import ScrapAction from './actions/tracks.scrap.action.js'
import BuildHistoryObjectAction from '../tracksHistory/actions/tracksHistory.buildHistoryObject.action.js'

export default async function syncTrack ({ userId, trackId }) {
    if (!userId) {
        throw VError('userId is missing on sync track')
    }

    if (!trackId) {
        throw VError('trackId is missing on sync track')
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

    const newTrackData = await ScrapAction({ link: track.link })

    // Save the history (old track info)
    const trackHistory = new TrackHistoryModel(BuildHistoryObjectAction({ oldTrack: track }))

    // Update the info in the track
    track.title = newTrackData.title
    track.views = newTrackData.views
    track.favs = newTrackData.favs
    track.price = newTrackData.price
    track.delivery = newTrackData.delivery
    track.deliveryInfo = newTrackData.deliveryInfo
    track.location = newTrackData.location
    track.description = newTrackData.description
    track.sold = newTrackData.sold
    track.reserved = newTrackData.reserved
    track.previewImg = newTrackData.previewImg
    track.updateDate = new Date()
    
    await track.save()

    await trackHistory.save()
}
