import VError from 'verror'
import Stripe from 'stripe'

import shared from './../../config/shared.js'

const stripe = new Stripe(process.env.STRIPE_KEY)

async function createCheckoutSession (plan, customerId, returnPage) {

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

    const sessionData = {
        line_items: [
          {
            price: productPlan[0].default_price,
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.DOMAIN_URL}/success.html`, // TODO
        cancel_url: returnPage, // TODO
    }
  
    if (customerId) {
    sessionData.customer = customerId
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