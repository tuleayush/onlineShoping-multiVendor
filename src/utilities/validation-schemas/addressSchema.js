const Joi = require('joi');

const addressSchema = Joi.object({
    addressType: Joi.string().required(),
    address1: Joi.string().required(),
    address2: Joi.string().required(),
    state: Joi.string().required(),
    city: Joi.string(),
    pincode: Joi.string(),
    createdBy: Joi.string(),
    updatedBy: Joi.string()
})

module.exports = addressSchema; 