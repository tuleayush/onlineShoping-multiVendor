const Joi = require('joi');

const influencersSchema = Joi.object({
  name:Joi.string().required(),
  email:Joi.string().required(),
  primarySocialMedia:Joi.string().allow('').allow(null),  
  secondarySocialMedia:Joi.string().allow('').allow(null),
  primaryCategory:Joi.string().allow('').allow(null),
  secondarycategory:Joi.string().allow('').allow(null),
  aboutUs:Joi.string().allow('').allow(null),
  instagramUsername:Joi.string().allow('').allow(null)
},{timestamps:true})


module.exports = influencersSchema;