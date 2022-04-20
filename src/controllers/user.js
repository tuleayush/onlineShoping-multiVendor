const { Types } = require("mongoose");
const createError = require("http-errors");

const User = require("../models/User");
const Role = require("../models/Role");
const resS = require("../utilities/sendFormat");
const { UserRoles } = require("../utilities/constants/user");
const authSchema = require("../utilities/validation-schemas/authSchema");

module.exports = {

  //Need to change the logic
  addUser: async (req, res, next) => {
    try {
      let { role = undefined } = req.params;

      let body = req.body

      let userData = {
        fullName: body.fullName,
        email: body.email,
        phone: body.phone,
        password: body.password || process.env.COMMON_PASSWORD,
        role,
        address: body.address
      }


      const roleId = await Role.findOne({
        key: userData.role.toLowerCase().trim(),
      }, { _id: 1 });

      console.log('check roleId', roleId);

      if (!role) throw createError.NotFound(`Role not found`);
      // return;

      userData.role = roleId._id;
      const user = new User(userData)
      const newUser = await user.save();

      // TODO:- Send mail to Admin for new enquiry


      res.status(200).send(newUser);

    } catch (error) {
      console.log('Error', error)
      if (error.isJoi === true) error.status = 422
      next(error);
    }
  },

  getUsers: async (req, res, next) => {
    try {
      const { role = undefined } = req.params;

      if (
        (role && !Object.values(UserRoles).includes(role)) ||
        UserRoles.admin === role
      )
        throw createError.NotFound(`Bad Request`);

      let roleDetails = await Role.findOne({ key: role }, { _id: 1 })
      if (!roleDetails) throw createError.NotFound(`Bad Request`);

      const query = { isDeleted: false, role: roleDetails._id };

      const userLists = await User.find(query, { password: 0 }).populate({
        path: 'role',
        model: 'role',
        select: '_id key'
      }).lean()

      return resS.send(res, "Role Users Fetched !", userLists);
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  },

  getUserById: async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!id) throw createError.NotFound("User does not exists");

      const user = await User.findOne(
        { _id: Types.ObjectId(id), isDeleted: false },
        { password: 0 }
      );
      if (!user) {
        // return res.status(404).send('User Not Found');
        return res.status(401).json({ error: 'User Not Found' });
      } else {
        return resS.send(res, "User Fetched !", user);
      }

    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  },



  getUser: async (req, res, next) => {
    try {
      const user = res.locals.loggedInUser;
      const { fullName, role: { name } } = await User.findOne({ "_id": user._id }).populate('role', 'name')
      return resS.send(res, "Info Fetched !", {
        fullName: fullName || "",
        role: name || "",
      });
    } catch (error) {
      console.log(error);
      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  },

  updateUser: async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!id) throw createError.NotFound("User Id not registered");
      await User.updateOne({ _id: Types.ObjectId(id) }, { $set: req.body });
      res.status(200).json({ success: true, message: "User is updated" });
    } catch (error) {
      console.log(error);
      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  },

  deleteUser: async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!id) throw createError.NotFound("User Id not found");
      const update = await User.findByIdAndUpdate(
        { _id: Types.ObjectId(id) },
        { $set: { isDeleted: true } }
      );
      res.status(200).json({ success: true, message: "User is deleted" });
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  },
};
