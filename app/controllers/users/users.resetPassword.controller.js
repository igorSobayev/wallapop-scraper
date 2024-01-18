import Utils from './../../utils/index.js'
import UserResetPasswordService from './../../services/users/users.resetPassword.service.js'

export default async function resetPassword (req, res) {
    try {
      let errors = Utils.validateRequest(req, ({ body }) => {
        body('newPassword').isString().required()
        body('email').isString().required()
        body('resetCode').isString().required()
      })

      if (errors) next(errors)

      const resetPasswordInfo = {
        newPassword: req.body.newPassword,
        email: req.body.email,
        resetCode: req.body.resetCode,
      }

      await UserResetPasswordService(resetPasswordInfo)

      return res.status(200).send({ message: 'Password updated' })
    } catch (err) {
      res.status(500).send({ message: err.message })
    }
  }