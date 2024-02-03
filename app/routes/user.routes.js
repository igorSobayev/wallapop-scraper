import authJwt from '../middlewares/authJwt.js'
import details from '../controllers/users/users.details.controller.js'
import publicDetails from '../controllers/users/users.publicDetails.controller.js'
import edit from '../controllers/users/users.edit.controller.js'
import uploadFile from '../controllers/users/users.uploadFile.controller.js'
import uploadMultipleFiles from '../controllers/users/users.uploadMultipleFiles.controller.js'
import deleteFiles from '../controllers/users/users.deleteFiles.controller.js'
import createCheckoutSession from '../controllers/users/users.createCheckoutSession.controller.js'

import express from 'express'
import multer from 'multer'

const router = express.Router()

const uploader = multer({ dest: '/tmp' })

router.get('/:id', [authJwt.verifyUserAndToken], details)

router.put('/edit/:id', [authJwt.verifyUserAndToken], edit)
router.post('/upload-file/:id', [authJwt.verifyUserAndToken], uploader.single('file'), uploadFile)
router.post('/upload-multiple-files/:id', [authJwt.verifyUserAndToken], uploader.array('file[]'), uploadMultipleFiles)
router.post('/delete-files/:id', [authJwt.verifyUserAndToken], deleteFiles)

router.post('/create-checkout-session/:id', [authJwt.verifyUserAndToken], createCheckoutSession)

// Public endpoints
router.put('/public/:username', publicDetails)

export default router
