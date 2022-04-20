const Joi = require('joi')

const storeSchema = Joi.object({
  catId: Joi.array(),
  storeName: Joi.string().required(),
  images: Joi.array(),
  // firstName: Joi.string().required(),
  // lastName: Joi.string(),
  // addressLine1: Joi.string().required(),
  // addressLine2: Joi.string(),
  description: Joi.string().allow('').allow(null),
  // city: Joi.string().required(),
  // country: Joi.string().required(),
  // state: Joi.string().required(),
  // pincode: Joi.string().required(),
  // website: Joi.string().allow('').allow(null),
  // isRegistered: Joi.boolean(), 
  isDeleted:Joi.boolean(),
  createdBy:Joi.string(),
  updatedBy:Joi.string()
})

module.exports = storeSchema;