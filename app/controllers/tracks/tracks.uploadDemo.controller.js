import Utils from '../../utils/index.js'

import UploadDemoService from '../../services/tracks/tracks.uploadDemo.service.js'

export default async function uploadDemo (req, res, next) {
  try {
    let errors = Utils.validateRequest(req, ({ body }) => {
      body('demoUrl').isString().required()
    })

    if (errors) next(errors)

    const track = await UploadDemoService({ demoUrl: req.body.demoUrl })

    res.send(track)
  } catch (err) {
    res.status(400).send({ name: err.name, message: err.message })
  }
}