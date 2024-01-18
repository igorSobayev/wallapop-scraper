import bcrypt from 'bcryptjs'
import User from './../../repository/users/user.model.js'
import config from './../../config/shared.js'

export default async function signup (req, res) {
  try {
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      role: config.ROLES.USER,
      creationDate: new Date(),
    })

    await user.save()

    res.send({ message: 'User was registered successfully!' })
  } catch (err) {
    res.status(500).send({ message: err.message })
  }
}