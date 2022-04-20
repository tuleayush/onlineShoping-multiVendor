const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { AddressType } = require("../utilities/constants/address")

const addressSchema = new Schema({
  addressType: { type: String, required: true, enum: Object.values(AddressType) },
  address1: { type: String, required: true },
  address2: { type: String },
  state: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: String },
  isDeleted: { type: Boolean, default: false },
  createdBy: { type: Schema.Types.ObjectId, ref: 'user' },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'user' }
}, { timestamps: true })


const Address = mongoose.model('address', addressSchema);
module.exports = Address;