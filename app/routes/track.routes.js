// Middlewares
import authJwt from '../middlewares/authJwt.js'

// Controllers
import upload from '../controllers/tracks/tracks.upload.controller.js'

// Others
import express from 'express'

const router = express.Router()

// router.get('/all/:user', [authJwt.verifyUserAndToken], deleteFiles)
router.post('/upload', [authJwt.verifyUserAndToken], upload)

export default router
