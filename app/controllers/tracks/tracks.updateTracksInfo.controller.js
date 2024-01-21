import Utils from '../../utils/index.js'

import shared from './../../config/shared.js'

import UpdateTracksService from './../../services/tracks/tracks.updateTracks.service.js'

export default async function updateTracksInfo (req, res, next) {
  try {
    let errors = Utils.validateRequest(req, ({ query, body }) => {
      body('userId').isString().required()
    })

    if (errors) next(errors)

    await UpdateTracksService({ trackUpdatePreference: shared.PLANS_CONFIG.DAILY }) // TODO que coja el del usuario 

    res.send({ message: 'Tracks was update successfully!' })
  } catch (err) {
    res.status(500).send({ message: err.message })
  }
}