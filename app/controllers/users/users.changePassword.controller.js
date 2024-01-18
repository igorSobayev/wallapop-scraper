import Utils from './../../utils/index.js'
import UserChangePasswordService from './../../services/users/users.changePassword.service.js'

export default async function changePassword (req, res) {
    try {
      let errors = Utils.validateRequest(req, ({ body }) => {
        body('actualPassword').isString().required()
        body('newPassword').isString().required()
        body('userId').isString().required()
      })

      if (errors) next(errors)

      const changePasswordInfo = {
        actualPassword: req.body.actualPassword,
        newPassword: req.body.newPassword,
        userId: req.body.userId
      }

      await UserChangePasswordService(changePasswordInfo)

      return res.status(200).send({ message: 'Password updated' })
    } catch (err) {
      res.status(500).send({ message: err.message })
    }
  }