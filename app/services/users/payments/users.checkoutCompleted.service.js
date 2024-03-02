import VError from 'verror'

import Mailer from '../../../components/mailer/index.js'

import UserModel from '../../../repository/users/user.model.js'

export default async function checkoutCompleted ({ eventObject }) {
  if (!eventObject) {
    throw VError('eventObject is missing')
  }

  const user = await UserModel.findOne({ customerId: eventObject.customer })

  if (!user) {
    throw VError(`User with customerId ${eventObject.customer} not exist`)
  }

  user.plan = eventObject.metadata.plan

  try {
    const info = {
      user,
    }
    await Mailer.sendEmail({ templateName: 'PAYMENT_CONFIRM', info })
  } catch (error) {
    console.log(error)
  }

  await user.save()

  return
}
