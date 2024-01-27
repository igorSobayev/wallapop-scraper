import Utils from '../../utils/index.js'

import SyncTrackService from '../../services/tracks/tracks.syncTrack.service.js'

export default async function syncTrack (req, res, next) {
  try {
    let errors = Utils.validateRequest(req, ({ params, body }) => {
      body('userId').isString().required()
      params('id').isString().required()
    })

    if (errors) next(errors)

    await SyncTrackService({ userId: req.userId, trackId: req.params.id })

    res.send({ message: 'Tracks was sync successfully!' })
  } catch (err) {
    res.status(500).send({ message: err.message })
  }
}