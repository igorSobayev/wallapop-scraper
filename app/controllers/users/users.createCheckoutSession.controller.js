import Utils from './../../utils/index.js'
import UserResetPasswordService from './../../services/users/users.resetPassword.service.js'

export default async function createCheckoutSession (req, res) {
    try {
      let errors = Utils.validateRequest(req, ({ body, params }) => {
        body('plans').required()
        params('id').isString().required()
      })

      if (errors) next(errors)

      await UserResetPasswordService(resetPasswordInfo)

      return res.status(200).send({ message: 'Password updated' })
    } catch (err) {
      res.status(500).send({ message: err.message })
    }
  }