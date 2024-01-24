import Utils from '../../utils/index.js'

import DeleteTrackService from '../../services/tracks/tracks.deleteTrack.service.js'

export default async function deleteTrack (req, res, next) {
  try {
    let errors = Utils.validateRequest(req, ({ params, body }) => {
      body('userId').isString().required()
      params('id').isString().required()
    })

    if (errors) next(errors)

    await DeleteTrackService({ userId: req.userId, trackId: req.params.id })

    res.send({ message: 'Tracks was deleted successfully!' })
  } catch (err) {
    res.status(500).send({ message: err.message })
  }
}