import Utils from '../../utils/index.js'
import mongoose from 'mongoose'
import Filemanager from '../../components/filemanager.js'
import VError from 'verror'

export default async function uploadMultipleFiles (req, res) {
  let error = Utils.validateRequest(req, ({ body }) => {
    body('path').required().isString()
  })

  if (error) {
    return next(error)
  }

  const { files } = req
  let path = req.body?.path

  if (!files) {
    throw new VError.WError({ name: 'FileNotAttachedError' }, 'Files to upload not attached')
  }

  // Normalise path url (can never star with "/")
  path = path[0] === '/' ? path.slice(1) : path

  path = `${process.env.AWS_ENV}/${req.params.id}/${path}`

  const uploadFilesPromises = []

  files.forEach(file => {
    const imageId = new mongoose.Types.ObjectId()
    const date = new Date()
    const fileDate = `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}_${date.getHours()}_${date.getMinutes()}`
    const fileName = `${path}/${imageId}_${fileDate}.${file.mimetype.split('/')[1]}`
    const options = {
      maxAge: 31536000,
    }
  
    uploadFilesPromises.push(Filemanager.upload(fileName, file.path, file.mimetype, 'public-read', options))
  })

  const uploadedImages = await Promise.all(uploadFilesPromises)

  return res.json({ uploadedImages })
}