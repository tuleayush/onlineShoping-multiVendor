const createError = require("http-errors");
const Color = require("../models/Color");
// const cartSchema = require('../utilities/validation-schemas/cartSchema');
const resS = require('../utilities/sendFormat');

module.exports = {

  create: async (req, res, next) => {
    try {
      // const result = await cartSchema.validateAsync(req.body);
      req.body.createdBy = req?.user?._id || null;
      req.body.updatedBy = req?.user?._id || null;
      await Color.create(req.body);
      return resS.send(res, 'Created', {});
    }
    catch (error) {
      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  },

  get: async (req, res, next) => {
    try {
      const data = await Color.find({ isDeleted: false }, { name: 1, code: 1 }).sort('name');
      return resS.send(res, 'Fetched', data);
    }
    catch (error) {
      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  },

  // Delete By Id
  delete: async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!id) throw createError.NotFound(`Bad Request`);

      const data = await Color.findOneAndUpdate({ _id: id }, { $set: { isDeleted: true } });
      return resS.send(res, 'Updated', data);
    }
    catch (error) {
      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  }

}