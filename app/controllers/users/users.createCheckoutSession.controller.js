import Utils from './../../utils/index.js'
import CreateCheckoutSessionService from '../../services/users/payments/users.createCheckoutSession.service.js'

export default async function createCheckoutSession (req, res, next) {
    try {
      let errors = Utils.validateRequest(req, ({ body, params }) => {
        body('plan').required()
        body('returnPage').required()
        body('succeededPage').required()
        params('id').isString().required()
      })

      if (errors) next(errors)

      const { plan, returnPage, succeededPage } = req.body

      const session = await CreateCheckoutSessionService({ userId: req.params.id, plan, returnPage, succeededPage })

      return res.status(200).send(session)
    } catch (err) {
      res.status(500).send({ message: err.message })
    }
  }