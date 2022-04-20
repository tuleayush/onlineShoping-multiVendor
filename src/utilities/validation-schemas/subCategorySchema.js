const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

const subCategorySchema = Joi.object({
  name: Joi.string().required(),
  // catId: Joi.objectId(),
  catId: Joi.array(),
  isDeleted: Joi.boolean(),
  createdBy: Joi.string(),
  updatedBy: Joi.string()
})

module.exports = subCategorySchema;