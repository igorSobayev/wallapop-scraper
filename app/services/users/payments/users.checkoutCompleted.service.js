import VError from 'verror'

import UserModel from '../../../repository/users/user.model.js'

export default async function createCheckoutSession ({ eventObject }) {
  if (!eventObject) {
    throw VError('eventObject is missing')
  }

  const user = await UserModel.findOne({ customerId: eventObject.customer })

  if (!user) {
    throw VError(`User with customerId ${eventObject.customer} not exist`)
  }

  user.plan = eventObject.metadata.plan

  await user.save()

  return
}
