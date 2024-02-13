import VError from 'verror'
import jwt from 'jsonwebtoken'

import config from '../../../../config/auth.config.js'

export default function generateToken ({ userId }) {
    if (!userId) {
        throw VError('userId is missing')
    }

    const token = jwt.sign({ id: userId }, config.secret, {
      algorithm: 'HS256',
      allowInsecureKeySizes: true,
      expiresIn: 31536000, // 1 year
    })

    return token
}
