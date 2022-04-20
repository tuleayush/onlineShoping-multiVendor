const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const { PaymentStatus, PaymentMode, PaymentMethod } = require("../utilities/constants/payment");

const OrderSchema = new Schema({
  mode: { type: String, required: true, enum: Object.values(PaymentMode) },
  method: { type: String, required: true, enum: Object.values(PaymentMethod) },
  status: { type: String, required: true, enum: Object.values(PaymentStatus) },
  totalAmount: { type: Number, required: true },
  transactionId: { type: String, default: null },
  isDeleted: { type: Boolean, default: false },
  createdBy: { type: Schema.Types.ObjectId, ref: 'user' },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'user' },
}, { timestamps: true })

module.exports = mongoose.model('payment', OrderSchema, 'payment');