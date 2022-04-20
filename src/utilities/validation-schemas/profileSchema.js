const Joi = require('joi');

const profileSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required(),
    phone:Joi.string().required(),
    image:Joi.string().allow('').allow(null),
    storeName:Joi.string().allow('').allow(null),
    address:Joi.string().allow('').allow(null),
    website:Joi.string().allow('').allow(null),
    social:Joi.string().allow('').allow(null),
    additionalNotes:Joi.string().allow('').allow(null),
    packageId:Joi.string().allow('').allow(null),
    businessName:Joi.string().allow('').allow(null),
    businessAddress:Joi.string().allow('').allow(null),
    registeredBusinessNumber:Joi.string().allow('').allow(null),
    termsAndCondition: Joi.boolean().allow('').allow(null)
})

module.exports = profileSchema;