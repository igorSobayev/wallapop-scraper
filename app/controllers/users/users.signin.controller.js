import Utils from '../../utils/index.js'

import SigninService from '../../services/users/auth/users.signin.service.js'

export default async function signin (req, res) {
  try {
    let errors = Utils.validateRequest(req, ({ body }) => {
      body('email').isString().required()
      body('password').isString().required()
    })

    if (errors) next(errors)

    const { email, password } = req.body

    const user = await SigninService({ email, password })

    req.session.token = user.jwt_token

    res.status(200).send(user)
  } catch (err) {
    res.status(401).send({ name: err.name, message: err.message })
  }
}