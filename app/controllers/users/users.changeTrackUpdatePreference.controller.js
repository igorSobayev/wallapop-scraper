import Utils from '../../utils/index.js'
import changeTrackUpdatePreferenceService from '../../services/users/users.changeTrackUpdatePreference.service.js'

export default async function changeTrackUpdatePreference (req, res, next) {
  try {
    let errors = Utils.validateRequest(req, ({ body }) => {
      body('userId').required().isString()
      body('trackUpdatePreference').required().isString()
    })

    if (errors) next(errors)

    const response = await changeTrackUpdatePreferenceService({ userId: req.body.userId, trackUpdatePreference :req.body.trackUpdatePreference })

    res.status(200).send(response)
  } catch (err) {
    res.status(500).send({ message: err.message })
  }
}