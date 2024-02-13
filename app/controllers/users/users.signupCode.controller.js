import Utils from '../../utils/index.js'
import SignupCodeService from '../../services/users/auth/users.signupCode.service.js'

export default async function signupCode (req, res) {
    try {
      let errors = Utils.validateRequest(req, ({ query }) => {
        query('username').isString().required()
        query('code').isString().required()
      })

      if (errors) next(errors)

      const { username, code } = req.query

      await SignupCodeService({ username, code })

      return res.status(200).send({ message: 'User verified successfully!' })
    } catch (err) {
      res.status(400).send({ name: err.name, message: err.message })
    }
  }
  