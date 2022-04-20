const User = require("../models/User");
const Product = require("../models/Product");
const Vendor = require("../models/Vendor");
const Order = require("../models/Order");
const { UserRoles } = require("../utilities/constants/user");
// const cartSchema = require('../utilities/validation-schemas/cartSchema');
const resS = require('../utilities/sendFormat');

module.exports = {

  get: async (req, res, next) => {
    try {
      // TABS
      let users = await User.aggregate([
        { $match: { isDeleted: false } },
        { $project: { _id: 0, role: 1 } },
        {
          $lookup: {
            from: 'roles',
            let: { role: '$role' },
            pipeline: [
              { $match: { $expr: { $eq: ['$$role', '$_id'] } } },
              { $project: { _id: 0, key: 1 } }
            ],
            as: 'userD'
          }
        },
        { $addFields: { userD: { $first: '$userD' } } },
        { $match: { 'userD.key': { $in: [UserRoles.customer, UserRoles.staff] } } },
        { $group: { _id: '$userD.key', count: { $sum: 1 } } }
      ]);

      users = users.reduce((a, u) => {
        a[u?._id] = u?.count;
        return a;
      }, {});

      const now = new Date();

      let revenue = await Order.find(
        { isDeleted: false, createdAt: { $gte: new Date(now.getFullYear(), now.getMonth(), 1) } },
        { _id: 0, paymentId: 1 }
      ).populate('paymentId', 'totalAmount -_id');

      revenue = revenue.reduce((a, r) => a + (r?.paymentId?.totalAmount || 0), 0);

      // LIST
      let orders = await Order.find(
        { isDeleted: false },
        { _id: 0, paymentId: 1, createdAt: 1, code: 1, status: 1 }
      )
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('paymentId', 'totalAmount method -_id');

      orders = orders.map(o => ({
        code: o?.code || '',
        status: o?.status || '',
        paymentMethod: o?.paymentId?.method || '',
        total: o?.paymentId?.totalAmount || null
      }));

      let products = await Product.find(
        { isDeleted: false },
        { _id: 0, createdAt: 1, skuCode: 1, code: 1, name: 1, catId: 1, subCatId: 1 }
      )
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('catId', 'name -_id')
        .populate('subCatId', 'name -_id');

      products = products.map(o => ({
        code: o?.code || '',
        skuCode: o?.skuCode || '',
        name: o?.name || '',
        category: o?.catId?.name || '',
        subCategory: o?.subCatId?.name || '',
      }));

      return resS.send(res, 'Fetched', {
        tabs: {
          totalCustomerStaff: `${users[UserRoles.staff] || 0} : ${users[UserRoles.customer] || 0}`,
          totalProducts: await Product.find({ isDeleted: false }, { _id: 1 }).countDocuments(),
          totalVendors: await Vendor.find({ isDeleted: false }, { _id: 1 }).countDocuments(),
          totalRevenueThisMonth: revenue,
        },
        list: {
          orders,
          products
        }
      });
    }
    catch (error) {
      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  },

}