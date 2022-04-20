const createError = require("http-errors");
const StaticPage = require("../models/StaticPage");
// const cartSchema = require('../utilities/validation-schemas/cartSchema');
const resS = require('../utilities/sendFormat');

module.exports = {

  GetByKey: async (req, res, next) => {
    try {
      const { key } = req.params;
      if (!key) throw createError.NotFound(`Bad Request`);

      const data = await StaticPage.findOne({ isDeleted: false, key }, {});

      if (!data)
        return resS.sendError(res, 404, 'No Data Found', { params: req.params });

      return resS.send(res, 'Fetched', data);
    }
    catch (error) {
      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  },

  // Update Static Page
  UpdateByKey: async (req, res, next) => {
    try {
      const { key } = req.params;
      const { text } = req.body;
      if (!key) throw createError.NotFound(`Key Not Found`);
      if (!text) throw createError.NotFound(`Text Not Found`);

      const data = await StaticPage.findOneAndUpdate({ key }, { $set: { text } });
      return res.status(200).send({});

    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error);
    }
  },

}