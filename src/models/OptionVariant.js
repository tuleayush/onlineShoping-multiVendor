const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OptionVariantSchema = new Schema({
  name: { type: String, required: true, trim: true },
  property: { type: Object, default: {} },
  optionId: { type: Schema.Types.ObjectId, ref: 'option', required: true },
  productId: { type: Schema.Types.ObjectId, ref: 'product', required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('option_variant', OptionVariantSchema);