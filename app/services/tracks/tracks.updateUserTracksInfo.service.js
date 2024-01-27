import VError from 'verror'

import UserModel from '../../repository/users/user.model.js'
import TrackModel from '../../repository/tracks/track.model.js'
import TrackHistoryModel from '../../repository/tracksHistory/trackHistory.model.js'

import ScrapAction from './actions/tracks.scrap.action.js'
import BuildHistoryObjectAction from '../tracksHistory/actions/tracksHistory.buildHistoryObject.action.js'

 // TODO: Añadir limitación para que no puedan ejecutar sin parar esta acción, poner p.e que manualmente puedan actualizar cada 10 mins
export default async function updateUserTracksInfo ({ userId }) {
    if (!userId) {
        throw VError('userId is missing')
    }

    const user = await UserModel.findOne({ _id: userId, deleted: false  })

    if (!user) {
        throw VError(`user with ID ${userId} is missing`)
    }

    // Tracks to be updated have to be not deleted, not sold and not archived
    const tracksToUpdate = await TrackModel.find({ user: user._id, deleted: false, archived: false, sold: false })

    let updatedTracks = 0
    const trackHistoryToInsert = []

    console.log('UPDATING TRACKS: ', tracksToUpdate.length)

    for (const track of tracksToUpdate) {
        
        try {
            const trackToUpdate = await TrackModel.findById(track._id)

            const newTrackData = await ScrapAction({ link: track.link })

            if (newTrackData.deletedFromPlatform) {
                trackToUpdate.deletedFromPlatform = newTrackData.deletedFromPlatform
        
                await trackToUpdate.save()
                console.log('TRACK DELETED FROM PLATFORM:', trackToUpdate.link)
                continue
            }

            // Save the history (old track info)
            const trackHistory = BuildHistoryObjectAction({ oldTrack: trackToUpdate })

            trackHistoryToInsert.push(trackHistory)

            // Update the info in the track
            trackToUpdate.title = newTrackData.title
            trackToUpdate.views = newTrackData.views
            trackToUpdate.favs = newTrackData.favs
            trackToUpdate.price = newTrackData.price
            trackToUpdate.delivery = newTrackData.delivery
            trackToUpdate.deliveryInfo = newTrackData.deliveryInfo
            trackToUpdate.location = newTrackData.location
            trackToUpdate.description = newTrackData.description
            trackToUpdate.sold = newTrackData.sold
            trackToUpdate.reserved = newTrackData.reserved
            trackToUpdate.previewImg = newTrackData.previewImg
            trackToUpdate.updateDate = new Date()
            
            await trackToUpdate.save()
            console.log('UPDATED TRACK: ', trackToUpdate.link)
            updatedTracks++
        } catch (error) {
            console.log(error)
            continue
        }
    }

    if (!trackHistoryToInsert.length || trackHistoryToInsert.length === 0) return

    await TrackHistoryModel.insertMany(trackHistoryToInsert)

    console.log('UPDATED: ', updatedTracks)
}
