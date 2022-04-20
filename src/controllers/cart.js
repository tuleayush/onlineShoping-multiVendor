const createError = require("http-errors");
const Cart = require("../models/Cart");
const cartSchema = require('../utilities/validation-schemas/cartSchema');

module.exports = {
  //Add New Cart
  create: async (req, res, next) => {
    try {
      const result = await cartSchema.validateAsync(req.body);
      const cart = new Cart({...result,createdBy:req.payload.aud});
      const newCart = await cart.save();
      res.status(200).send(newCart);

    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error);
    }
  },

  // Get All Cart
  get: async (req, res, next) => {
    try {
      const data = await Cart.find({createdBy:req.payload.aud,isDeleted: false });
      res.status(200).send(data);

    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error);
    }
  },

  // Get Cart By Id
  getById: async (req, res, next) => {
    try {
      const {id } = req.params
      if (!id) throw createError.NotFound(`Cart Id Not Found`);
      const data = await Cart.findOne({ _id:id, isDeleted: false });
      res.status(200).send(data);

    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error);
    }
  },

  // Update Cart
  update: async (req, res, next) => {
    try {
      const {id} = req.params
      if (!id) throw createError.NotFound(`Cart Id Not Found`);
      const result = await cartSchema.validateAsync(req.body);
      const data = await Cart.findOneAndUpdate({ _id: id }, {...result,updatedBy:req.payload.aud});
      res.status(200).send(data);

    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error);
    }
  },


  // Delete Cart By Id
  delete: async (req, res, next) => {
    try {
      const { id } = req.params
      if (!id) throw createError.NotFound(`Cart Id Not Found`);
      const data = await Cart.findByIdAndDelete({ _id: id });
      res.status(200).send(data);

    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error);
    }
  }

}