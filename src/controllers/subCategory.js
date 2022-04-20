const express = require("express");
const createError = require("http-errors");
const subCategory = require("../models/SubCategory");
const { id } = require("../utilities/validation-schemas/subCategorySchema");
const subCategorySchema = require('../utilities/validation-schemas/subCategorySchema');
const resS = require('../utilities/sendFormat');

module.exports = {
  //Add New Sub Category
  Create: async (req, res, next) => {
    try {

      let body = req.body;
      const result = await subCategorySchema.validateAsync(body);
      const subcategory = new subCategory({ ...result, createdBy: req.user._id });
      subcategory.catId = req.body.catId;
      const newSubCat = await subcategory.save();
      return resS.send(res, `SUb Category Created`, newSubCat);

    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error);
    }
  },

  // Get All Sub Category
  Get: async (req, res, next) => {
    try {
      const data = await subCategory.aggregate([
        { $match: { isDeleted: false } },
        {
          $lookup: {
            from: 'category',
            localField: 'catId',
            foreignField: '_id',
            as: 'catId'
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
            catId: { name: 1, _id: 1 },
            name: 1,
            createdBy: { fullName: 1, _id: 1 },
            updatedBy: { fullName: 1, _id: 1 },
            createdAt: { $dateToString: { date: '$createdAt', format: '%Y-%m-%d %H:%M' } },
            updatedAt: { $dateToString: { date: '$updatedAt', format: '%Y-%m-%d %H:%M' } }
          }
        },
      ]);
      return resS.send(res, `SubCategory Fetch`, data);
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  },

  // Get Sub Category By Id
  GetById: async (req, res, next) => {
    try {
      const { subCatId } = req.params
      if (!subCatId) throw createError.NotFound(`Sub CatId Not Found`);
      const data = await subCategory.findOne({ _id: subCatId, isDeleted: false }).populate('catId', 'name').populate('createdBy', 'fullName');
      if (data)
        return resS.send(res, `Fetch Data`, data);
      else return resS.sendError(res, 404, `Sub Category Not Found`, {});
    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error);
    }
  },

  // Get Sub Category By Cat Id
  GetByCatId: async (req, res, next) => {
    try {
      const { catId } = req.params
      if (!catId) throw createError.NotFound(`CatId Not Found`);
      const data = await subCategory.find({ catId, isDeleted: false }).populate('catId', 'name').populate('createdBy', 'fullName ');
      if (data.length > 0) {
        return resS.send(res, `Fetch Data`, data);
      } else {
        return resS.sendError(res, 404, `Sub Category Not Found`, {});
      }

    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error);
    }
  },

  // Get Sub Category By StoreId
  GetByStoreId: async (req, res, next) => {
    try {
      const { storeId } = req.params
      if (!storeId) throw createError.NotFound(`Store Id Not Found`);
      const data = await subCategory.find({ storeId, isDeleted: false }).populate('catId', 'name').populate('createdBy', 'firstName lastName');
      res.status(200).send(data);

    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error);
    }
  },

  // Update Sub Category
  Update: async (req, res, next) => {
    try {
      const { subCatId } = req.params;
      if (!subCatId) throw createError.NotFound(`Please provide sub-category id`);
      const result = await subCategorySchema.validateAsync(req.body);
      const data = await subCategory.findOneAndUpdate({ _id: subCatId }, { $set: result, updatedBy: req.user._id }, { new: true }).populate('catId', 'name').populate('updatedBy', 'fullName');
      return resS.send(res, `SubCategory Update`, data);
    } catch (error) {
      console.log('Error while updating Sub Category', error)
      if (error.isJoi === true) error.status = 422
      next(error);
    }
  },

  // Delete Sub Category By Id
  Delete: async (req, res, next) => {
    try {
      const { id } = req.params
      if (!id) throw createError.NotFound(`Sub Cat Id Not Found`);
      const data = await subCategory.findByIdAndUpdate({ _id: id }, { isDeleted: true, updatedBy: req.user._id });

      if (data) {
        if (data.isDeleted == false) {
          return resS.send(res, `SubCategory Deteled`);
        } else {
          return resS.sendError(res, 202, `SubCategory Already Deleted`, {});
        }
      } else {
        return resS.sendError(res, 404, `SubCategory Not Found`, {});
      }
    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error);
    }
  }

}