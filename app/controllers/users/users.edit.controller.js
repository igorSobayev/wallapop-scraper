import Utils from './../../utils/index.js'
import UserEditService from './../../services/users/users.edit.service.js'

export default async function edit (req, res) {
  try {
    let errors = Utils.validateRequest(req, ({ query }) => {
      query('name').isString()
      query('surname').isString()
    })

    if (errors) next(errors)

    const userData = {
      id: req.body.id,
    }
    
    await UserEditService({ userId: req.userId, userData })

    res.send({ message: 'User was updated successfully!' })
  } catch (err) {
    res.status(500).send({ message: err.message })
  }
}