const express = require("express");
const createError = require("http-errors");
const mongoose = require("mongoose");
const router = express.Router();
const Category = require("../models/Category");
const categorySchema = require('../utilities/validation-schemas/categorySchema');
const resS = require('../utilities/sendFormat');

module.exports = {
  //Add New Category
  Create: async (req, res, next) => {
    try {
      const result = await categorySchema.validateAsync({ ...req.body, createdBy: req.user._id.toString() });
      const category = new Category(result);
      category.brandId = req.body.brand_id;
      const newCat = await category.save();
      return resS.send(res, `Category Created`, newCat);
    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error);
    }
  },

  // Get All Category
  Get: async (req, res, next) => {
    try {
      const data = await Category.aggregate([
        { $match: { isDeleted: false } },
        {
          $lookup:
          {
            from: 'brand',
            localField: 'brandId',
            foreignField: '_id',
            as: 'brandId'
          }
        },
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
            brandId: { name: 1, _id: 1 },
            createdBy: { fullName: 1, _id: 1 },
            updatedBy: { fullName: 1, _id: 1 },
            createdAt: { $dateToString: { date: '$createdAt', format: '%Y-%m-%d %H:%M' } },
            updatedAt: { $dateToString: { date: '$updatedAt', format: '%Y-%m-%d %H:%M' } }
          }
        }
      ]);
      return resS.send(res, `Data Fetched`, data);
    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error);
    }
  },

  // Get Category By Id
  GetById: async (req, res, next) => {
    try {
      const { catid } = req.params
      if (!catid) throw createError.NotFound(`CatId Not Found`);
      const data = await Category.findOne({ _id: catid, isDeleted: false }).populate("brandId", '_id name').populate('createdBy', 'fullName');
      if (data) {
        return resS.send(res, `Fetched Category`, data);
      } else {
        return resS.sendError(res, 404, `Category Not Found`, {});
      }

    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error);
    }
  },

  // Update Category
  Update: async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!id) throw createError.NotFound(`Bad Request`);
      const { name } = req.body;
      if (!name) throw createError.NotFound(`Please provide category name`);
      const data = await Category.findOneAndUpdate({ _id: id }, { $set: { name, updatedBy: req.user._id } }, { new: true }).populate("brandId", "_id name").populate('updatedBy', 'fullName');
      if (data) {
        return resS.send(res, `Category Update`, data);
      } else {
        return resS.sendError(res, 404, `Category Not Found`, {});
      }
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  },


  // Delete Category By Id
  Delete: async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!id) throw createError.NotFound(`Bad Request`);
      // const data = await Category.findByIdAndUpdate(id, { $set: { isDeleted: true } });
      const data = await Category.findByIdAndUpdate(id, { $set: { isDeleted: true } });
      if (data) {
        if (data.isDeleted == false) {
          return resS.send(res, `Category Deteled`);
        } else {
          return resS.sendError(res, 202, `Category Already Deleted`, {});
        }
      } else {
        return resS.sendError(res, 404, `Category Not Found`, {});
      }
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  }

}