import Utils from '../../utils/index.js'

import SignupService from '../../services/users/auth/users.signup.service.js'

export default async function signup (req, res, next) {
  try {
    let errors = Utils.validateRequest(req, ({ body }) => {
      body('email').isString().required()
      body('username').isString().required()
      body('password').isString().required()
    })

    if (errors) next(errors)

    const userData = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    }

    await SignupService({ userData })

    res.send({ message: 'User register request is ongoing, use the code in your email to finish the process!' })
  } catch (err) {
    res.status(500).send({ message: err.message })
  }
}