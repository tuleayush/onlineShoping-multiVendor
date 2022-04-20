const express = require("express");
const createError = require("http-errors");

const Brand = require("../models/Brand");
const brandSchema = require('../utilities/validation-schemas/brandSchema');
const resS = require('../utilities/sendFormat');

module.exports = {
  //Add New Brand
  createBrand: async (req, res, next) => {
    try {
      const result = await brandSchema.validateAsync({ ...req.body, createdBy: req.user._id.toString() });

      const newBrand = await Brand.create(result);
      return resS.send(res, `Brand Created`, newBrand);
    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error);
    }
  },

  // Get All Brand
  getBrand: async (req, res, next) => {
    try {
      const data = await Brand.aggregate([
        { $match: { isDeleted: false } },
        {
          $lookup: {
            from: 'users',
            localField: 'createdBy',
            foreignField: '_id',
            as: 'createdBy'
          }
        }, {
          $unwind: {
            path: '$createdBy',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'updatedBy',
            foreignField: '_id',
            as: 'updatedBy'
          }
        }, {
          $unwind: {
            path: '$updatedBy',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $project: {
            name: 1,
            createdBy: { fullName: 1, _id: 1 },
            updatedBy: { fullName: 1, _id: 1 },
            createdAt: { $dateToString: { date: '$createdAt', format: '%Y-%m-%d %H:%M' } },
            updatedAt: { $dateToString: { date: '$updatedAt', format: '%Y-%m-%d %H:%M' } }
          }
        }
      ]);
      return resS.send(res, 'Brand Fetched', data);
    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error);
    }
  },

  // Get Brand By Id
  getBrandById: async (req, res, next) => {
    try {
      const { brandId } = req.params
      if (!brandId) throw createError.NotFound(`brandId Not Found`);
      const data = await Brand.findOne({ _id: brandId, isDeleted: false }).populate('createdBy', 'fullName');
      if (!data) {
        return resS.sendError(res, 404, `Brand Not Found`, {});
      } else {
        return resS.send(res, `Brand Fetched`, data);
      }
    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error);
    }
  },

  // Update Brand
  updateBrand: async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!id) throw createError.NotFound(`Bad Request`);
      const { name } = req.body;
      if (!name) throw createError.NotFound(`Please provide brand name`);
      const data = await Brand.findOneAndUpdate({ _id: id }, { $set: { name, updatedBy: req.user._id } }, { new: true }).populate('updatedBy', 'fullName');
      if (data) {
        return resS.send(res, `Brand Update`, data);
      } else {
        return resS.sendError(res, 404, `Brand Not Found`, {});
      }
    }
    catch (error) {
      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  },


  // Delete Brand By Id
  deleteBrand: async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!id) throw createError.NotFound(`Bad Request`);
      const data = await Brand.findByIdAndUpdate(id, { $set: { isDeleted: true } });
      if (data) {
        if (data.isDeleted == false) {
          return resS.send(res, `Brand Deleted Deteled`);
        } else {
          return resS.sendError(res, 202, `Brand Deleted Already Deleted`, {});
        }
      } else {
        return resS.sendError(res, 404, `Brand Deleted Not Found`, {});
      }
    }
    catch (error) {
      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  }

}