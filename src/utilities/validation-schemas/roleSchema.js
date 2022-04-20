const Joi = require('joi');

const roleSchema = Joi.object({
    key: Joi.string().lowercase().required(),
    name:Joi.string().required(),
    isDeleted:Joi.boolean(),
    createdBy:Joi.string(),
    updatedBy:Joi.string()
})

module.exports = roleSchema; 