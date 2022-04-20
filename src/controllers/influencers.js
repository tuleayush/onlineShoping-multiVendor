const express = require("express");
const createError = require("http-errors");

const Influencers = require("../models/Influencers");
const influencersSchema = require('../utilities/validation-schemas/InfluencersSchema');
const resS = require('../utilities/sendFormat');

module.exports = {
  //Add New Influencers
  createInfluencers: async (req, res, next) => {
    try {
      const result = await influencersSchema.validateAsync(req.body);
      await Influencers.create(result);
      return resS.send(res, 'Created', {});
    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error);
    }
  },

  // Get All Influencers
  getInfluencers: async (req, res, next) => {
    try {
      const data = await Influencers.aggregate([
        { $match: { isDeleted: false } },
        {
          $project: {
            name: 1,
            email: 1,
            primarySocialMedia: 1,
            secondarySocialMedia: 1,
            primaryCategory: 1,
            secondarycategory: 1,
            instagramUsername: 1,
            aboutUs: 1,
            createdAt: { $dateToString: { date: '$createdAt', format: '%Y-%m-%d %H:%M' } },
            updatedAt: { $dateToString: { date: '$updatedAt', format: '%Y-%m-%d %H:%M' } }
          }
        }
      ]);
      return resS.send(res, 'Fetched', data);
    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error);
    }
  },

  // Get Influencers By Id
  getInfluencersById: async (req, res, next) => {
    try {
      const { id } = req.params
      if (!id) throw createError.NotFound(`InfluencersId Not Found`);
      const data = await Influencers.findOne({ _id: id, isDeleted: false });
      res.status(200).send(data);
    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error);
    }
  },

  // Update Influencers
  updateInfluencers: async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!id) throw createError.NotFound(`Bad Request`);

      const result = await influencersSchema.validateAsync(req.body);
  
      const data = await Influencers.findOneAndUpdate({ _id: id }, { $set: result }, { new: true });
      return resS.send(res, 'Updated', data);
    }
    catch (error) {
      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  },


  // Delete Influencers By Id
  deleteInfluencers: async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!id) throw createError.NotFound(`Bad Request`);
      const data = await Influencers.findByIdAndUpdate(id, { $set: { isDeleted: true } });
      return resS.send(res, 'Deleted', data);
    }
    catch (error) {
      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  }

}