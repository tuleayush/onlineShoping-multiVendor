const Joi = require('joi');

const couponSchema = Joi.object({
  title: Joi.string().lowercase().required(),
  couponCode: Joi.string().required(),
  startDate:Joi.date().required(),
  endDate:Joi.date().required(),
  freeShipping:Joi.boolean().required(),
  quantity:Joi.string().required(),
  discountType:Joi.string().required(),
  status:Joi.string().required(),
  image:Joi.array().required(),
  createdBy:Joi.string(),
  updatedBy:Joi.string()
})

module.exports = couponSchema;