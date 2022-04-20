const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const { UserRoles } = require("../utilities/constants/user");

const RoleSchema = new Schema({
  key: { type: String, required: true, unique: true, enum: Object.values(UserRoles), lowercase: true, index: true, default: UserRoles.customer },
  name: { type: String, required: true },
  permission: {
    navs: { type: [Schema.Types.ObjectId], ref: "navigation", default: [] },
    crud: {
      create: { type: Boolean, required: true, default: true },
      get: { type: Boolean, required: true, default: true },
      update: { type: Boolean, required: true, default: true },
      delete: { type: Boolean, required: true, default: true },
    }
  },
  isDeleted: { type: Boolean, default: false },
  createdBy: { type: Schema.Types.ObjectId, ref: 'user' },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'user' }
}, { timestamps: true });

module.exports = mongoose.model("role", RoleSchema);
