const express = require("express");
const createError = require("http-errors");
const Store = require("../models/Store");
const storeSchema = require("../utilities/validation-schemas/storeSchema");

module.exports = {
  //Add New Store
  Create: async (req, res, next) => {
    try {
      let body = JSON.parse(req.body.data);
      console.log(body,'????')

      body.images =
        req?.files?.map((f, fi) => {
          return {
            url: `uploads/${f?.fieldname}/${f?.filename}`,
            order: fi + 1,
          };
        }) || [];

      console.log("data", body);
      const result = await storeSchema.validateAsync(body);
      const store = new Store({ ...result});
      const newStore = await store.save();
      res.status(200).send(newStore);
    } catch (error) {
      console.error('Something went while adding store :',error)
      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  },

  // Get All store
  Get: async (req, res, next) => {
    try {
      const data = await Store.find({ isDeleted: false })
        .populate("catId", "name")
        .populate("createdBy", "firstName")
        .populate("updatedBy", "firstName");
      res.status(200).send(data);
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  },

  // Get Store By cat Id
  GetByCatId: async (req, res, next) => {
    try {
      const { catId } = req.params;
      if (!catId) throw createError.NotFound(`CatId  Not Found`);
      const data = await Store.find({ catId: catId, isDeleted: false })
        .populate("catId", "name")
        .populate("createdBy", "firstName")
        .populate("updatedBy", "firstName");
      res.status(200).send(data);
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  },

  // Get store By store Id
  GetById: async (req, res, next) => {
    try {
      const { storeId } = req.params;
      if (!storeId) throw createError.NotFound(`StoreId  Not Found`);
      const data = await Store.findOne({ _id: storeId, isDeleted: false })
        .populate("catId", "name")
        .populate("createdBy", "firstName")
        .populate("updatedBy", "firstName");
      res.status(200).send(data);
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  },

  // Update Store
  Update: async (req, res, next) => {
    try {
      const { storeId } = req.params;
      if (!storeId) throw createError.NotFound(`StoreId  Not Found`);
      let body = JSON.parse(req.body.data);

      if (req.files && req.files.length) {
        body.images = req.files.map(
          (img) => img.destination + "/" + img.filename
        );
      }
      const result = await storeSchema.validateAsync(body);
      const data = await Store.findOneAndUpdate(
        { _id: storeId },
        { ...result }
      );
      res.status(200).send(data);
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  },

  Delete: async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!id) throw createError.NotFound(`Store Id Not Found`);
      const data = await Store.findByIdAndUpdate(
        { _id: id },
        { isDeleted: true }
      );
      res.status(200).send(data);
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  },
};
