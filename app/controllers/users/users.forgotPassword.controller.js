import Utils from '../../utils/index.js'
import UserForgotPasswordService from '../../services/users/users.forgotPassword.service.js'

export default async function forgotPassword (req, res) {
    let errors = Utils.validateRequest(req, ({ body }) => {
      body('email').isString().required()
    })

    if (errors) next(errors)

    const { email } = req.body

    await UserForgotPasswordService({ email })

    return res.status(200).send({ message: 'Password reset code send!' })
  }