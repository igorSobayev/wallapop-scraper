import VError from 'verror'
import Stripe from 'stripe'

import shared from './../../config/shared.js'

const stripe = new Stripe(process.env.STRIPE_KEY)

async function createCheckoutSession ({ plan, user, returnPage, succeededPage }) {

    if (!Object.values(shared.PLANS).includes(plan)) {
        throw VError(`The plan ${plan} is not valid`)
    }
  

    const products = await  getProducts()

    const productPlan = products.data.filter(product => {
        return product.metadata.plan === plan
    })

    if (!productPlan.length) {
        throw VError(`The plan ${plan} not found in Stripe`)
    }

    // I am not proud of this :(
    if (!user.customerId) {
        const customer = await stripe.customers.create({
            name: user.username,
            email: user.email,
        })

        user.customerId = customer.id

        user.save()
    }


    const sessionData = {
        line_items: [
          {
            price: productPlan[0].default_price,
            quantity: 1,
          },
        ],
        metadata: {
            plan,
        },
        customer: user.customerId,
        mode: 'payment',
        success_url: succeededPage,
        cancel_url: returnPage,
    }

    const session = await stripe.checkout.sessions.create(sessionData)

    return session
}

async function getProducts () {
    const products = await stripe.products.list()

    return products
}

export default {
    createCheckoutSession,
}