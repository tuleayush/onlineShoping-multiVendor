const createError = require("http-errors");

const Role = require("../models/Role");
const RoleSchema = require('../utilities/validation-schemas/roleSchema');
const { UserRoles } = require("../utilities/constants/user");

module.exports = {
  //Add New Role
  create: async (req, res, next) => {
    try {
      const result = await RoleSchema.validateAsync(req.body);
      const newRole = await Role.create(result);
      return res.status(200).send(newRole);
    } catch (error) {
      console.log('Error While creating role',error)
      if (error.isJoi === true) error.status = 422
      next(error);
    }
  },

  // Get All Role
  get: async (req, res, next) => {
    try {
      const data = await Role.find({ isDeleted: false, key: { $ne: UserRoles.admin } }, { key: 1, name: 1, permission: 1 });
      return res.status(200).json(data);
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  },

  // Get Role By Id
  getById: async (req, res, next) => {
    try {
      const { id } = req.params
      if (!id) throw createError.NotFound(`Role Id Not Found`);
      const data = await Role.findOne({ _id: id, isDeleted: false });
      res.status(200).send(data);

    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error);
    }
  },

  // Get All Staff Roles
  getStaffRoles: async (req, res, next) => {
    try {
      const data = await Role.find({ isDeleted: false, key: UserRoles.staff }, { name: 1 });
      res.status(200).json(data);
    }
    catch (error) {
      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  },

  // Update Role
  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { key, name } = req.body;
      if (!key) throw createError.NotFound(`Key Not Found`);
      if (!name) throw createError.NotFound(`Name Not Found`);
      const data = await Role.findOneAndUpdate({ _id: id }, { $set: { key, name } });
      res.status(200).send(data);

    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error);
    }
  },

  // Update Role Permission
  updatePermission: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { navs } = req.body;
      if (!navs) throw createError.NotFound(`Navs Not Found`);
      const data = await Role.findOneAndUpdate({ _id: id }, { $set: { permission: { navs } } });
      return res.status(200).send(data);

    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error);
    }
  },


  // Delete Role By Id
  delete: async (req, res, next) => {
    try {
      const { id } = req.params
      if (!id) throw createError.NotFound(`Role Id Not Found`);
      const data = await Role.findByIdAndUpdate({ _id: id }, { isDeleted: true });
      res.status(200).send(data);

    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error);
    }
  }

}