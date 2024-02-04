import checkoutCompletedService from './../../services/users/payments/users.checkoutCompleted.service.js'

export default async function webhooks (req, res, next) {
  try {
    const payload = req.body

    const event = payload.type
    const eventObject = payload.data.object

    console.log("Got payload: " + payload)

    switch(event) {
        case 'checkout.session.completed':
            await checkoutCompletedService({ eventObject })
            res.status(200).end()
        default:
            res.status(200).end()
    }
  } catch (err) {
    res.status(500).send({ message: err.message })
  }
}