const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

const baseOptions = {
  discriminatorKey: "usertype",
  collection: "users",
};
const UserSchema = new Schema(
  {
    fullName: { type: String, default: "" },
    email: {
      type: String,
      required: true,
      unique: true,
      index: { unique: true },
    },
    password: { type: String, required: true },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    isDeleted: { type: Boolean, default: false },
    provider: { type: String, default: "" },
    profilePic: { type: String, default: "" },
    role: { type: Schema.Types.ObjectId, ref: "role" },
    createdBy: { type: Schema.Types.ObjectId, ref: "user" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "user" },
  },
  { timestamps: true },
  baseOptions
);

UserSchema.pre("save", async function (next) {
  try {
    let user = this;
    if (!user.isModified("password")) return next();
    if (user.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);
      user.password = hashedPassword;
      next();
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
});

UserSchema.methods.isValidPassword = async function (newPassword) {
  try {
    let user = this;
    return await bcrypt.compare(newPassword, user.password);
  } catch (error) {
    throw error;
  }
};

const User = mongoose.model("user", UserSchema);

module.exports = User;
