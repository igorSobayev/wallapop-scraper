import config from '../../config/auth.config.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../../repository/users/user.model.js'

export default async function signin (req, res) {
    try {
      const user = await User.findOne({ email: req.body.email })
  
      if (!user) {
        return res.status(404).send({ message: 'User Not found.' })
      }
  
      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      )
  
      if (!passwordIsValid) {
        return res.status(401).send({ message: 'Invalid Password!' })
      }
  
      const token = jwt.sign({ id: user.id }, config.secret, {
        algorithm: 'HS256',
        allowInsecureKeySizes: true,
        expiresIn: 31536000, // 1 year
      })
  
      req.session.token = token

      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        plan: user.plan,
        trackUpdatePreference: user.trackUpdatePreference,
        jwt_token: token
      })
    } catch (err) {
      res.status(500).send({ message: err.message })
    }
  }