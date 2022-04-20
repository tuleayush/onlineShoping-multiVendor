const createError = require("http-errors");
const { Types } = require("mongoose");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

const User = require("../models/User");
const Seller = require("../models/Seller");
const Token = require("../models/Token");
const SmsLog = require("../models/SmsLog");
const { userSchema, authSchema } = require("../utilities/validation-schemas/authSchema");
const {
  twillio: { messagingServiceSid },
} = require('../utilities/environment');

const { generateOtp, sendSMS } = require("../utilities/twilliosms");
const { signAccessToken } = require("../middlewares/jwtHelper");

const Role = require("../models/Role");
const resS = require("../utilities/sendFormat");
const { sendEmail } = require("../utilities/email/mailer");

const {
  trackUpload,
  parsePathFromFileObject,
} = require("../utilities/fileUploadHelper");

module.exports = {
  //Register as a customer/buyers or seller
  register: async (req, res, next) => {
    try {

      const { role = undefined } = req.params;
      const result = req.body;
      const userExists = await User.findOne({ email: result.email })
      if (userExists) return resS.sendError(res, 409, `${result.email} email is already been registered`, {});
      if (!result.role) return resS.sendError(res, 422, "Please provide role", {});

      const roleExists = await Role.findOne({
        key: (role && role.toLowerCase().trim())
      });
      if (!roleExists) return resS.sendError(res, 404, `"${role}" Role is not found`, {});

      let savedUser;
      result.role = roleExists._id;

      if (req?.files) {
        result.storeLogoImage = req?.files?.storeLogoImage?.map((f, fi) => {
          return {
            url: parsePathFromFileObject(f), // When uploading file to Aws S3 Bucket.
            order: fi + 1,
          };
        }) || [],
          result.storeHomeImage = req?.files?.storeHomeImage?.map((f, fi) => {
            return {
              url: parsePathFromFileObject(f), // When uploading file to Aws S3 Bucket.
              order: fi + 1,
            };
          }) || []
      }

      if (role.key === 'seller') {
        const seller = new Seller(result);
        savedUser = await seller.save();
      } else {
        const user = new User(result);
        savedUser = await user.save();
      }
      const accessToken = await signAccessToken(savedUser.id);
      return resS.send(res, `Success`, { accessToken });
    } catch (error) {
      console.error('Error while registration', error)
      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  },

  // Login with email and Password on website
  login: async (req, res, next) => {
    try {
      const { email, password } = await authSchema.validateAsync(req.body);
      const user = await User.findOne({ email }).populate(
        "role",
        "_id key"
      );

      if (!user) return resS.sendError(res, 404, `User with email ${email} is not registered.`, {});

      const isMatch = await user.isValidPassword(password);
      if (!isMatch) return resS.sendError(res, 401, `Username/password not valid`, {});

      const accessToken = await signAccessToken(user.id);
      return resS.send(res, `Success`, { accessToken });
    } catch (error) {
      console.error('Error while login:', error)
      if (error.isJoi === true)
        return next(createError.BadRequest("Invalid Username/Password"));
      next(error);
    }
  },

  // Login as a Admin
  adminLogin: async (req, res, next) => {
    try {
      const result = req.body;
      const user = await User.findOne({ email: result.email }).populate(
        "role",
        "_id key"
      );

      if (!user) return resS.sendError(res, 404, `User not registered.`, {});

      if (user?.role?.key != "admin" && user?.role?.key != "staff") {
        return resS.sendError(res, 401, `You are not authorised to login.`, {});
      }

      const isMatch = await user.isValidPassword(result.password);
      if (!isMatch) return resS.sendError(res, 401, `Username/password not valid`, {});

      const accessToken = await signAccessToken(user.id);
      return resS.send(res, `Success`, { accessToken });
    } catch (error) {
      if (error.isJoi === true)
        return next(createError.BadRequest("Invalid Username/Password"));
      next(error);
    }
  },

  // Otp login for Website App
  loginWithMobile: async (req, res, next) => {
    try {
      let { mobile } = req.params;

      if (!mobile) throw createError.NotFound("Mobile Number Not Found!!!");
      if (mobile.toString().length < 10)
        throw createError.NotFound("Invalid Mobile Number!!!");

      const user = await User.findOne({ phone: mobile });
      if (!user)
        return resS.sendError(
          res,
          404,
          `Mobile number '${mobile}' is not in our records`,
          {}
        );

      let otp = generateOtp();
      let message = `Your OTP to login at Livestyle is ${otp}. Kindly do not share the OTP with any one.`;
      console.log(message);
      const { isSuccess, response } = await sendSMS(
        mobile,
        message,
        messagingServiceSid.OtpVerify
      );

      const data = await SmsLog.create({
        message,
        to: mobile,
        response: {
          body: response,
          otp,
          isVerified: false,
        },
        isSuccess,
        messageServiceName: "OtpVerify",
      });

      if (isSuccess) {
        return resS.send(res, "Otp sent successfully", {
          mobile,
          token: data._id,
        });
      } else {
        return resS.sendError(res, 501, `Some Error Occured`, {});
      }
    } catch (error) {
      console.log("Error during otp login:", error);
      next(error);
    }
  },

  otpVerification: async (req, res, next) => {
    try {
      const { otp, token } = req.params;
      if (!otp) throw createError.NotFound("Otp Not Found!!!");
      if (!token) throw createError.Unauthorized("Auth Token Not Found!!!");

      let _id = Types.ObjectId(token);
      let logExists = await SmsLog.findByIdAndUpdate(
        _id,
        { $set: { "response.isVerified": true } },
        { new: true }
      );

      if (!logExists) throw createError.Unauthorized();
      else if (logExists?.response?.otp !== otp)
        return resS.sendError(res, 401, `Incorrect OTP entered`, {});
      else {
        const user = await User.findOne({ phone: logExists.to }).populate(
          "role",
          "_id key"
        );
        if (!user) {
          return resS.sendError(
            res,
            404,
            `Mobile number '${logExists.to}' doesn't exists`,
            { mobile: logExists.to, isRegistered: false }
          );
        } else {
          const accessToken = await signAccessToken(user.id);
          return resS.send(res, `Success`, {
            accessToken,
            mobile: logExists.to,
            isRegistered: true,
          });
        }
      }
    } catch (error) {
      next(error);
    }
  },

  // Verify Admin login
  otpVerificationForAdmin: async (req, res, next) => {
    try {
      const { otp, token } = req.params;
      if (!otp) throw createError.NotFound("Otp Not Found!!!");
      if (!token) throw createError.Unauthorized("Auth Token Not Found!!!");
      let _id = Types.ObjectId(token);
      let logExists = await SmsLog.findByIdAndUpdate(
        _id,
        { $set: { "response.isVerified": true } },
        { new: true }
      );

      if (!logExists) throw createError.Unauthorized();
      else if (logExists?.response?.otp !== otp)
        return resS.sendError(res, 401, `Incorrect OTP entered`, {});
      else {
        const user = await User.findOne({ phone: logExists.to }).populate(
          "role",
          "_id key"
        );
        if (!user) {
          throw createError.NotFound(
            "Mobile number not found. Please contact your Administrator"
          );
        } else if (user.role.key != "admin" && user.role.key != "staff") {
          throw createError.Unauthorized("You are not authorized user");
        } else {
          const accessToken = await signAccessToken(user.id);
          const isRegistered = !user.isRegistered
            ? await User.updateOne(
              { phone: logExists.to },
              { $set: { isRegistered: true } }
            )
            : user.isRegistered;
          return resS.send(res, `Success`, {
            accessToken,
            mobile: logExists.to,
            isRegistered,
          });
        }
      }
    } catch (error) {
      next(error);
    }
  },

  pingToken: async (req, res, next) => {
    return resS.send(res, `Success`, {});
  },
  logout: async (req, res, next) => {
    try {
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  },

  requestPasswordReset: async (req, res, next) => {
    try {
      const email = req.body.email;
      const user = await User.findOne({ email });

      console.log('user', user)

      if (!user) return resS.sendError(res, 404, `User not exists.`, {});
      let token = await Token.findOne({ userId: user._id });
      if (token) await token.deleteOne();
      let resetToken = crypto.randomBytes(32).toString("hex");
      const hash = await bcrypt.hash(resetToken, Number(process.env.BCRYPT_SALT));

      await new Token({
        userId: user._id,
        token: hash,
        createdAt: Date.now(),
      }).save();

      const link = `${process.env.HOST}/resetPassword?token=${resetToken}&id=${user._id}`;

      sendEmail(
        user.email,
        "Password Reset Request",
        { name: user.email, link: link },
        "./template/requestResetPassword.handlebars"
      );
      return resS.send(res, `Success`, { link });
    } catch (error) {
      next(error);
    }
  },

  resetPassword: async (req, res, next) => {
    try {
      const { userId, token, password } = req.body;
      let passwordResetToken = await Token.findOne({ userId });
      if (!passwordResetToken) {
        return resS.sendError(res, 401, `Invalid/Expired Password Reset token`, {});
      }
      const isValid = await bcrypt.compare(token, passwordResetToken.token);
      if (!isValid) {
        return resS.sendError(res, 401, `Invalid/Expired Password Reset token`, {});
      }
      const hash = await bcrypt.hash(password, Number(process.env.BCRYPT_SALT));
      await User.updateOne(
        { _id: userId },
        { $set: { password: hash } },
        { new: true }
      );
      const user = await User.findById({ _id: userId });
      sendEmail(
        user.email,
        "Password Reset Successfully",
        {
          name: user.email,
        },
        "./template/resetPassword.handlebars"
      );
      await passwordResetToken.deleteOne();
      return resS.send(res, `Success`, true);
    } catch (error) {
      next(error);
    }
  },


  googleLogin: async (req, res, next) => {
    try {
      console.log("req", req.userProfile)
      console.log("email check", req?.userProfile.displayName)
      let email = req?.userProfile.emails[0].value
      const user = await User.findOne({ email });
      // console.log("_is User Existing? ", user);
      if (!user) {
        console.log("under User Conditions");
        let userData = {
          email: email,
          profilePic: req?.userProfile.photos[0].value,
          fullName: req?.userProfile.displayName,
          provider: req?.userProfile.provider,
          phone: '9845698456',
          password: 'test1234',
          // role: 'Seller'
        }

        const user = new User(userData);
        const newUser = await user.save();

        res.status(200).send(newUser);

      }
      else {
        console.log("User Already Register");
      }
    } catch (error) {
      next(error);
    }
    // return ("return data");
  }
};
