import authJwt from '../middlewares/authJwt.js'
import details from '../controllers/users/users.details.controller.js'
import publicDetails from '../controllers/users/users.publicDetails.controller.js'
import edit from '../controllers/users/users.edit.controller.js'
import createCheckoutSession from '../controllers/users/users.createCheckoutSession.controller.js'
import webhooks from './../components/stripe/webhooks.js'

import changeTrackUpdatePreference from '../controllers/users/users.changeTrackUpdatePreference.controller.js'

import express from 'express'

const router = express.Router()

router.get('/:id', [authJwt.verifyUserAndToken], details)

router.put('/edit/:id', [authJwt.verifyUserAndToken], edit)

router.post('/create-checkout-session/:id', [authJwt.verifyUserAndToken], createCheckoutSession)
router.post('/webhook', webhooks)

router.put('/track-update-preference', [authJwt.verifyUserAndToken], changeTrackUpdatePreference)

// Public endpoints
router.put('/public/:username', publicDetails)

export default router
