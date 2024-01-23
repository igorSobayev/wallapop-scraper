import VError from 'verror'

import UserModel from '../../repository/users/user.model.js'
import TrackModel from '../../repository/tracks/track.model.js'

import ScrapAction from './actions/tracks.scrap.action.js'
import TrackHistoryModel from '../../repository/tracksHistory/trackHistory.model.js'

export default async function updateTracks ({ trackUpdatePreference }) {
    if (!trackUpdatePreference) {
        throw VError('trackUpdatePreference is missing')
    }

    const users = await UserModel.find({ trackUpdatePreference, deleted: false  })
    
    const usersIds = users.map(user => user._id)

    const tracksToUpdate = await TrackModel.find({ user: { $in: usersIds }, deleted: false })

    let updatedTracks = 0
    const trackHistoryToInsert = []

    console.log('UPDATING TRACKS: ', tracksToUpdate.length)

    for (const track of tracksToUpdate) {
        
        try {
            const trackToUpdate = await TrackModel.findById(track._id)

            const newTrackData = await ScrapAction({ link: track.link })

            // Save the history (old track info)
            const trackHistory = {
                user: track.user,
                trackId: track._id,
                title: track.title,
                views: track.views,
                favs: track.favs,
                price: track.price,
                delivery: track.delivery,
                deliveryInfo: track.deliveryInfo,
                location: track.location,
                description: track.description,
                sold: track.sold,
                reserved: track.reserved,
                updateDate: track.updateDate,
            }

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
