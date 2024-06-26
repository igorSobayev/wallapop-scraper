// Middlewares
import authJwt from '../middlewares/authJwt.js'

// Controllers
import upload from '../controllers/tracks/tracks.upload.controller.js'
import loadTracks from '../controllers/tracks/tracks.loadTracks.controller.js'
import updateUserTracksInfo from '../controllers/tracks/tracks.updateUserTracksInfo.controller.js'
import deleteTrack from '../controllers/tracks/tracks.deleteTrack.controller.js'
import archiveTrack from '../controllers/tracks/tracks.archiveTrack.controller.js'
import syncTrack from '../controllers/tracks/tracks.syncTrack.controller.js'

import uploadDemo from '../controllers/tracks/tracks.uploadDemo.controller.js'


// Others
import express from 'express'

const router = express.Router()

router.get('/all/:user', [authJwt.verifyUserAndToken], loadTracks)
router.post('/upload', [authJwt.verifyUserAndToken], upload)
router.post('/update-user-tracks-info', [authJwt.verifyUserAndToken], updateUserTracksInfo)
router.delete('/delete/:id', [authJwt.verifyUserAndToken], deleteTrack)
router.put('/archive/:id', [authJwt.verifyUserAndToken], archiveTrack)
router.put('/sync-track/:id', [authJwt.verifyUserAndToken], syncTrack)

// Public
router.post('/upload-demo', uploadDemo)

export default router
