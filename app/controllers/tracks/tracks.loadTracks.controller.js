import Utils from '../../utils/index.js'

import LoadTracksService from './../../services/tracks/tracks.loadTracks.service.js'

export default async function loadTracks (req, res, next) {
  try {
    let errors = Utils.validateRequest(req, ({ params }) => {
      params('user').isString().required()
    })

    if (errors) next(errors)

    const tracks = await LoadTracksService({ userId: req.params.user })

    res.send(tracks)
  } catch (err) {
    res.status(500).send({ message: err.message })
  }
}