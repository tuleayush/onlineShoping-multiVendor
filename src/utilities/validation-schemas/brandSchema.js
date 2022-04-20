const Joi = require('joi');

const brandSchema = Joi.object({
    name:Joi.string().required(),
    image:Joi.array(),
    isDeleted:Joi.boolean(),
    createdBy:Joi.string(),
    updatedBy:Joi.string()
})

module.exports = brandSchema;