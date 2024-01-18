import Utils from '../../utils/index.js'
import mongoose from 'mongoose'
import Filemanager from '../../components/filemanager.js'
import VError from 'verror'

export default async function uploadMultipleFiles (req, res) {
  let error = Utils.validateRequest(req, ({ query }) => {
    query('filesRoutes').isArray()
  })

  if (error) {
    return next(error)
  }

  const { filesRoutes } = req.body

  if (!filesRoutes) {
    throw new VError.WError({ name: 'FileToDeleteNotAttachedError' }, 'Files to delete not attached')
  }

  const deleteFilesPromises = []
  const fileNameStart = process.env.AWS_ENV
  
  filesRoutes.forEach(fileRoute => {
    const keyStars = fileRoute.indexOf(fileNameStart)
    const key = fileRoute.substring(keyStars)

    deleteFilesPromises.push(Filemanager.moveDeletedFolder(key))
  })

  try {
    const res = await Promise.allSettled(deleteFilesPromises)
  } catch (e) {
    console.error(e)
  }

  console.log(res)

  return res.json({ deleted: true })
}