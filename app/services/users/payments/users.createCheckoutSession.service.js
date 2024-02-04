import VError from 'verror'
import Stripe from './../../../components/stripe/index.js'

import shared from './../../../config/shared.js'

import UserModel from '../../../repository/users/user.model.js'

export default async function createCheckoutSession ({ userId, plan, returnPage, succeededPage }) {
    if (!userId) {
      throw VError('userId is missing')
    }

    if (!Object.values(shared.PLANS).includes(plan)) {
      throw VError(`The plan ${plan} is not valid`)
    }

    const user = await UserModel.findOne({ _id: userId, deleted: false })

    if (!user) {
      throw VError(`User with ID ${userId} not exist or is deleted`)
    }

    const session = await Stripe.createCheckoutSession({ plan, user, returnPage, succeededPage })

    return session
}
