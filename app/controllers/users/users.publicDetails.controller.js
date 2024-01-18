import UserPublicDetailsService from '../../services/users/users.publicDetails.service.js'
import Utils from '../../utils/index.js'

export default async function publicDetails (req, res, next) {
    
    let errors = Utils.validateRequest(req, ({ params }) => {
        params('username').isString().required()
    })

    if (errors) next(errors)

    const username = req.params.username

    const userId = req.body.userId

    const user = await UserPublicDetailsService({ username, userId })
    res.status(200).send(user)
}
  