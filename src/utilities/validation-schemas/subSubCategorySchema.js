const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

const subSubCategorySchema = Joi.object({
  name: Joi.string().required(),
  // catId: Joi.objectId(),
  // subCatId: Joi.objectId(),
  catId: Joi.array(),
  subCatId: Joi.array(),
  isDeleted: Joi.boolean(),
  createdBy: Joi.string(),
  updatedBy: Joi.string()
})

module.exports = subSubCategorySchema;