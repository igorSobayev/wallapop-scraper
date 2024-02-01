import VError from 'verror'
import Stripe from 'stripe'

import UserModel from '../../../repository/users/user.model.js'

const stripe = new Stripe(process.env.STRIPE_KEY)

export default async function createCheckoutSession ({ userId, plans }) {
    if (!userId) {
        throw VError('userId is missing')
    }

    const user = await UserModel.findOne({ _id: userId, deleted: false })

    if (!user) {
        throw VError(`User with ID ${userId} not exist or is deleted`)
    }

    const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
            price: '{{PRICE_ID}}',
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${YOUR_DOMAIN}/success.html`,
        cancel_url: `${YOUR_DOMAIN}/cancel.html`,
    })

}
