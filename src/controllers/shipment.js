const createError = require("http-errors");
const Shipment = require("../models/Shipment");
// const cartSchema = require('../utilities/validation-schemas/cartSchema');
const resS = require('../utilities/sendFormat');

module.exports = {

  create: async (req, res, next) => {
    try {
      // const result = await cartSchema.validateAsync(req.body);
      req.body.createdBy = req?.user?._id || null;
      req.body.updatedBy = req?.user?._id || null;
      await Shipment.create(req.body);
      return resS.send(res, 'Created', {});
    }
    catch (error) {
      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  },

  get: async (req, res, next) => {
    try {
      const data = await Shipment.find({ isDeleted: false }, { name: 1, type: 1, value: 1 });
      console.log('Shp??',data)
      return resS.send(res, 'Fetched', data);
    }
    catch (error) {
      console.error('Something went wrong while fetching shipment details:',error)
      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  },

  // Update
  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!id) throw createError.NotFound(`Bad Request`);

      const { name, type, value } = req.body;
      if (!name || !type) throw createError.NotFound(`Please provide shipment details`);

      const data = await Shipment.findOneAndUpdate(
        { _id: id },
        { $set: { name, type, value, updatedBy: req?.user?._id || null } },
        { new: true }
      );

      return resS.send(res, 'Updated', data);
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

      const data = await Shipment.findOneAndUpdate({ _id: id }, { $set: { isDeleted: true } });
      return resS.send(res, 'Updated', data);
    }
    catch (error) {
      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  }

}