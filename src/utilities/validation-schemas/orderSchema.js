const Joi = require('joi');

const authSchema = Joi.object({
    cartId: Joi.array().required(),
    fromAddress: Joi.object().required(),
    toAddress: Joi.object().required(),
    paymentId: Joi.required(),
    paymentMode: Joi.string().required(),
    paymentStatus:Joi.string().required(),
    totalAmount:Joi.string().required(),
    isDeleted:Joi.boolean()
})

module.exports = authSchema;