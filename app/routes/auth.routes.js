import verifySignUp from '../middlewares/verifySignUp.js'
import authJwt from '../middlewares/authJwt.js'
import signup from '../controllers/users/users.signup.controller.js'
import signupCode from '../controllers/users/users.signupCode.controller.js'
import signin from '../controllers/users/users.signin.controller.js'
import signout from '../controllers/users/users.signout.controller.js'
import changePassword from '../controllers/users/users.changePassword.controller.js'
import forgotPassword from '../controllers/users/users.forgotPassword.controller.js'
import resetPassword from '../controllers/users/users.resetPassword.controller.js'

import express from 'express'
const router = express.Router()

router.post('/signup', [verifySignUp.checkDuplicateUsernameOrEmail], signup)
router.get('/signup/verify', signupCode)
router.post('/signin', signin)
router.post('/signout', signout)

router.post('/change-password', [authJwt.verifyUserAndToken], changePassword)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)

export default router
