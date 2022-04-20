const Joi = require('joi');

const roleSchema = Joi.object({
    product_id:Joi.required(),
    quantity:Joi.string().required(),
    status:Joi.string(),
    isDeleted:Joi.boolean(),
    createdBy:Joi.string(),
    updatedBy:Joi.string()
})

module.exports = roleSchema; 