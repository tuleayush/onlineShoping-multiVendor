const express = require("express");
const createError = require("http-errors");
const subSubCategory = require("../models/SubSubCategory");
const subSubCategorySchema = require('../utilities/validation-schemas/subSubCategorySchema');
const resS = require('../utilities/sendFormat');

module.exports = {
  //Add New Sub Sub Category
  Create: async (req, res, next) => {
    try {
      let body = req.body;
      const result = await subSubCategorySchema.validateAsync(body);
      const subcategory = new subSubCategory({ ...result, createdBy: req.user._id });
      const newSubCat = await subcategory.save();
      return resS.send(res, `Sub Sub Category Created`, newSubCat);
    } catch (error) {
      console.log('Error during sub sub category creation', error)
      if (error.isJoi === true) error.status = 422
      next(error);
    }
  },

  // Get All Sub Sub Category
  Get: async (req, res, next) => {
    try {
      const data = await subSubCategory.aggregate([
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
            from: 'subcategory',
            localField: 'subCatId',
            foreignField: '_id',
            as: 'subCatId'
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
            subCatId: { name: 1, _id: 1 },
            name: 1,
            createdBy: { fullName: 1, _id: 1 },
            updatedBy: { fullName: 1, _id: 1 },
            createdAt: { $dateToString: { date: '$createdAt', format: '%Y-%m-%d %H:%M' } },
            updatedAt: { $dateToString: { date: '$updatedAt', format: '%Y-%m-%d %H:%M' } }
          }
        },
      ]);
      return resS.send(res, `Sub Sub Category Fetch`, data);
    } catch (error) {
      console.log('Error while fetching sub sub category', error)
      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  },

  // Get Sub Sub Category By Id
  GetById: async (req, res, next) => {
    try {
      const { id } = req.params
      if (!id) throw createError.NotFound(`Sub Sub CatId Not Found`);
      const data = await subSubCategory.findOne({ _id: id, isDeleted: false }).populate('catId', 'name').populate('subCatId', 'name').populate('createdBy', 'fullName');
      if (data) {
        return resS.send(res, `Fetched Sub Sub Category`, data);
      } else {
        return resS.sendError(res, 404, `Sub Sub Category Not Found`, {});
      }
    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error);
    }
  },

  // Get Sub Sub Category By Sub Cat Id
  GetBySubCatId: async (req, res, next) => {
    try {
      const { subCatId } = req.params
      if (!subCatId) throw createError.NotFound(`Sub CatId Not Found`);
      const data = await subSubCategory.find({ subCatId, isDeleted: false }).populate('catId', 'name').populate('subCatId', 'name').populate('createdBy', 'fullName');
      if (data) {
        return resS.send(res, `Fetched Sub Sub Category`, data);
      } else {
        return resS.sendError(res, 404, `Sub Sub Category Not Found`, {});
      }

    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error);
    }
  },

  // Get Sub Sub Category By Cat Id
  GetByCatId: async (req, res, next) => {
    try {
      const { catId } = req.params
      if (!catId) throw createError.NotFound(`CatId Not Found`);
      const data = await subSubCategory.find({ catId, isDeleted: false }).populate('catId', 'name').populate('subCatId', 'name').populate('createdBy', 'fullName');
      if (data) {
        return resS.send(res, `Fetched Sub Sub Category`, data);
      } else {
        return resS.sendError(res, 404, `Sub Sub Category Not Found`, {});
      }
    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error);
    }
  },

  // Get Sub Sub Category By StoreId
  GetByStoreId: async (req, res, next) => {
    try {
      const { storeId } = req.params
      if (!storeId) throw createError.NotFound(`Store Id Not Found`);
      const data = await subSubCategory.find({ storeId, isDeleted: false }).populate('catId', 'name').populate('subCatId', 'name').populate('createdBy', 'firstName lastName');
      res.status(200).send(data);

    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error);
    }
  },

  // Update Sub Sub Category
  Update: async (req, res, next) => {
    try {
      const { subSubCatId } = req.params;
      if (!subSubCatId) throw createError.NotFound(`Please provide sub-sub category id`);
      const result = await subSubCategorySchema.validateAsync(req.body);
      const data = await subSubCategory.findOneAndUpdate({ _id: subSubCatId }, { $set: result, updatedBy: req.user._id }, { new: true }).populate('catId', '_id name').populate('subCatId', '_id name').populate('updatedBy', 'fullName');
      if (data) {
        return resS.send(res, `Sub Sub Category Update`, data);
      } else {
        return resS.sendError(res, 404, `Sub Sub Category Not Found`, {});
      }
    } catch (error) {
      console.log('Error while updating Sub Sub Category', error)
      if (error.isJoi === true) error.status = 422
      next(error);
    }
  },


  // Delete Sub Sub Category By Id
  Delete: async (req, res, next) => {
    try {
      const { id } = req.params
      if (!id) throw createError.NotFound(`Sub Sub Cat Id Not Found`);
      const data = await subSubCategory.findByIdAndUpdate({ _id: id }, { isDeleted: true, updatedBy: req.user._id });
      // res.status(200).json({ success: true, message: "Sub Sub Category Deleted" });
      if (data) {
        if (data.isDeleted == false) {
          return resS.send(res, `Sub Sub Category Deteled`);
        } else {
          return resS.sendError(res, 202, `Sub Sub Category Already Deleted`, {});
        }
      } else {
        return resS.sendError(res, 404, `Sub Sub Category Not Found`, {});
      }

    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error);
    }
  }
}
