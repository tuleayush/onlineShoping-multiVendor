const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Inventorychema = new Schema({
  quantity: { type: Number, required: true },
  productOptionVariantId: { type: Schema.Types.ObjectId, ref: 'product_option_variant', required: true },
  // productId: { type: Schema.Types.ObjectId, ref: 'product', required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('inventory', Inventorychema, 'inventory');