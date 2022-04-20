const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const { OrderStatus } = require("../utilities/constants/order");
const { ProductOptionVariantSchema } = require("./ProductOptionVariantSchema");

const ItemSchema = new Schema({
  // subCode: { type: String, default: true, required: true },
  quantity: { type: Number, required: true },
  amount: { type: Number, required: true },
  productOptionVariant: { type: ProductOptionVariantSchema, required: true }
});

const OrderSchema = new Schema({
  code: { type: String, required: true, trim: true },
  items: { type: [ItemSchema], required: true },
  status: { type: String, required: true, enum: Object.values(OrderStatus), default: OrderStatus.process },
  address: { type: Object, required: true },
  paymentId: { type: Schema.Types.ObjectId, ref: 'payment', required: true },
  isDeleted: { type: Boolean, default: false },
  createdBy: { type: Schema.Types.ObjectId, ref: 'user' },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'user' },
}, { timestamps: true, strict: false })

module.exports = mongoose.model('order', OrderSchema);