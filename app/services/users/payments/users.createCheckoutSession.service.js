import VError from 'verror'
import Stripe from 'stripe'

import shared from './../../../config/shared.js'

import UserModel from '../../../repository/users/user.model.js'

const stripe = new Stripe(process.env.STRIPE_KEY)

export default async function createCheckoutSession ({ userId, plan }) {
    if (!userId) {
      throw VError('userId is missing')
    }

    if (!shared.PLANS.includes(plan)) {
      throw VError(`The plan ${plan} is not valid`)
    }

    const user = await UserModel.findOne({ _id: userId, deleted: false })

    if (!user) {
      throw VError(`User with ID ${userId} not exist or is deleted`)
    }

    const sessionData = {
      line_items: [
        {
          ...shared.PLANS_DETAILS[plan]
        },
      ],
      mode: 'payment',
      success_url: `${env.process.DOMAIN_URL}/success.html`,
      cancel_url: `${env.process.DOMAIN_URL}/cancel.html`,
    }

    if (user.customerId) {
      sessionData.customer = user.customerId
    }

    const session = await stripe.checkout.sessions.create(sessionData)

    return session
}
