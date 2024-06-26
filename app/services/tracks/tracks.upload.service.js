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

    const maxTracks = shared.PLANS_DETAILS[user.plan].MAX_TRACKS

    if (user.tracksCounter >= maxTracks) {
        throw VError({ name: 'MaxTracksReachedError' }, `You cant add more tracks with your plan`)
    }

    const tracksToInsert = []
    let tracksToInsertCount = 0

    for (const track of tracks) {
        const existTrack = await TrackModel.findOne({ user: userId, link: track })

        // If the user tracks count is already reached, leave
        if ((user.tracksCounter + tracksToInsertCount) >= maxTracks) {
            continue
        }

        if (existTrack) {
            existTrack.deleted = false
            existTrack.archived = false
            await existTrack.save()

            tracksToInsertCount++

            continue
        }

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

            tracksToInsertCount++
        } catch (e) {
            console.log(e)
            continue
        }
    }

    // Update the user track counter
    if (tracksToInsertCount > 0) {
        user.tracksCounter += tracksToInsertCount

        await user.save()
    }
    
    // Check if there is tracks to insert
    if (!tracksToInsert.length || tracksToInsert.length === 0) return

    // Insert many tracks
    await TrackModel.insertMany(tracksToInsert)
}
