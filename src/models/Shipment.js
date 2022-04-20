const mongoose = require("mongoose");
const { ShipmentType } = require("../utilities/constants/shipment");
const Schema = mongoose.Schema;

const ShipmentSchema = new Schema({
  name: { type: String, required: true, trim: true },
  type: { type: String, required: true, enum: Object.values(ShipmentType) },
  value: { type: Number, default: null },
  createdBy: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('shipment', ShipmentSchema);