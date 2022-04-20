const Joi = require('joi');

const userSchema = Joi.object({
    fullName: Joi.string(),
    email: Joi.string().email().lowercase().required().error(new Error('Email is Required')),
    password: Joi.string().required().error(new Error('Password is Required')),
    address: Joi.string(),
    phone:Joi.string()
});

const authSchema = Joi.object({
    email: Joi.string().email().lowercase().required().error(new Error('Email is Required')),
    password: Joi.string().required().error(new Error('Password is Required')),
});

module.exports = {userSchema,authSchema};