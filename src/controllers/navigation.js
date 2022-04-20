const Navigation = require("../models/Navigation");
const Role = require("../models/Role");
const { UserRoles } = require("../utilities/constants/user");
const resS = require('../utilities/sendFormat');

module.exports = {

  get: async (req, res, next) => {
    try {
      const query = { isDeleted: false };

      if (req.user?.role?.key !== UserRoles.admin) {
        const allowedNavs = await Role.distinct('permission.navs', { _id: req.user?.role?._id });
        query._id = { $in: allowedNavs };
      }

      const data = await Navigation.find(query, { title: 1, path: 1, icon: 1, type: 1, badgeType: 1, children: 1 }).sort({ order: 1 });
      return resS.send(res, 'Fetched', data);
    }
    catch (error) {
      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  },

};