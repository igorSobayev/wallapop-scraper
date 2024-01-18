import fs from 'fs'
import VError from 'verror'
import aws from 'aws-sdk'

const bucketName = process.env.BUCKET_NAME

const VALID_BUCKETS = ['nautiluskitchen'] // Hard coded

aws.config.update({
  region: 'eu-west-3',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
})

var S3 = new aws.S3({region: 'eu-west-3'})

function _isValidBucket () {
  const validBuckets = VALID_BUCKETS

  if (!validBuckets.includes(bucketName)) {
    throw new VError({ name: 'InvalidBucketNameError', info: `Buchet ${bucketName} is invalid` })
  }
}

async function checkIfExists (key) {
  try {
    await getHeaders(key)
    return true
  } catch (err) {
    if (err.statusCode && err.statusCode === 404) return false
    if (err.statusCode && err.statusCode === 403) throw new VError.WError({ name: 'S3ForbbidenError' })
    throw err
  }
}

/**
 * Move the element into a new folder `deleted` in the same path.
 * @param {string} s3Key correspond with s3 key
 */
function moveDeletedFolder (s3Key) {
  const formedPath = generateDeletePath(s3Key)

  return _moveObject(s3Key, formedPath)
    .then(() => {
      return { newKey: formedPath }
    })
}

function generateDeletePath (key) {
  const splitPath = key.split('/')
  const splitLen = splitPath.length

  splitPath[splitLen - 1] = 'deleted/' + splitPath[splitLen - 1]
  // The formedPath has this format path/deleted/file.ext
  return splitPath.join('/')
}

/**
 * Move the element into a new path
 * @param {string} s3Key correspond with s3 key
 * @param {string} to new path to move this object
 */
function _moveObject (s3Key, to) {
  // copy source must be the entire path
  const copySource = `${bucketName}/${s3Key}`
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#copyObject-property
  // and https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#deleteObject-property
  return new Promise((resolve, reject) => {
    S3.copyObject({ Key: to, CopySource: copySource, Bucket: bucketName }, (err) => {
      if (err) return reject(err)

      S3.deleteObject({ Key: s3Key, Bucket: bucketName }, (err) => {
        if (err) return reject(err)
        return resolve()
      })
    })
  })
}

/**
 * Deletes multiple objects from S3.
 * See https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#deleteObjects-property.
 * "The request contains a list of up to 1000 keys that you want to delete."
 * @param {array} s3Keys an array of objects keys to delete
 * @returns {promise}
 */
function deleteObjects (s3Keys) {
  const Objects = s3Keys.map((s3Key) => ({ 'Key': s3Key }))

  return new Promise((resolve, reject) => {
    S3.deleteObjects({
      Bucket: bucketName,
      Delete: {
        Objects,
        Quiet: false,
      },
    }, (err, data) => err ? reject(err) : resolve(data))
  })
}

async function changeFileLocation (key, toFolder) {
  const splitPath = key.split('/')
  const fileName = splitPath[splitPath.length - 1]
  const formedPath = `${toFolder}/${fileName}`
  await _moveObject(key, formedPath)
  return formedPath
}

function listObjects (userId) {
  return new Promise((resolve, reject) => {
    S3.listObjects({
      Bucket: bucketName,
      Prefix: `licenses/${userId}`,
    }, function (err, data) {
      console.error('ERROR:', err)
      return resolve(data)
    })
  })
}

function getObject (key) {
  return new Promise(function (resolve, reject) {
    S3.getObject({
      Bucket: bucketName,
      Key: key,
    }, function (err, result) {
      if (err) return reject(err)
      return resolve(result)
    })
  })
}

/**
 * Upload file to s3
 * @param {string} targetPath name of the path of file in s3
 * @param {string} localPath local path from image to upload
 * @param {string} filetype type of file
 * @param {string} [acl] , private or public
 * @param {Object} [options] , extra options to upload s3 file
 * @param {Object} [options.metadata] , metadata options, the metadata keys have to be lowercase
 * @param {Number} [options.maxAge] , number of seconds the image will be cached
 * @param {Object} [bucket] s3 bucket name
 */
function upload (targetPath, localPath, filetype, acl = 'private', options = {}, bucket = bucketName) {
  return new Promise((resolve, reject) => {
    _isValidBucket(bucket)

    fs.readFile(localPath, (err, readed) => {
      if (err) return reject(err)

      const params = {
        Bucket: bucket,
        Key: targetPath,
        Body: readed,
        ContentType: filetype,
        ACL: acl,
        Metadata: options.metadata || undefined,
        CacheControl: options.maxAge ? `max-age=${options.maxAge}` : undefined,
      }

      S3.upload(params, function (err, data) {
        if (err) return reject(err)
        return resolve(data)
      })
    })
  })
}

/**
 * Upload binary/base64 content to S3
 * @param {string} targetPath Complete path with the file
 * @param {binary} binary Base64 content that will be uploaded
 * @param {string} filetype Mimetype
 * @param {string} [acl='private']
 * @param {object} options
 * @param {object} options.metadata
 * @returns {Promise}
 */
function uploadBinary (targetPath, binary, filetype, acl = 'private', options = {}) {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: bucketName,
      Key: targetPath,
      Body: Buffer.from(binary, 'base64'),
      ContentEncoding: 'base64',
      ContentType: filetype,
      ACL: acl,
      Metadata: options.metadata || undefined,
    }

    S3.putObject(params, function (err, data) {
      if (err) return reject(err)
      return resolve(data)
    })
  })
}

function getPublicUrl (key) {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: bucketName,
      Key: key,
    }

    S3.getSignedUrl('getObject', params, function (err, data) {
      if (err) return reject(err)
      return resolve(data.split('?')[0])
    })
  })
}

/**
 * This method returns the headers from s3 file
 * @param {string} key key of image in S3
 * @return {promise} promise.result object headers with metadata
 */
function getHeaders (key) {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: bucketName,
      Key: key,
    }

    S3.headObject(params, function (err, data) {
      if (err) return reject(err)
      return resolve(data)
    })
  })
}

/**
 * Get binary image from S3
 * @param {String} key
 * @returns {Base64}
 */
function getBinaryImage (key) {
  return new Promise((resolve, reject) => {
    S3.getObject({
      Bucket: bucketName,
      Key: key,
    }, function (err, result) {
      if (err) {
        throw err
      }
      return resolve(result?.Body?.toString('base64'))
    })
  })
}

export default {
  checkIfExists,
  moveDeletedFolder,
  deleteObjects,
  changeFileLocation,
  listObjects,
  getObject,
  upload,
  uploadBinary,
  getPublicUrl,
  getHeaders,
  getBinaryImage,
}
