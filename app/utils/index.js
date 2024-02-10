import Validator from 'better-validator'
import VError from 'verror'
import crypto from 'crypto'

/**
 * Validates a request with the specified validation schema
 * @param {Request} request
 * @param {ValidateRequestCallback} validations function that expose to you the request object for your validations
 */
function validateRequest (request, validations) {
    let allowedFields = ['params', 'query', 'body', 'file']
    if (!request.file) request.file = undefined
    const validator = new Validator()
    validator(request).required().isObject(req => {
      const properties = allowedFields.reduce((accum, key) => {
        let propValidator
        req(key).isObject(validator => {
          propValidator = validator
        });
        accum[key] = propValidator
        return accum
      }, {})
  
      validations(properties)
    })
    let errors = validator.run()
    if (validator.run().length) return new VError.WError({name: 'FieldsValidationError', info: errors}, 'Fail validating fields')
}

function randomString (length) {
  if (length % 2 !== 0) {
    length++
  }

  return crypto.randomBytes(length / 2).toString("hex")
}

export default {
  validateRequest,
  randomString,
}