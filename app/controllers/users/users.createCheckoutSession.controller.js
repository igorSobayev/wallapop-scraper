import Utils from './../../utils/index.js'
import CreateCheckoutSessionService from '../../services/users/payments/users.createCheckoutSession.service.js'

export default async function createCheckoutSession (req, res, next) {
    try {
      let errors = Utils.validateRequest(req, ({ body, params }) => {
        body('plan').required()
        body('returnPage').required()
        params('id').isString().required()
      })

      if (errors) next(errors)

      const session = await CreateCheckoutSessionService({ userId: req.params.id, plan: req.body.plan, returnPage: req.body.returnPage })

      return res.status(200).send(session)
    } catch (err) {
      res.status(500).send({ message: err.message })
    }
  }