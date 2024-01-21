// Middlewares
import authJwt from '../middlewares/authJwt.js'

// Controllers
import upload from '../controllers/tracks/tracks.upload.controller.js'
import loadTracks from '../controllers/tracks/tracks.loadTracks.controller.js'


// Others
import express from 'express'

const router = express.Router()

router.get('/all/:user', [authJwt.verifyUserAndToken], loadTracks)
router.post('/upload', [authJwt.verifyUserAndToken], upload)

export default router
