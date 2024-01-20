import Utils from '../../utils/index.js'

import TrackUploadService from './../../services/tracks/tracks.upload.service.js'

export default async function upload (req, res, next) {
  try {
    let errors = Utils.validateRequest(req, ({ query, body }) => {
      body('userId').isString().required()
    })

    if (errors) next(errors)

    await TrackUploadService({ userId: req.userId, tracks: req.body.tracks })

    res.send({ message: 'Tracks was uploaded successfully!' })
  } catch (err) {
    res.status(500).send({ message: err.message })
  }
}