const express = require("express");
const createError = require("http-errors");
const Address = require("../models/Address");
const addressSchema = require('../utilities/validation-schemas/addressSchema');
const resS = require('../utilities/sendFormat');

module.exports = {
  //Add New Address
  create: async (req, res, next) => {
    try {
      const result = await addressSchema.validateAsync({ ...req.body, createdBy: req.payload.aud });
      const address = new Address(result);
      const newAddress = await address.save();
      return resS.send(res, `Address Created`, newAddress);
    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error);
    }
  },

  // Get All Address
  get: async (req, res, next) => {
    try {
      const userid = req.payload.aud
      const data = await Address.find({ createdBy: userid, isDeleted: false });
      return resS.send(res, `Fetched`, data);
    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error);
    }
  },

  // Get Address By Id
  getById: async (req, res, next) => {
    try {
      const { id } = req.params
      if (!id) throw createError.NotFound(`Id Not Found`);
      const data = await Address.findOne({ _id: id, isDeleted: false }).populate('createdBy', 'fullName');
      if (data)
        return resS.send(res, `Address Fetched`, data);
      else return resS.sendError(res, 404, `Address Is Not Given`, {});

    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error);
    }
  },

  // Update Address
  update: async (req, res, next) => {
    try {
      const { id } = req.params
      if (!id) throw createError.NotFound(`Id Not Found`);
      const result = await addressSchema.validateAsync(req.body);
      const data = await Address.findOneAndUpdate({ _id: id }, { $set: { result, updatedBy: req.payload.aud } }, { new: true });
      if (data)
        return resS.send(res, `Address Update`, data);
      else return resS.sendError(res, 404, `Address Not Found`, {});
    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error);
    }
  },


  // Delete Address By Id
  delete: async (req, res, next) => {
    try {
      const { id } = req.params
      if (!id) throw createError.NotFound(`Id Not Found`);
      const data = await Address.findByIdAndUpdate({ _id: id }, { isDeleted: true });
      if (data) {
        if (data.isDeleted == false) {
          return resS.send(res, `Address Deteled`);
        } else {
          return resS.sendError(res, 202, `Address Already Deleted`, {});
        }
      } else {
        return resS.sendError(res, 404, `Address Not Found`, {});
      }

    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error);
    }
  }

}