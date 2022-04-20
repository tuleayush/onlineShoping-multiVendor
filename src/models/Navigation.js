const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { NavigationType } = require("../utilities/constants/navigation");

const SubNavSchema = new Schema({
  title: { type: String, required: true, trim: true },
  path: { type: String, required: true, trim: true },
  type: { type: String, required: true, trim: true, enum: Object.values(NavigationType) },
});

const NavSchema = new Schema({
  title: { type: String, required: true, trim: true, unique: true },
  path: { type: String, trim: true },
  icon: { type: String, required: true, trim: true },
  type: { type: String, required: true, trim: true, enum: Object.values(NavigationType) },
  badgeType: { type: String, trim: true },
  children: [SubNavSchema],
  order: { type: Number, default: 0 },
  createdBy: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('navigation', NavSchema);