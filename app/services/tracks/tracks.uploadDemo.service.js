import VError from 'verror'

import shared from '../../config/shared.js'

import TrackModel from '../../repository/tracks/track.model.js'

import ScrapAction from './actions/tracks.scrap.action.js'
import GenerateTagAction from './actions/tracks.generateTag.action.js'

export default async function uploadDemo ({ demoUrl }) {
    if (!demoUrl) {
        throw VError('demoUrl are missing')
    }


    // First check if track already exist TODO if deleted, enable it again
    const existTrack = await TrackModel.findOne({ link: demoUrl })

    if (existTrack) {
        existTrack.deleted = false
        existTrack.archived = false

        return existTrack
    }

    // Get the data from the web
    try {
        const scrapedTrack = await ScrapAction({ link: demoUrl })

        if (scrapedTrack.deletedFromPlatform) {
            throw VError({ name: 'DemoProductDeletedError' }, `The product ${demoUrl} is deleted from the platform`)
        }

        scrapedTrack.tag = GenerateTagAction()
        scrapedTrack.platform = shared.AVAILABLE_PLATFORMS.WALLAPOP
        scrapedTrack.link = demoUrl
        scrapedTrack.updateDate = new Date()
        scrapedTrack.creationDate = new Date()

        return scrapedTrack
    } catch (e) {
        throw VError(e)
    }
}
