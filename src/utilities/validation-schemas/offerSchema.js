const Joi = require('joi');

const offerSchema = Joi.object({
    name:Joi.string().lowercase().required(),
    isDeleted:Joi.boolean(),
    createdBy:Joi.string(),
    updatedBy:Joi.string()
})

module.exports = offerSchema;