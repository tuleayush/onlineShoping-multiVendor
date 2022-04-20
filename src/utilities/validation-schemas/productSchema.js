const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

const productSchema = Joi.object({
  catId: Joi.objectId(),
  subCatId: Joi.objectId(),
  // subSubCatId: Joi.objectId(),
  brandId: Joi.objectId(),
  name: Joi.string().required(),
  sku:Joi.string(),
  variants:Joi.array(),
  description:Joi.string(),
  castPrice: Joi.string().required(),
  sellingPrice: Joi.string().required(),
  // stock: Joi.string().required(),
  isDiscount:Joi.boolean(),
  discount: Joi.string(),
  image:Joi.array(),
  isDeleted:Joi.boolean(),
  createdBy:Joi.string(),
  updatedBy:Joi.string()
})

module.exports = productSchema;