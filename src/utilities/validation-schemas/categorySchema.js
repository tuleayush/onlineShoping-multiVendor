const Joi = require('joi');

const categorySchema = Joi.object({
    name: Joi.string().required(),
    // brand_id: Joi.array().required().messages({ "string.pattern.base": "Brand Id IS Compulsory" }),
    brand_id: Joi.array().items(Joi.string().required()).strict().required().messages({ "string.pattern.base": "Brand Id IS Compulsory" }),
    isDeleted: Joi.boolean(),
    createdBy: Joi.string(),
    updatedBy: Joi.string()
})

module.exports = categorySchema;