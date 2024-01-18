import UserDetailsService from './../../services/users/users.details.service.js'
import VError from 'verror'

export default async function details (req, res) {
    
    if (!req.params.id) {
        throw VError('User ID is missing')
    }

    const userId = req.params.id

    const user = await UserDetailsService({ id: userId })
    res.status(200).send(user)
}
  