const createError = require("http-errors");

const Option = require('../models/Option');
const resS = require('../utilities/sendFormat');


module.exports = {

  // Get All Options
  Get: async (req, res, next) => {
    try {
      const data = await Option.find({ isDeleted: false }, { type: 1, name: 1, order: 1 }).sort({ order: 1 });
      console.log('data',data)
      return resS.send(res, 'Fetched', data);
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  },
}