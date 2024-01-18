import shared from '../config/shared.js'
import User from './../repository/users/user.model.js'

export const checkDuplicateUsernameOrEmail = async (req, res, next) => {
  try {
    const existingUsernameUser = await User.findOne({ username: req.body.username })
    if (existingUsernameUser) {
      return res.status(400).send({ message: 'Failed! Username is already in use!' })
    }

    const existingEmailUser = await User.findOne({ email: req.body.email })
    if (existingEmailUser) {
      return res.status(400).send({ message: 'Failed! Email is already in use!' })
    }

    next()
  } catch (err) {
    res.status(500).send({ message: err.message })
  }
}

export const checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (const role of req.body.roles) {
      if (!shared.config.ROLES.includes(role)) {
        return res.status(400).send({ message: `Failed! Role ${role} does not exist!` })
      }
    }
  }

  next()
}

const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted,
}

export default verifySignUp
