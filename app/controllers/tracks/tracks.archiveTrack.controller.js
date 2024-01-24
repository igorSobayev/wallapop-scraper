import Utils from '../../utils/index.js'

import ArchiveTrackServic from '../../services/tracks/tracks.archiveTrack.service.js'

export default async function archiveTrack (req, res, next) {
  try {
    let errors = Utils.validateRequest(req, ({ params, body }) => {
      body('userId').isString().required()
      params('id').isString().required()
    })

    if (errors) next(errors)

    await ArchiveTrackServic({ userId: req.userId, trackId: req.params.id })

    res.send({ message: 'Tracks was archived successfully!' })
  } catch (err) {
    res.status(500).send({ message: err.message })
  }
}