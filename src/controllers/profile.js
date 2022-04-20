const resS = require("../utilities/sendFormat");
const User = require("../models/User");
const {
  trackUpload,
  parsePathFromFileObject,
} = require("../utilities/fileUploadHelper");
const { get } = require("mongoose");
const Seller = require("../models/Seller");

module.exports = {
  // Get User's Profile
  getProfileByUserId: async (req, res, next) => {
    try {
      const user = await User.findOne(
        { _id: req.user._id },
        { password: 0 }
      ).populate("role", "key name");
      return resS.send(res, "Profile fetched successfully", user);
    } catch (error) {
      next(error);
    }
  },

  // Update Profile -  NEED to check why image is updating in db.
  updateProfile: async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!id) return resS.sendError(res, 404, "Bad Request", {});

      let {
        fullName,
        email,
        phone,
        address,
        storeName,
        businessAddress,
        accountNumber,
        bsb,
        accountName,
        storeLogoImage,
        storeHomeImage,
      } = req.body;

      if (req?.files && req?.files?.storeLogoImage) {
        storeLogoImage = req?.files?.storeLogoImage?.map((f, fi) => {
          return {
            url: parsePathFromFileObject(f), // When uploading file to Aws S3 Bucket.
            order: fi + 1,
          };
        });
      }

      if (req?.files && req?.files?.storeHomeImage) {
        storeHomeImage = req?.files?.storeHomeImage?.map((f, fi) => {
          return {
            url: parsePathFromFileObject(f), // When uploading file to Aws S3 Bucket.
            order: fi + 1,
          };
        });
      }

      var getId = await User.findOne({ _id: req.user._id })
      let data2;
      const data = await User.findOneAndUpdate(
        { _id: req.user._id },
        {
          $set: {
            fullName,
            email,
            phone,
            address,
            updatedBy: req.user._id || null,
          },
        },
        { new: true }
      );
      if (data.__t == 'seller') {
        data2 = await Seller.findOneAndUpdate(
          { _id: req.user._id },
          {
            $set: {

              storeName: req.body.storeName,
              businessAddress: req.body.businessAddress,
              accountNumber: req.body.accountNumber,
              bsb: req.body.bsb,
              accountName: req.body.accountName,
              storeLogoImage: storeLogoImage,
              storeHomeImage: storeHomeImage,
              updatedBy: req.user._id || null,
            },
          },
          { new: true }
        );
      }
      return resS.send(res, "Profile Updated.", data2);
    } catch (error) {
      next(error);
    }
  },

  deleteProfile: async (req, res, next) => {
    try {
      const { id } = req.params;
      await User.findByIdAndUpdate({ _id: id }, { isDeleted: true });
      return resS.send(res, "Profile Deleted successfully", {});
    } catch (error) {
      next(error);
    }
  },
};
