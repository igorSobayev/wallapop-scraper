import VError from 'verror'

import shared from './../../config/shared.js'

import UserModel from '../../repository/users/user.model.js'
import TrackModel from '../../repository/tracks/track.model.js'

import ScrapAction from './actions/tracks.scrap.action.js'
import GenerateTagAction from './actions/tracks.generateTag.action.js'

export default async function upload({ userId, tracks }) {
    if (!userId) {
        throw VError('userId is missing on upload track elements')
    }

    if (!tracks || !tracks.length) {
        throw VError('tracks are missing')
    }

    const user = await UserModel.findOne({ _id: userId })

    if (!user && user.deleted) {
        throw VError('User is missing or deleted')
    }

    const tracksToInsert = []

    for (const track of tracks) {
        // First check if track already exist TODO if deleted, enable it again
        const existTrack = await TrackModel.findOne({ user: userId, link: track })

        if (existTrack) continue

        // Get the data from the web
        try {
            const scrapedTrack = await ScrapAction({ link: track })

            if (scrapedTrack.deletedFromPlatform) {
                console.log('TRACK DELETED FROM PLATFORM:', track)
                continue
            }

            scrapedTrack.user = userId
            scrapedTrack.tag = GenerateTagAction()
            scrapedTrack.platform = shared.AVAILABLE_PLATFORMS.WALLAPOP
            scrapedTrack.link = track
            scrapedTrack.updateDate = new Date()
            scrapedTrack.creationDate = new Date()

            tracksToInsert.push(scrapedTrack)
        } catch (e) {
            console.log(e)
            continue
        }
    }

    // Check if there is tracks to insert
    if (!tracksToInsert.length || tracksToInsert.length === 0) return

    // Insert many tracks
    await TrackModel.insertMany(tracksToInsert)
}
