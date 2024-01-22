import Utils from '../../utils/index.js'

import UpdateUserTracksInfoService from '../../services/tracks/tracks.updateUserTracksInfo.service.js'

export default async function updateUserTracksInfo (req, res, next) {
  try {
    let errors = Utils.validateRequest(req, ({ query, body }) => {
      body('userId').isString().required()
    })

    if (errors) next(errors)

    await UpdateUserTracksInfoService({ userId: req.body.userId })

    res.send({ message: `Tracks for user ${req.body.userId} was update successfully!` })
  } catch (err) {
    res.status(500).send({ message: err.message })
  }
}