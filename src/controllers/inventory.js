const express = require("express");
const createError = require("http-errors");

const Inventory = require("../models/Inventory");
const brandSchema = require('../utilities/validation-schemas/brandSchema');
const resS = require('../utilities/sendFormat');
const ProductOptionVariant = require("../models/ProductOptionVariant");
const Order = require("../models/Order");

module.exports = {
  //Add New Inventory - Need to create

  // Get All Inventory
  Get: async (req, res, next) => {
    try {
      let productOptionVariants = await ProductOptionVariant.find({ isDeleted: false }, { optionVariantIds: 1, prooductId: 1 })
        .populate({
          path: 'optionVariantIds',
          match: { isDeleted: false },
          select: 'optionId name',
          populate: {
            path: 'optionId',
            match: { isDeleted: false, optionId: { $exists: true } },
            select: 'name'
          }
        })
        .populate({
          path: 'productId',
          match: { isDeleted: false },
          select: 'name code skuCode'
        })
        .lean();

      const pIds = productOptionVariants?.map(p => p._id) || [];

      // Fetch Inventory
      let inventory = await Inventory.find({ isDeleted: false, productOptionVariantId: { $in: pIds } }, { quantity: 1, productOptionVariantId: 1, createdAt: 1, updatedAt: 1 }).lean();

      inventory = inventory.reduce((a, inv) => {
        inv.createdAt = inv?.createdAt && new Date(inv?.createdAt).toISOString()?.split('.')[0]?.replace('T', ' ');
        inv.updatedAt = inv?.updatedAt && new Date(inv?.updatedAt).toISOString()?.split('.')[0]?.replace('T', ' ');
        a[inv?.productOptionVariantId] = inv;
        return a;
      }, {});

      // Fetch orders to find remaining Qty
      let orders = await Order.aggregate([
        { $match: { isDeleted: false, 'items.productOptionVariant._id': { $in: pIds } } },
        { $unwind: '$items' },
        { $project: { _id: 0, prodOptVarId: '$items.productOptionVariant._id', quantity: '$items.quantity' } },
        { $match: { prodOptVarId: { $in: pIds } } },
      ]);

      orders = orders.reduce((a, o) => {
        a[o?.prodOptVarId] = a[o?.prodOptVarId] || 0;
        a[o?.prodOptVarId] += (o?.quantity || 0);
        return a;
      }, {});

      productOptionVariants = productOptionVariants.map(prodOptVar => {
        const invData = inventory[prodOptVar?._id] || null;
        return {
          productOptionVariantId: prodOptVar?._id || null,
          productCode: prodOptVar?.productId?.code || '',
          skuCode: prodOptVar?.productId?.skuCode || '',
          productName: prodOptVar?.productId?.name || '',
          optionVariant: prodOptVar?.optionVariantIds?.map(optVar => `${optVar?.name} (${optVar?.optionId?.name})`)?.join('  +  '),
          quantity: invData?.quantity || 0,
          remaining: (invData?.quantity || 0) - (orders[prodOptVar?._id] || 0),
          createdAt: invData?.createdAt || null,
          updatedAt: invData?.updatedAt || null,
          _id: invData?._id || '',
          inventoryExists: !!invData
        };
      });

      return resS.send(res, 'Fetched', productOptionVariants);

    } catch (error) {
      console.log('Error while fetching inventory:',error)
      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  },

  // Update Inventory
  Update: async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!id) throw createError.NotFound(`Bad Request`);

      const { quantity, productOptionVariantId } = req.body;
      if (!productOptionVariantId) throw createError.NotFound(`Bad Request`);
      if (!quantity) throw createError.NotFound(`Please provide quantity`);

      const data = await Inventory.findOneAndUpdate(
        { _id: id, productOptionVariantId },
        { $set: { quantity, updatedBy: req?.user?._id || null }, $setOnInsert: { createdBy: req?.user?._id || null } },
        { new: true, upsert: true }
      );

      return resS.send(res, 'Updated', { _id: data?._id || null, createdAt: data?.createdAt, updatedAt: data?.updatedAt });
    }
    catch (error) {
      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  },

}